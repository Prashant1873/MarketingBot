import { SYSTEM_PROMPT, buildUserPrompt } from "../prompts.js";

export async function generateWithOpenAI(params, apiKey) {
  if (!apiKey) throw new Error("OpenAI API key is required.");

  const { imageBase64, imageMimeType = "image/png" } = params;
  const userText = buildUserPrompt({ ...params, hasImage: Boolean(imageBase64) });

  const userContent = [];

  if (imageBase64) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: `data:${imageMimeType};base64,${imageBase64}`,
      },
    });
  }

  userContent.push({
    type: "text",
    text: userText,
  });

  const payload = {
    model: "gpt-4o",
    temperature: 0.7,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenAI API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const textResponse = data.choices?.[0]?.message?.content;
  if (!textResponse) {
    throw new Error("No response content received from OpenAI.");
  }

  return JSON.parse(textResponse);
}
