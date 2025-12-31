import React, { useState } from "react";
import { X, Search } from "lucide-react";
import type { IUser } from "../../../Interfaces/IChat";

interface UserSelectorProps {
  users: IUser[];
  onSelectUser: (user: IUser) => void;
  onClose: () => void;
  onSearch: (search?: string) => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  onSelectUser,
  onClose,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      petOwner: "bg-blue-100 text-blue-800",
      doctor: "bg-green-100 text-green-800",
      staff: "bg-purple-100 text-purple-800",
      owner: "bg-yellow-100 text-yellow-800",
      admin: "bg-red-100 text-red-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[var(--color-border-light)] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Select User to Chat
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--color-bg-cream)] rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[var(--color-border-light)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2 border border-[var(--color-border-light)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-light-accent)]"
            />
          </div>
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto p-4">
          {users.length === 0 ? (
            <div className="text-center py-8 text-[var(--color-text-muted)]">
              <div className="text-4xl mb-2">👤</div>
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map((user) => (
                <div
                  key={user._id}
                  onClick={() => onSelectUser(user)}
                  className="p-3 rounded-lg hover:bg-[var(--color-bg-cream)] cursor-pointer transition flex items-center gap-3"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-light-accent)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.image?.secure_url ? (
                      <img
                        src={user.image.secure_url}
                        alt={user.userName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-semibold">
                        {user.userName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[var(--color-text-primary)] truncate">
                      {user.userName}
                    </h4>
                    <p className="text-sm text-[var(--color-text-muted)] truncate">
                      {user.email}
                    </p>
                    <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;


