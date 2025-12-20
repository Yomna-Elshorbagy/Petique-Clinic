import React, { useState } from "react";
import { X, Image as ImageIcon, Send } from "lucide-react";
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

  const {
    messages,
    input,
    setInput,
    loading,
    handleSend,
    handleImageSend,
  } = useChat({ user });

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
        <div
          className="
            fixed bottom-24 right-6 
            w-[420px] h-[560px]   /* 🔥 FIX: bigger chat */
            bg-white shadow-2xl rounded-2xl border 
            flex flex-col overflow-hidden z-[999998]
          "
        >
          {/* Header */}
          <div className="bg-[#E5A85C] text-white px-4 py-3 flex justify-between items-center">
            <h6 className="font-semibold">Petique Assistant</h6>
            <small>{user ? `Hi, ${user.name}` : "Guest 💬"}</small>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl max-w-[85%] ${
                  msg.role === "user"
                    ? "ml-auto bg-orange-200 text-right"
                    : "mr-auto bg-gray-200"
                }`}
              >
                {msg.type === "image" ? (
                  <img
                    src={msg.content}
                    className="rounded-lg max-w-full"
                    alt="uploaded"
                  />
                ) : (
                  msg.content
                )}
              </div>
            ))}

            {loading && (
              <p className="text-gray-400 italic text-xs">Typing...</p>
            )}
          </div>

          {/* Footer */}
          <div className="border-t bg-white p-3">
            <div className="flex items-center gap-2">
              {/* Image Upload Button */}
              <label className="cursor-pointer text-gray-500 hover:text-[#E5A85C]">
                <ImageIcon size={20} />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden" // 🔥 FIX: hide ugly input
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleImageSend(e.target.files[0]);
                      e.target.value = "";
                    }
                  }}
                />
              </label>

              {/* Text Input */}
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm outline-none border rounded-lg"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !loading) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading}
              />

              {/* Send Button */}
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="p-2 bg-(--color-light-accent) text-white rounded-lg hover:bg-[#D98C33] transition disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
