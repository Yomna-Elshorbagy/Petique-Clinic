import React, { useState } from "react";
import { X } from "lucide-react";
import ChatIcon from "@mui/icons-material/Chat";
import { jwtDecode } from "jwt-decode";
import { useChat } from "../../Hooks/Chat/useChat";
import type { TokenPayload } from "../../Interfaces/ITokenPayload";

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("accessToken");
  let user: TokenPayload | null = null;

  if (token) {
    try {
      user = jwtDecode<TokenPayload>(token);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const { messages, input, setInput, loading, handleSend } = useChat({ user });

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-(--color-light-accent) hover:bg-[#D98C33] transition text-white rounded-full shadow-lg flex items-center justify-center z-[999999]"
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

            {loading && <p className="text-gray-400 italic">Typing...</p>}
          </div>

          {/* Input */}
          <div className="flex border-t">
            <input
              type="text"
              className="flex-1 px-3 py-2 text-sm outline-none"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (!loading) handleSend();
                }
              }}
              disabled={loading}
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="px-4 bg-(--color-light-accent) text-white text-sm hover:bg-[#D98C33] transition"
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
