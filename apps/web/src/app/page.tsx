"use client";

import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! I'm Synova AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    apiUrl: "http://localhost:8001",
    temperature: 0.7,
    maxTokens: 4096,
    mode: "chat"
  });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(`${settings.apiUrl}/chat/stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          mode: settings.mode,
          temperature: settings.temperature,
          max_tokens: settings.maxTokens
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const assistantMessage = { role: "assistant", content: "" };
      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'token' && data.content) {
                assistantMessage.content += data.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1] = { ...assistantMessage };
                  return newMessages;
                });
              } else if (data.type === 'done') {
                setLoading(false);
                return;
              } else if (data.type === 'error') {
                throw new Error(data.message);
              }
            } catch (e) {
              console.error('Error parsing SSE:', e);
            }
          }
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Error: " + errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-900 text-white">
      <header className="bg-zinc-800 p-4 border-b border-zinc-700 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-rose-500">Synova AI</h1>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded"
        >
          Settings
        </button>
      </header>

      {showSettings && (
        <div className="bg-zinc-800 p-4 border-b border-zinc-700">
          <div className="grid grid-cols-2 gap-4 max-w-2xl">
            <div>
              <label htmlFor="apiUrl" className="block text-sm mb-1">API URL</label>
              <input
                id="apiUrl"
                type="text"
                value={settings.apiUrl}
                onChange={(e) => setSettings({...settings, apiUrl: e.target.value})}
                className="w-full bg-zinc-700 border border-rose-500 text-white px-3 py-2 rounded"
              />
            </div>
            <div>
              <label htmlFor="mode" className="block text-sm mb-1">Mode</label>
              <select
                id="mode"
                value={settings.mode}
                onChange={(e) => setSettings({...settings, mode: e.target.value})}
                className="w-full bg-zinc-700 border border-rose-500 text-white px-3 py-2 rounded"
              >
                <option value="chat">Chat</option>
                <option value="supanova">Supanova</option>
                <option value="deep_research">Deep Research</option>
                <option value="rag">RAG</option>
                <option value="autopilot">Autopilot</option>
              </select>
            </div>
            <div>
              <label htmlFor="temperature" className="block text-sm mb-1">Temperature: {settings.temperature}</label>
              <input
                id="temperature"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={settings.temperature}
                onChange={(e) => setSettings({...settings, temperature: parseFloat(e.target.value)})}
                className="w-full"
              />
            </div>
            <div>
              <label htmlFor="maxTokens" className="block text-sm mb-1">Max Tokens: {settings.maxTokens}</label>
              <input
                id="maxTokens"
                type="number"
                value={settings.maxTokens}
                onChange={(e) => setSettings({...settings, maxTokens: parseInt(e.target.value)})}
                className="w-full bg-zinc-700 border border-rose-500 text-white px-3 py-2 rounded"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[80%] p-4 rounded-lg ${
              msg.role === "user"
                ? "ml-auto bg-rose-600 text-white"
                : "mr-auto bg-zinc-700 text-zinc-100"
            }`}
          >
            <div className="whitespace-pre-wrap">{msg.content}</div>
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-zinc-700 text-zinc-100 max-w-[80%] p-4 rounded-lg">
            Thinking...
          </div>
        )}
      </div>

      <div className="bg-zinc-800 p-4 border-t border-zinc-700 flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          disabled={loading}
          className="flex-1 bg-zinc-700 border border-rose-500 text-white px-4 py-3 rounded-lg disabled:opacity-50"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  );
}
