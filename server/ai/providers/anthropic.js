import { SYSTEM_PROMPT, buildUserPrompt } from "../prompts.js";

export async function generateWithAnthropic(params, apiKey) {
  if (!apiKey) throw new Error("Anthropic API key is required.");

  const { imageBase64, imageMimeType = "image/png" } = params;
  const userText = buildUserPrompt({ ...params, hasImage: Boolean(imageBase64) });

  const content = [];

  if (imageBase64) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: imageMimeType,
        data: imageBase64,
      },
    });
  }

  content.push({
    type: "text",
    text: userText,
  });

  const payload = {
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 2000,
    temperature: 0.7,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content,
      },
    ],
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Anthropic API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const textResponse = data.content?.[0]?.text;
  if (!textResponse) {
    throw new Error("No response content received from Anthropic.");
  }

  // Parse JSON, trimming any accidental markdown markers
  const cleanJson = textResponse.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();
  return JSON.parse(cleanJson);
}
