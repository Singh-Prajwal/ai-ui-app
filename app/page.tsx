"use client";
import Chat from "@/components/Chat";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import Feedback from "@/components/Feedback";

type Message = {
  role: "ai" | "user";
  content: string;
};

export default function Home() {
  const { theme } = useTheme();

  const [resumeText, setResumeText] = useState("");
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [resume, setResume] = useState<any>();
  const [jobDesc, setJobDesc] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setIsReady(false);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      setResumeText(data.text || "");
      setName(data.name || "");
      setSkills(data.skills || []);
      setIsReady(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to process resume.");
    } finally {
      setLoading(false);
    }
  };

  const startInterview = async () => {
    setIsInterviewActive(true);
    setFeedback(null);
    setMessages([]);
    setLoading(true);

    try {
      const res = await fetch("/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, skills, history: [], jobDesc }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      const firstQuestion = data.question || "Walk me through your resume.";
      setQuestions([firstQuestion]);
      setMessages([{ role: "ai", content: firstQuestion }]);
    } catch (err) {
      console.error("Interview start failed:", err);
      setMessages([
        {
          role: "ai",
          content:
            "Let's start with: Describe your most relevant technical experience.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (text: string) => {
    const updatedMessages = [...messages, { role: "user", content: text }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/interview/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, history: updatedMessages }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const newAiMessage = { role: "ai", content: data.question };
      const finalMessages = [...updatedMessages, newAiMessage];
      setMessages(finalMessages);

      const aiQuestionCount = finalMessages.filter(
        (m) => m.role === "ai"
      ).length;
      if (aiQuestionCount >= 10 && isInterviewActive) {
        await endInterview();
      }
    } catch (err) {
      console.error("Error getting next question:", err);
      setMessages([
        ...updatedMessages,
        { role: "ai", content: "Error getting next question. Try again!" },
      ]);
    } finally {
      const aiCount = messages.filter((m: any) => m.role === "ai").length;
      if (!(aiCount >= 10 && isInterviewActive)) {
        setLoading(false);
      }
    }
  };

  const endInterview = async () => {
    setLoading(true);
    setIsInterviewActive(false);

    try {
      const res = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, transcript: messages }),
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setFeedback(
        data.feedback || "Thank you! Interview feedback unavailable."
      );
    } catch (err) {
      console.error("Error getting feedback:", err);
      setFeedback("Error getting feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 transition-all duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full max-w-2xl rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800 transition-colors">
        <h1 className="text-3xl font-bold mb-6 text-center">
          AI Interview Bot
        </h1>

        {!isInterviewActive && !feedback && (
          <>
            <label className="block mb-2 font-medium">Upload Resume</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="mb-4 w-full border rounded p-2 bg-white dark:bg-gray-700 dark:border-gray-600"
              disabled={loading}
            />
            <input
              type="text"
              placeholder="Job Description (optional)"
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              className="mb-4 w-full border rounded p-2 bg-white dark:bg-gray-700 dark:border-gray-600"
            />
            {name && (
              <p className="mb-2">
                <strong>Name:</strong> {name}
              </p>
            )}
            {skills.length > 0 && (
              <p className="mb-4">
                <strong>Skills:</strong> {skills.join(", ")}
              </p>
            )}

            <button
              onClick={startInterview}
              disabled={!isReady || loading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                !isReady || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading && !messages.length
                ? "Analyzing Resume..."
                : "Start Interview"}
            </button>
          </>
        )}

        {(isInterviewActive || feedback) && (
          <>
            <div className="mt-6">
              <Chat
                messages={messages}
                onSend={sendMessage}
                onEnd={endInterview}
                isInterviewActive={isInterviewActive}
              />

              {feedback && <Feedback feedback={feedback} />}
            </div>

            <div className="flex justify-end mt-4">
              {isInterviewActive && (
                <button
                  onClick={endInterview}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                  disabled={loading}
                >
                  End Interview
                </button>
              )}
            </div>
          </>
        )}

        {loading && (
          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-300 animate-pulse">
            Processing...
          </div>
        )}
      </div>
    </main>
  );
}
