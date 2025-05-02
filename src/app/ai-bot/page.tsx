"use client"
import React from "react";
import { useChat } from "@ai-sdk/react";

function AIChat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  console.log(messages, "messages");
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map((message) => (
        <div key={message.id} className="whitespace-pre-wrap">
          <strong>{message.role === "user" ? "User" : "AI"}:</strong>{" "}
          {message.content}
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Di algo..."
          onChange={handleInputChange}
          className="fixed dark:bg-zing-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
        />
      </form>
    </div>
  );
}

export default AIChat;
