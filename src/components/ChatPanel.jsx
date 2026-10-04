import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { MessageCircle, Send, Trash2, X } from "lucide-react";
import { sendChatMessage } from "../services/chatService";

const STORAGE_KEY = "dp-tr-chat-history-v1";

const WELCOME_MESSAGE = {
  role: "assistant",
  text: "Merhaba! Design Patterns TR asistaniyim. Factory, Singleton, Strategy gibi kaliplar, C# ornekleri veya OOP hakkinda sorabilirsin.",
};

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [WELCOME_MESSAGE];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [WELCOME_MESSAGE];
    return parsed
      .filter((m) => m && typeof m.text === "string")
      .map((m) => ({ role: m.role === "user" ? "user" : "assistant", text: m.text.slice(0, 4000) }))
      .slice(-50);
  } catch {
    return [WELCOME_MESSAGE];
  }
}

const ChatPanel = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-50)));
    } catch {
      // localStorage doluysa sessizce gec
    }
  }, [messages]);

  useEffect(() => {
    if (open && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open ]);
  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChatMessage({
        message: text,
        history: nextMessages.slice(-10),
        pageContext: "Sayfa yolu: " + location.pathname,
      });
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      setError(err.message || "Bir hata olustu.");
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([WELCOME_MESSAGE]);
    setError("");
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Yapay zeka sohbetini ac"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <MessageCircle size={26} />
        </button>
      )}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        aria-hidden={!open}
        className={"fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-[calc(100vw-2rem)] flex-col border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-out dark:border-gray-700 dark:bg-gray-800 sm:bottom-5 sm:right-5 sm:top-auto sm:h-[560px] sm:max-h-[calc(100vh-6rem)] sm:w-[380px] sm:rounded-2xl sm:border md:bottom-6 md:right-6 " + (open ? "translate-x-0" : "pointer-events-none translate-x-[calc(100%+3rem)]")}
      >
        <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white">
              <MessageCircle size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                Design Patterns Asistani
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Asistanı
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={clearHistory}
              aria-label="Sohbeti temizle"
              title="Sohbeti temizle"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <Trash2 size={18} />
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Sohbeti kapat"
              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div key={i} className={"flex " + (msg.role === "user" ? "justify-end" : "justify-start")}>
              <div
                className={"max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 " + (msg.role === "user" ? "rounded-br-md bg-blue-600 text-white" : "rounded-bl-md bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100")}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md bg-gray-100 px-3.5 py-2.5 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                Yaziyor...
              </div>
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
        <form onSubmit={handleSend} className="border-t border-gray-200 p-3 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Orn: Factory Pattern ne ise yarar?"
              maxLength={2000}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Mesaji gonder"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default ChatPanel;
