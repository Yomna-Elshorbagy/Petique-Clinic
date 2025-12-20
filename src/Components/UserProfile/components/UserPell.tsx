import { useState } from "react";
import axios from "axios";
import { Bell } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { baseURL } from "../../../Apis/BaseUrl";
import { useNotifications } from "../../../Hooks/UserProfile/useUserPets";

export default function NotificationBell() {
  const token = localStorage.getItem("accessToken");
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);

  /* Close dropdown when clicking outside logic can be added here if needed */

  const { data: notifications, unreadCount } = useNotifications();

  const markAsRead = async (id: string) => {
    await axios.put(
      `${baseURL}/auth/notifications/${id}/read`,
      {},
      {
        headers: { authentication: `bearer ${token}` },
      }
    );

    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative cursor-pointer hover:text-orange-500 transition-colors"
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[18px]">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden z-50 border border-gray-100 dark:border-gray-700">
          <div className="p-3 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
          </div>

          <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
            {notifications?.length ? (
              notifications.slice(0, 15).map((n: any) => (
                <div
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${n.isRead
                    ? "opacity-60 bg-white dark:bg-gray-800"
                    : "bg-orange-50/50 dark:bg-gray-700/30"
                    }`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <p className={`text-sm ${!n.isRead && "font-semibold"} text-gray-800 dark:text-gray-200`}>
                      {n.title}
                    </p>
                    {!n.isRead && <span className="h-2 w-2 mt-1.5 rounded-full bg-orange-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{n.message}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <Bell size={32} className="opacity-20 mb-2" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
