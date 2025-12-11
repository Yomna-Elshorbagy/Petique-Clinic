import React, { useState, useEffect } from "react";
import { FaTimes, FaUserEdit } from "react-icons/fa";
import type { IUpdateUser } from "../../../../Interfaces/IUser";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../../Store/store";
import { updateUserThunk } from "../../../../Store/User/UserThunks";
import type { UserEditModalProps } from "../../../../Interfaces/components/userProps";
import { FaUser, FaPhone, FaVenusMars } from "react-icons/fa";

const UserEditModal: React.FC<UserEditModalProps> = ({ open, onClose, user }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<IUpdateUser>({
    userName: "",
    mobileNumber: "",
    gender: "female",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName,
        mobileNumber: user.mobileNumber,
        gender: user.gender,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      dispatch(updateUserThunk({ id: user._id, data: formData }));
      onClose();
    }
  };

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-(--color-light-background) border border-(--color-light-secondary)/40 rounded-2xl shadow-xl animate-fadeIn">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-(--color-light-primary) text-(--color-light-dark) px-6 py-4 rounded-t-2xl border-b border-(--color-light-secondary)/40">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FaUserEdit /> Edit User
          </h2>
          <button onClick={onClose} className="hover:text-(--color-light-accent) transition">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-(--color-light-dark)">
          <section>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-(--color-light-accent)">
              <FaUserEdit /> Basic Information
            </h3>

            <div className="mt-3 border border-(--color-light-secondary)/40 rounded-xl p-4 bg-(--color-extra-5) grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-medium mb-1 flex items-center gap-2">
                    <FaUser /> UserName
                </label>
                <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#A98868]/50 bg-[#FCF9F4] focus:ring-2 focus:ring-[#C58D52] outline-none"
                />
                </div>

                <div>
                <label className="font-medium mb-1 flex items-center gap-2">
                    <FaPhone /> Mobile Number
                </label>
                <input
                    type="text"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#A98868]/50 bg-[#FCF9F4] focus:ring-2 focus:ring-[#C58D52] outline-none"
                />
                </div>

                <div>
                <label className="font-medium mb-1 flex items-center gap-2">
                    <FaVenusMars /> Gender
                </label>
                <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-3 rounded-xl border border-[#A98868]/50 bg-[#FCF9F4] focus:ring-2 focus:ring-[#C58D52] outline-none"
                >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                </div>
            </div>
          </section>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-white bg-(--color-light-secondary) hover:bg-(--color-light-accent) transition-all duration-300 shadow-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg text-white bg-(--color-light-accent) hover:bg-(--color-light-secondary) transition-all duration-300 shadow-md"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEditModal;
