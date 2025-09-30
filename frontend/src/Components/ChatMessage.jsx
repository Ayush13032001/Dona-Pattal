import ChatbotIcon from "./ChatbotIcon";
import { DotLoader } from "../App";

const ChatMessage = ({ chat }) => {
  if (chat.hideInChat) return null;

  return (
    <div className={`message ${chat.role === "model" ? "bot-message" : "user-message"}`}>
      {chat.role === "model" && <ChatbotIcon />}
      <p className="message-text">{chat.isLoader ? <DotLoader /> : chat.text}</p>
    </div>
  );
};

export default ChatMessage;
