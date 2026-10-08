import { SYSTEM_PROMPT, buildUserPrompt } from "../prompts.js";

const CANDIDATE_MODELS = [
  "gemini-flash-latest",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
];

export async function generateWithGemini(params, apiKey) {
  if (!apiKey) throw new Error("Gemini API key is required.");

  const { imageBase64, imageMimeType = "image/png" } = params;
  const userText = buildUserPrompt({ ...params, hasImage: Boolean(imageBase64) });

  const parts = [{ text: userText }];

  if (imageBase64) {
    parts.push({
      inline_data: {
        mime_type: imageMimeType,
        data: imageBase64,
      },
    });
  }

  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: [
      {
        role: "user",
        parts,
      },
    ],
    generationConfig: {
      temperature: 0.7,
      response_mime_type: "application/json",
    },
  };

  let lastError = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Gemini API error (${res.status}): ${errorText}`);
      }

      const data = await res.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!textResponse) {
        throw new Error("No response content received from Gemini.");
      }

      return JSON.parse(textResponse);
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] Model ${model} failed (${err.message}). Trying next candidate model...`);
    }
  }

  throw lastError || new Error("All Gemini candidate models failed.");
}
