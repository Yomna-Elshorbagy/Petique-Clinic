import React from "react";
import { FaTimes, FaUser, FaInfoCircle } from "react-icons/fa";
import type { UserModalProps } from "../../../../Interfaces/components/userProps";

const UserModal: React.FC<UserModalProps> = ({ open, onClose, user }) => {
  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="
          relative w-full max-w-md max-h-[90vh] overflow-y-auto 
          bg-(--color-light-background)
          border border-(--color-light-secondary)/40
          rounded-2xl shadow-xl animate-fadeIn
        "
      >
        {/* Header */}
        <div
          className="
            flex justify-between items-center 
            bg-(--color-light-primary)
            text-(--color-light-dark)
            px-6 py-4 rounded-t-2xl border-b border-(--color-light-secondary)/40
          "
        >
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaUser /> User Details
          </h2>
          <button
            onClick={onClose}
            className="hover:text-(--color-light-accent) transition"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-(--color-light-dark)">
          {/* BASIC INFO */}
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-(--color-light-accent)">
              <FaInfoCircle /> Basic Information
            </h3>

            <div
              className="
                mt-3 border border-(--color-light-secondary)/40 rounded-xl p-4
                bg-(--color-extra-5)
              "
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-2">
                <p><strong>ID:</strong> {user._id}</p>
                <p><strong>Name:</strong> {user.userName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.mobileNumber || "Not Provided"}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="
            flex justify-end p-4 border-t border-(--color-light-secondary)/40 
            bg-(--color-extra-5)
          "
        >
          <button
            onClick={onClose}
            className="
              px-4 py-2 rounded-lg text-white 
              bg-(--color-light-accent) hover:bg-(--color-light-secondary)
              transition-all duration-300 shadow-md
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;
