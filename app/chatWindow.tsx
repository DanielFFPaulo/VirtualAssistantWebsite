"use client";

import { useState } from "react";
import { Message } from "./message";

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId] = useState(
    () => `chat-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
  );

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch(" http://100.116.93.26:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId,
        message: userMessage.content,
      }),
    });

    const data = await res.json();

    const botMessage: Message = {
      role: "assistant",
      content: data.reply,
    };

    setMessages((prev) => [...prev, botMessage]);
    let utterance = new SpeechSynthesisUtterance(data.reply);
    speechSynthesis.speak(utterance);
  };
  const recognition = new ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)();
  const synth = window.speechSynthesis;
  // Set the language
  recognition.lang = "en-US";

  // Event listener for when speech is recognized
  recognition.onresult = (event: { results: { transcript: any }[][] }) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
    console.log("You said: ", transcript);
  };
  // Event listener for when the recognition ends
  recognition.onend = () => {
    console.log("Recognition ended.");
  };

  recognition.onerror = (event: { error: any }) => {
    console.error("Speech recognition error:", event.error);
  };

  function handleVoice(): void {
    // Create a new SpeechRecognition object

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => {
        recognition.start();
      })
      .catch((error) => {
        console.error("Microphone permission denied:", error);
      });
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <div
        style={{
          border: "1px solid #ccc",
          padding: 12,
          minHeight: 300,
          marginBottom: 12,
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong>{" "}
            {msg.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={handleVoice}>Say</button>
      </div>
    </div>
  );
}
