import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import ProgressBar from "./Progressbar";

type Message = {
  role: "ai" | "user";
  content: string;
};

interface ChatProps {
  messages: Message[];
  onSend: (msg: string) => void;
  onEnd: () => void;
  feedback?: string;
  isInterviewActive: boolean;
  isLoading?: boolean;
  error?: string | null;
  currentQuestion?: number;
  totalQuestions?: number;
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onSend,
  onEnd,
  isInterviewActive,
  feedback,
  isLoading = false,
  error = null,
  currentQuestion = 1,
  totalQuestions = 10,
}) => {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && isInterviewActive) {
      inputRef.current?.focus();
    }
  }, [isLoading, isInterviewActive]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-[600px] glass-morphism rounded-xl p-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-semibold">
          {isInterviewActive ? "Interview Session" : "Feedback"}
        </h3>
        {isInterviewActive && (
          <button
            onClick={onEnd}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800 transition-all duration-300"
          >
            End Interview
          </button>
        )}
      </div>

      {isInterviewActive && (
        <ProgressBar current={currentQuestion} total={totalQuestions} />
      )}

      <div className="flex-1 overflow-y-auto space-y-6 mb-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        {messages.length === 0 && !feedback && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
            <div className="w-16 h-16 mb-4 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-xl font-semibold mb-2">
              {isInterviewActive
                ? "Ready to Begin"
                : "Complete the Interview for Feedback"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {isInterviewActive
                ? "Your AI interviewer will start asking questions shortly"
                : "Answer the questions to receive detailed feedback"}
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "ai" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-xl ${
                m.role === "ai"
                  ? "bg-white/50 dark:bg-gray-800/50"
                  : "bg-blue-600 text-white"
              } backdrop-blur-sm shadow-sm`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold">
                  {m.role === "ai" ? "AI Interviewer" : "You"}
                </span>
              </div>
              <p className="leading-relaxed">{m.content}</p>
            </div>
          </div>
        ))}

        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div className="max-w-[85%] p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isInterviewActive && (
        <form
          onSubmit={handleSubmit}
          className="flex gap-3 mt-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-2 rounded-xl"
        >
          <input
            ref={inputRef}
            className="flex-1 px-4 py-3 rounded-xl bg-transparent border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-all duration-300"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Processing..." : "Type your answer..."}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`px-6 rounded-xl flex items-center justify-center transition-all duration-300 ${
              !input.trim() || isLoading
                ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <span className="text-lg">→</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat