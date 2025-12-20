import { useState } from "react";
import Swal from "sweetalert2";
import { sendChatPrompt, sendImagePrompt } from "../../Components/Chat/Instance";

// Message interface for chat
export interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "image"; // only used for rendering images in UI
}

interface UseChatProps {
  user: any;
}

export const useChat = ({ user }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "How can I help you today?", type: "text" },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * SEND TEXT MESSAGE
   */
  const handleSend = async () => {
    if (!input.trim()) return;

    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please login first to start chatting.",
        confirmButtonColor: "#D98C33",
      });
      return;
    }

    const newUserMsg: Message = {
      role: "user",
      content: input,
      type: "text",
    };

    // Show user message immediately
    setMessages((prev) => [...prev, newUserMsg]);
    setInput("");
    setLoading(true);

    try {
      const systemPrompt = {
        role: "system",
        content: `
          You are a professional veterinarian.
          Rules:
          1. Only answer questions related to pets, symptoms, animal care, nutrition, diseases, vaccinations, or pet behavior.
          2. If user asks ANYTHING unrelated: respond with
             "I can only answer clinic-related pet questions"
          3. Keep answers short (2–3 sentences).
          4. End responses WITH disclaimer ONLY IF related:
             "I am not an expert source. For more accurate guidance, please contact our clinic in working hours: Open: 10am – 10pm Daily."
        `,
      };

      const apiMessages = messages
        .filter((m) => m.type !== "image")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const reply = await sendChatPrompt([
        systemPrompt,
        ...apiMessages,
        { role: "user", content: input },
      ]);

      // Assistant message (text only, no type)
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * SEND IMAGE MESSAGE
   */
  const handleImageSend = async (file: File) => {
    if (!user) return;

    setLoading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;

        // Show user image immediately
        setMessages((prev) => [
          ...prev,
          { role: "user", content: base64, type: "image" },
        ]);

        // Send image to backend for AI diagnosis
        const res = await sendImagePrompt(base64);

        // Show assistant diagnosis (text only!)
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.diagnosis },
        ]);
      } catch (err: any) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: err.message },
        ]);
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return {
    messages,
    input,
    loading,
    setInput,
    handleSend,
    handleImageSend,
  };
};
