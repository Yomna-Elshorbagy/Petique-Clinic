import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import ChatIcon from "@mui/icons-material/Chat";
import { toast } from "react-toastify";

interface User {
  name: string;
  email: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!user) {
      toast.error("Please enter your name and email to start chatting");
      return;
    }

    const newMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
            {
            role: "system",
            content:
                "You are a professional veterinarian. Answer all user questions with veterinary expertise, provide clear, safe guidance and suggestions for pet health, symptoms, and treatment."
            },
            ...messages,
            newMessage,
        ],
        temperature: 0.7,
        max_tokens: 1024,
        }),

      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error(errorData.error?.message || "API request failed");
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content || "No response";

      const botReply: Message = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const errorReply: Message = {
        role: "assistant",
        content: `error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#D98C33] hover:bg-orange-500 transition text-white rounded-full shadow-lg flex items-center justify-center z-[999999]"
      >
        {open ? <X size={24} /> : <ChatIcon />}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-28 right-6 w-80 bg-white shadow-xl rounded-lg border overflow-hidden z-[999998]">
          
          {/* Header */}
          <div className="bg-[#E5A85C] text-white px-4 py-3 flex justify-between items-center">
            <h6 className="font-semibold">Petique Assistant</h6>
            <small>{user ? `Hi, ${user.name}` : "Guest 💬"}</small>
          </div>

          {/* Messages */}
          <div className="p-3 h-64 overflow-y-auto bg-gray-50 text-sm space-y-2">
            {messages.length === 0 && (
              <p className="text-center text-gray-400 mt-12">Start chatting...</p>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded text-sm max-w-[90%] ${
                  msg.role === "user"
                    ? "ml-auto bg-orange-200 text-right"
                    : "mr-auto bg-gray-200"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <p className="text-gray-400 italic">Typing...</p>
            )}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm 
                outline-none 
                focus:outline-none 
                focus:ring-0 
                focus:border-transparent"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
              disabled={loading}
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 bg-[#D98C33] text-white text-sm hover:bg-[#E5A85C] transition disabled:opacity-90"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
