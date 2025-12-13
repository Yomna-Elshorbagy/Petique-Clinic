import { useState } from "react";
import Swal from "sweetalert2";
import { sendChatPrompt } from "../../Components/Chat/Instance";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UseChatProps {
  user: any;
}

export const useChat = ({ user }: UseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "How can I help you today?" }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

    const newUserMsg: Message = { role: "user", content: input };
    setMessages((p) => [...p, newUserMsg]);
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

      const reply = await sendChatPrompt([
        systemPrompt,
        ...messages,
        newUserMsg,
      ]);

      setMessages((p) => [...p, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    input,
    loading,
    setInput,
    handleSend,
  };
};
