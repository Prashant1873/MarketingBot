/**
 * Subtitle Timing Engine (TypeScript)
 * Computes word-level frame timestamps and phrase groupings
 * for kinetic animated subtitles and Remotion burn-in.
 */

export interface TimedWord {
  word: string;
  cleanWord: string;
  startFrame: number;
  endFrame: number;
  phraseIndex: number;
  isPunctuationBreak: boolean;
}

export interface TimedPhrase {
  phraseIndex: number;
  text: string;
  startFrame: number;
  endFrame: number;
  words: TimedWord[];
}

export interface SceneSubtitleTiming {
  durationFrames: number;
  words: TimedWord[];
  phrases: TimedPhrase[];
}

export interface SubtitleTimingOptions {
  leadInSec?: number;
  leadOutSec?: number;
  maxWordsPerPhrase?: number;
  maxCharsPerPhrase?: number;
}

export function analyzeWord(word: string): { cleanWord: string; weight: number; isPunctuationBreak: boolean } {
  if (!word) {
    return { cleanWord: "", weight: 1, isPunctuationBreak: false };
  }

  const clean = word.replace(/^[^\w\s]+|[^\w\s]+$/g, "");
  const hasCommaPause = /[,;:\-—]$/.test(word.trim());
  const hasSentencePause = /[.!?]$/.test(word.trim());

  let weight = Math.max(2, clean.length);

  if (hasCommaPause) {
    weight += 3;
  } else if (hasSentencePause) {
    weight += 5;
  }

  return {
    cleanWord: clean,
    weight,
    isPunctuationBreak: hasSentencePause || hasCommaPause,
  };
}

export function groupIntoPhrases(
  words: TimedWord[],
  maxWordsPerPhrase: number = 5,
  maxCharsPerPhrase: number = 28
): TimedPhrase[] {
  if (!words || words.length === 0) return [];

  const phrases: TimedPhrase[] = [];
  let currentPhraseWords: TimedWord[] = [];
  let currentChars = 0;
  let phraseIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const wordLen = w.word.length + 1;

    const reachesWordLimit = currentPhraseWords.length >= maxWordsPerPhrase;
    const reachesCharLimit = currentChars + wordLen > maxCharsPerPhrase && currentPhraseWords.length >= 2;
    const previousHadPunctuation =
      currentPhraseWords.length > 0 && currentPhraseWords[currentPhraseWords.length - 1].isPunctuationBreak;

    if (currentPhraseWords.length > 0 && (reachesWordLimit || reachesCharLimit || previousHadPunctuation)) {
      const phraseStart = currentPhraseWords[0].startFrame;
      const phraseEnd = currentPhraseWords[currentPhraseWords.length - 1].endFrame;
      phrases.push({
        phraseIndex: phraseIdx,
        text: currentPhraseWords.map((item) => item.word).join(" "),
        startFrame: phraseStart,
        endFrame: phraseEnd,
        words: [...currentPhraseWords],
      });
      phraseIdx++;
      currentPhraseWords = [];
      currentChars = 0;
    }

    w.phraseIndex = phraseIdx;
    currentPhraseWords.push(w);
    currentChars += wordLen;
  }

  if (currentPhraseWords.length > 0) {
    phrases.push({
      phraseIndex: phraseIdx,
      text: currentPhraseWords.map((item) => item.word).join(" "),
      startFrame: currentPhraseWords[0].startFrame,
      endFrame: currentPhraseWords[currentPhraseWords.length - 1].endFrame,
      words: [...currentPhraseWords],
    });
  }

  return phrases;
}

export function computeSceneWordTimestamps(
  script: string | undefined,
  durationSec: number,
  fps: number = 30,
  options: SubtitleTimingOptions = {}
): SceneSubtitleTiming {
  const durationFrames = Math.max(1, Math.round((Number(durationSec) || 3) * fps));
  const rawText = (script || "").trim();

  if (!rawText) {
    return {
      durationFrames,
      words: [],
      phrases: [],
    };
  }

  const rawWords = rawText.split(/\s+/).filter(Boolean);
  if (rawWords.length === 0) {
    return {
      durationFrames,
      words: [],
      phrases: [],
    };
  }

  const leadInFrames = Math.round((options.leadInSec ?? 0.12) * fps);
  const leadOutFrames = Math.round((options.leadOutSec ?? 0.15) * fps);

  const availableFrames = Math.max(
    rawWords.length * 4,
    durationFrames - leadInFrames - leadOutFrames
  );

  const analyzed = rawWords.map((w) => {
    const analysis = analyzeWord(w);
    return {
      word: w,
      cleanWord: analysis.cleanWord,
      weight: analysis.weight,
      isPunctuationBreak: analysis.isPunctuationBreak,
    };
  });

  const totalWeight = analyzed.reduce((sum, item) => sum + item.weight, 0);

  let currentFrame = leadInFrames;
  const timedWords: TimedWord[] = [];

  for (let i = 0; i < analyzed.length; i++) {
    const item = analyzed[i];
    const isLast = i === analyzed.length - 1;

    let wordDurationFrames: number;
    if (isLast) {
      wordDurationFrames = Math.max(3, durationFrames - leadOutFrames - currentFrame);
    } else {
      const share = item.weight / totalWeight;
      wordDurationFrames = Math.max(3, Math.round(share * availableFrames));
    }

    const startFrame = currentFrame;
    const endFrame = Math.min(durationFrames, startFrame + wordDurationFrames);

    timedWords.push({
      word: item.word,
      cleanWord: item.cleanWord,
      startFrame,
      endFrame,
      phraseIndex: 0,
      isPunctuationBreak: item.isPunctuationBreak,
    });

    currentFrame = endFrame;
  }

  const phrases = groupIntoPhrases(
    timedWords,
    options.maxWordsPerPhrase || 5,
    options.maxCharsPerPhrase || 28
  );

  return {
    durationFrames,
    words: timedWords,
    phrases,
  };
}

export function getActiveSubtitleAtFrame(
  timingData: SceneSubtitleTiming | undefined,
  frame: number
): {
  activePhrase: TimedPhrase | null;
  activeWordIndex: number;
  activeWord: TimedWord | null;
} {
  if (!timingData || !timingData.words || timingData.words.length === 0) {
    return { activePhrase: null, activeWordIndex: -1, activeWord: null };
  }

  let activePhrase = timingData.phrases.find(
    (p) => frame >= p.startFrame && frame <= p.endFrame
  ) || null;

  if (!activePhrase && timingData.phrases.length > 0) {
    if (frame < timingData.phrases[0].startFrame) {
      activePhrase = timingData.phrases[0];
    } else if (frame > timingData.phrases[timingData.phrases.length - 1].endFrame) {
      activePhrase = timingData.phrases[timingData.phrases.length - 1];
    }
  }

  let activeWordIndex = -1;
  let activeWord: TimedWord | null = null;

  for (let i = 0; i < timingData.words.length; i++) {
    const w = timingData.words[i];
    if (frame >= w.startFrame && frame <= w.endFrame) {
      activeWordIndex = i;
      activeWord = w;
      break;
    }
  }

  if (!activeWord && timingData.words.length > 0) {
    if (frame < timingData.words[0].startFrame) {
      activeWordIndex = 0;
      activeWord = timingData.words[0];
    } else if (frame > timingData.words[timingData.words.length - 1].endFrame) {
      activeWordIndex = timingData.words.length - 1;
      activeWord = timingData.words[timingData.words.length - 1];
    }
  }

  return {
    activePhrase,
    activeWordIndex,
    activeWord,
  };
}
