import React from "react";

interface UserUpdateDataProps {
  formData: {
    userName: string;
    email: string;
    mobileNumber: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  preview: string | null;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  mutation: { isPending: boolean };
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserUpdateData: React.FC<UserUpdateDataProps> = ({
  formData,
  handleChange,
  handleSubmit,
  mutation,
  showPassword,
  setShowPassword,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-5"
    >
      <div className="md:col-span-2">
        <label className="block text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-1 font-medium">
          Owner Name *
        </label>
        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          className="w-full border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-1 font-medium">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          disabled
          className="w-full border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-gray-100 dark:bg-[var(--color-dark-background)] text-gray-500 dark:text-gray-400 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] mb-1 font-medium">
          Phone Number
        </label>
        <input
          type="tel"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          className="w-full border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-amber-600"
        />
      </div>

      <div className="md:col-span-2 mt-3">
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-sm font-semibold px-4 py-2 rounded-md bg-[#F2A056] dark:bg-[var(--color-dark-accent)] text-white hover:bg-[#e9a66f] dark:hover:bg-[var(--color-dark-accent)]/80 transition"
        >
          {showPassword ? "Hide Password Fields" : "Change Password"}
        </button>

        {showPassword && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <div>
              <label className="block mb-1 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                onChange={handleChange}
                className="w-full border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>

            <div>
              <label className="block mb-1 text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)]">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                onChange={handleChange}
                className="w-full border border-[var(--color-border-light)] dark:border-[var(--color-dark-border-light)] rounded-md px-3 py-2 bg-[var(--color-bg-lighter)] dark:bg-[var(--color-dark-background)] text-[var(--color-text-primary)] dark:text-[var(--color-dark-text)] focus:outline-none focus:ring-2 focus:ring-amber-600"
              />
            </div>
          </div>
        )}
      </div>

      <div className="md:col-span-2 flex justify-end mt-4">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="px-6 py-2 rounded-md transition text-white bg-[#F19645] dark:bg-[var(--color-dark-accent)] hover:bg-[#e9a66f] dark:hover:bg-[var(--color-dark-accent)]/80"
        >
          {mutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default UserUpdateData;
