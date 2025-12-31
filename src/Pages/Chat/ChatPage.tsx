import React from "react";
import ProtectedRoutes from "../../Shared/ProtectedRoutes/ProtectedRoutes";
import ChatContainer from "../../Components/Chat/RealTimeChat/ChatContainer";

const ChatPage: React.FC = () => {
  return (
    <ProtectedRoutes>
      <ChatContainer />
    </ProtectedRoutes>
  );
};

export default ChatPage;

