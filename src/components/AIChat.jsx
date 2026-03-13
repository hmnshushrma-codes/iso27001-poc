import { useState, useRef, useEffect } from "react";
import { sendMessage, getProviderInfo } from "../services";
import { SUGGESTED_QUESTIONS } from "../constants";

/**
 * Renders markdown-like text: **bold**, \n line breaks, • bullets
 */
function RenderText({ text }) {
  return text.split("\n").map((line, li) => (
    <div key={li} style={{ marginBottom: line === "" ? 6 : 1 }}>
      {line.split("**").map((part, pi) =>
        pi % 2 === 1
          ? <strong key={pi} style={{ color: "#e0e0e0" }}>{part}</strong>
          : <span key={pi}>{part}</span>
      )}
    </div>
  ));
}

export default function AIChat({ orgName, orgScope, metrics }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const provider = getProviderInfo();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);

    try {
      const context = {
        orgName,
        orgScope,
        assessed: metrics.assessed,
        score: metrics.score,
      };

      const result = await sendMessage(msg, context);

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: result.text,
          provider: result.provider,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `⚠️ Error: ${err.message}. Please try again.`,
          provider: "error",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
      {/* Empty state with suggestions */}
      {messages.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#3a3f55" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{provider.icon}</div>
          <p style={{ fontSize: 15, color: "#5a5f75", marginBottom: 6 }}>
            Ask me anything about ISO 27001:2022
          </p>
          <p style={{ fontSize: 11, color: "#3a3f55", marginBottom: 20 }}>
            Powered by {provider.name}
          </p>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            justifyContent: "center", maxWidth: 600, margin: "0 auto",
          }}>
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                style={{
                  background: "#12121a", border: "1px solid #1e1e30",
                  borderRadius: 8, padding: "8px 14px", color: "#818cf8",
                  fontSize: 12, cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflow: "auto", padding: "0 0 20px" }}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 10,
            }}
          >
            <div style={{
              maxWidth: "75%", padding: "10px 14px",
              borderRadius: m.role === "user" ? "10px 10px 2px 10px" : "10px 10px 10px 2px",
              background: m.role === "user" ? "#2563eb22" : "#12121a",
              border: `1px solid ${m.role === "user" ? "#2563eb44" : "#1e1e30"}`,
              fontSize: 13, lineHeight: 1.7, color: "#c0c0d0",
            }}>
              {m.role === "ai" && (
                <div style={{ fontSize: 10, color: "#818cf8", fontWeight: 700, marginBottom: 4 }}>
                  {provider.icon} ISO 27001 AI Consultant
                  {m.provider && m.provider !== provider.provider && (
                    <span style={{ color: "#5a5f75", fontWeight: 400 }}> · fallback</span>
                  )}
                </div>
              )}
              <RenderText text={m.text} />
            </div>
          </div>
        ))}
        {isTyping && (
          <div style={{ fontSize: 12, color: "#818cf8", padding: "8px 14px" }}>
            {provider.icon} Thinking...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={{ display: "flex", gap: 8, padding: "12px 0 0", borderTop: "1px solid #1a1a2e" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about ISO 27001 controls, policies, risk assessment, audit prep..."
          disabled={isTyping}
          style={{
            flex: 1, background: "#12121a", border: "1px solid #1e1e30",
            borderRadius: 8, padding: "12px 14px", fontSize: 13,
            color: "#e0e0e0", outline: "none",
            opacity: isTyping ? 0.6 : 1,
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isTyping || !input.trim()}
          style={{
            background: "linear-gradient(135deg, #2563eb, #7c3aed)",
            border: "none", borderRadius: 8, padding: "12px 20px",
            color: "#fff", fontSize: 13, fontWeight: 600,
            cursor: isTyping || !input.trim() ? "not-allowed" : "pointer",
            opacity: isTyping || !input.trim() ? 0.5 : 1,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
