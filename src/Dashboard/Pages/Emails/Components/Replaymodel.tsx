import React, { useState, useEffect } from "react";
import type { IContact } from "../../../../Interfaces/IContact";

interface ReplyModalProps {
  isOpen: boolean;
  contact: IContact | null;
  onClose: () => void;
  onSend: (id: string, message: string) => void;
}

const ReplyModal = ({ isOpen, contact, onClose, onSend }: ReplyModalProps) => {
  const [replyMessage, setReplyMessage] = useState("");

  useEffect(() => {
    if (contact) {
      setReplyMessage(contact.replyMessage || "");
    }
  }, [contact]);

  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-amber-50 p-6 rounded-xl w-96 shadow-lg border border-amber-200">
        <h2 className="text-2xl font-bold mb-4 text-[#86654f]  text-center">
          Reply to {contact.fullName}
        </h2>

        <textarea
          className="w-full border border-[#e9a66f] rounded-lg p-3 mb-4 resize-none placeholder-[#86654f] focus:outline-none focus:ring-2 focus:ring-orange-300"
          rows={5}
          value={replyMessage}
          onChange={(e) => setReplyMessage(e.target.value)}
          placeholder="Write your reply here..."
        />

        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-[#e8d8c4] hover:bg-[#a98770] rounded-lg font-semibold transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold transition-colors
    ${
      replyMessage.trim()
        ? "bg-[#c6bcb3] hover:bg-[#e9a66f] text-white cursor-pointer"
        : "bg-[#e0d8cf] text-gray-400 cursor-not-allowed"
    }`}
            onClick={() => {
              if (!replyMessage.trim()) return;
              onSend(contact._id, replyMessage);
            }}
            disabled={!replyMessage.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;
