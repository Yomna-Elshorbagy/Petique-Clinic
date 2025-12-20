import { baseURL } from "../../Apis/BaseUrl";

export const sendChatPrompt = async (messages: any[]) => {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: 0.2,
      max_tokens: 80,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Chat API failed");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response";
};

export const sendImagePrompt = async (base64Image: string) => {
  const res = await fetch(`${baseURL}/chat/analyze-image`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      imageBase64: base64Image.split(",")[1],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message);
  }

  return res.json();
};
