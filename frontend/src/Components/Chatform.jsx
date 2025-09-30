import React, { useRef } from "react";

const Chatform = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;

    inputRef.current.value = "";

    // Add user message first
    setChatHistory((prev) => [...prev, { role: "user", text: userMessage }]);

    // Call generateBotResponse with updated history
    setTimeout(() => {
      generateBotResponse([...chatHistory, { role: "user", text: userMessage }]);
    }, 0);
  };

  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="message-input"
        required
      />
      <button type="submit" className="material-symbols-rounded" style={{ fontSize: "20px" }}>
        arrow_upward
      </button>
    </form>
  );
};

export default Chatform;
