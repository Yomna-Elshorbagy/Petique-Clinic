import axios from "axios";
import { baseURL } from "./BaseUrl";

const CHAT_BASE_URL = `${baseURL}/api/chat`;

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) throw new Error("No auth token");

  return {
    authentication: `bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ===> 1- Get all conversations for current user
export const getConversations = async () => {
  const response = await axios.get(`${CHAT_BASE_URL}/conversations`, {
    headers: getHeaders(),
  });
  return response.data;
};

// ===> 2- Get or create conversation with a user
export const getOrCreateConversation = async (otherUserId: string) => {
  const response = await axios.get(
    `${CHAT_BASE_URL}/conversations/${otherUserId}`,
    {
      headers: getHeaders(),
    }
  );
  return response.data;
};

// ===> 3- Get messages for a conversation
export const getMessages = async (
  conversationId: string,
  page: number = 1,
  limit: number = 50
) => {
  const response = await axios.get(
    `${CHAT_BASE_URL}/conversations/${conversationId}/messages`,
    {
      headers: getHeaders(),
      params: { page, limit },
    }
  );
  return response.data;
};

// ===> 4- Get available users for chat
export const getAvailableUsers = async (role?: string, search?: string) => {
  const response = await axios.get(`${CHAT_BASE_URL}/users`, {
    headers: getHeaders(),
    params: { role, search },
  });
  return response.data;
};

// ===> 5- Delete a message
export const deleteMessage = async (messageId: string) => {
  const response = await axios.delete(
    `${CHAT_BASE_URL}/messages/${messageId}`,
    {
      headers: getHeaders(),
    }
  );
  return response.data;
};

// ===> 6- Archive/unarchive conversation
export const toggleArchiveConversation = async (conversationId: string) => {
  const response = await axios.patch(
    `${CHAT_BASE_URL}/conversations/${conversationId}/archive`,
    {},
    {
      headers: getHeaders(),
    }
  );
  return response.data;
};
// ===> 7- Clear all chats
export const clearAllChats = async () => {
  const response = await axios.delete(`${CHAT_BASE_URL}/clear`, {
    headers: getHeaders(),
  });
  return response.data;
};
