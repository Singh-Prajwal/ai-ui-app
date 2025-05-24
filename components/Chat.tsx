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
    <div
      className={`flex flex-col h-[500px] border rounded-lg shadow-sm p-4 ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between pb-3 border-b mb-3 ${
          theme === "dark" ? "border-gray-700" : "border-gray-200"
        }`}
      >
        <h3 className="font-semibold text-lg">
          {isInterviewActive ? "Interview Session" : "Feedback"}
        </h3>
        {isInterviewActive && (
          <button
            onClick={onEnd}
            className={`px-3 py-1 rounded-md text-sm flex items-center gap-1 ${
              theme === "dark"
                ? "bg-red-900 hover:bg-red-800 text-red-100"
                : "bg-red-100 hover:bg-red-200 text-red-800"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            End Interview
          </button>
        )}
      </div>
      {isInterviewActive && (
        <ProgressBar current={currentQuestion} total={totalQuestions} />
      )}

      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && !feedback && (
          <div
            className={`flex flex-col items-center justify-center h-full text-center p-4 rounded-lg ${
              theme === "dark" ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <p className="text-lg font-medium">
              {isInterviewActive
                ? "The interview will begin shortly..."
                : "Your feedback will appear here"}
            </p>
            <p className="text-sm opacity-70 mt-1">
              {isInterviewActive
                ? "Prepare to answer questions about your experience"
                : "Complete the interview to receive detailed feedback"}
            </p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.role === "ai" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                m.role === "ai"
                  ? theme === "dark"
                    ? "bg-gray-700"
                    : "bg-gray-100"
                  : theme === "dark"
                    ? "bg-blue-600"
                    : "bg-blue-500 text-white"
              }`}
            >
              <div className="flex items-center mb-1">
                <span className="font-semibold text-sm">
                  {m.role === "ai" ? "Interviewer" : "You"}
                </span>
              </div>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          </div>
        ))}

        {isLoading && messages.length > 0 && (
          <div className="flex justify-start">
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                theme === "dark" ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                theme === "dark"
                  ? "bg-red-900 text-red-100"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {isInterviewActive && (
        <form className="flex gap-2 mt-auto" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={`flex-1 p-3 rounded-lg border focus:outline-none focus:ring-2 ${
              theme === "dark"
                ? "bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                : "border-gray-300 focus:ring-blue-400 focus:border-blue-400"
            } ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isLoading ? "Processing..." : "Type your answer..."}
            disabled={isLoading}
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-lg flex items-center justify-center ${
              !input.trim() || isLoading
                ? theme === "dark"
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
                : theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
            } transition-colors`}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Send</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default Chat;
