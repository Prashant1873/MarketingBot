/**
 * Subtitle Timing Engine
 * Computes word-level start/end frame timestamps and phrase groupings
 * based on speech pacing, word complexity, and punctuation pause weights.
 */

/**
 * Approximate syllable/character weight of a word with punctuation pauses
 * @param {string} word 
 * @returns {{ cleanWord: string, weight: number, isPunctuationBreak: boolean }}
 */
export function analyzeWord(word) {
  if (!word) {
    return { cleanWord: "", weight: 1, isPunctuationBreak: false };
  }

  const clean = word.replace(/^[^\w\s]+|[^\w\s]+$/g, "");
  const hasCommaPause = /[,;:\-—]$/.test(word.trim());
  const hasSentencePause = /[.!?]$/.test(word.trim());

  // Base weight by character length (minimum 2 to avoid tiny words vanishing too fast)
  let weight = Math.max(2, clean.length);

  // Extra weight for pauses so timing feels natural
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

/**
 * Group timed words into punchy, readable phrases (3-5 words or ~26 chars max)
 * @param {Array} words 
 * @param {number} maxWordsPerPhrase 
 * @param {number} maxCharsPerPhrase 
 * @returns {Array} Array of TimedPhrase objects
 */
export function groupIntoPhrases(words, maxWordsPerPhrase = 5, maxCharsPerPhrase = 28) {
  if (!words || words.length === 0) return [];

  const phrases = [];
  let currentPhraseWords = [];
  let currentChars = 0;
  let phraseIdx = 0;

  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const wordLen = w.word.length + 1; // +1 for space

    const reachesWordLimit = currentPhraseWords.length >= maxWordsPerPhrase;
    const reachesCharLimit = currentChars + wordLen > maxCharsPerPhrase && currentPhraseWords.length >= 2;
    const previousHadPunctuation = currentPhraseWords.length > 0 && currentPhraseWords[currentPhraseWords.length - 1].isPunctuationBreak;

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

/**
 * Compute word-level frame timestamps across a scene duration
 * @param {string} script - Narration or scene text
 * @param {number} durationSec - Duration of the scene in seconds
 * @param {number} fps - Video frames per second (default 30)
 * @param {object} options - Optional config (leadInSec, leadOutSec, maxWordsPerPhrase)
 * @returns {{ durationFrames: number, words: Array, phrases: Array }}
 */
export function computeSceneWordTimestamps(script, durationSec, fps = 30, options = {}) {
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
  const timedWords = [];

  for (let i = 0; i < analyzed.length; i++) {
    const item = analyzed[i];
    const isLast = i === analyzed.length - 1;

    let wordDurationFrames;
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

/**
 * Get the active phrase and active word at a specific relative frame in the scene
 * @param {{ words: Array, phrases: Array }} timingData
 * @param {number} frame - Current frame relative to scene start
 * @returns {{ activePhrase: object|null, activeWordIndex: number, activeWord: object|null }}
 */
export function getActiveSubtitleAtFrame(timingData, frame) {
  if (!timingData || !timingData.words || timingData.words.length === 0) {
    return { activePhrase: null, activeWordIndex: -1, activeWord: null };
  }

  // Find active phrase
  let activePhrase = timingData.phrases.find(
    (p) => frame >= p.startFrame && frame <= p.endFrame
  ) || null;

  // Fallback to closest phrase if between phrases
  if (!activePhrase && timingData.phrases.length > 0) {
    if (frame < timingData.phrases[0].startFrame) {
      activePhrase = timingData.phrases[0];
    } else if (frame > timingData.phrases[timingData.phrases.length - 1].endFrame) {
      activePhrase = timingData.phrases[timingData.phrases.length - 1];
    }
  }

  // Find active word
  let activeWordIndex = -1;
  let activeWord = null;

  for (let i = 0; i < timingData.words.length; i++) {
    const w = timingData.words[i];
    if (frame >= w.startFrame && frame <= w.endFrame) {
      activeWordIndex = i;
      activeWord = w;
      break;
    }
  }

  // If frame is before first word
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
