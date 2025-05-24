"use client";
import Chat from "@/components/Chat";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import Feedback from "@/components/Feedback";
import { supabase } from "@/lib/supabase";
import { InterviewInsert } from "../types/supabase";
import { motion } from "framer-motion";
import Link from "next/link";
import Alert from "@/components/alert";
type Message = {
  role: "ai" | "user";
  content: string;
};

export default function Home() {
  const [error, setError] = useState<{
    type: "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const { theme } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [resumeText, setResumeText] = useState<any>();
  const [name, setName] = useState("");
  const [skills, setSkills] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [resume, setResume] = useState<any>();
  const [jobDesc, setJobDesc] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const showError = (
    message: string,
    type: "error" | "warning" | "info" = "error"
  ) => {
    setError({ type, message });
    if (error) setTimeout(() => setError(null), 5000);
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      showError("Please select a file");
      return;
    }

    setLoading(true);
    setIsReady(false);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch(
        "https://ai-flask-app-2.onrender.com/api/upload",
        {
          // const response = await fetch("http://127.0.0.1:5000/api/upload", {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      setResumeText(data.name || "");
      // setName(data.name || "");
      setSkills(Object.values(data.skills).flat() || []);
      setIsReady(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      showError("Failed to process resume. Please try again.");
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
      showError("Failed to start interview. Please try again.");
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

      setCurrentQuestion(aiQuestionCount);
      if (aiQuestionCount == 10 && isInterviewActive) {
        await endInterview();
      }
    } catch (err) {
      console.error("Error getting next question:", err);
      showError("Failed to get next question. Please try again.");
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
        data.feedbackSummary ||
          "Thank you! Interview feedback at the moment try after some time."
      );
      const saveInterview = async () => {
        try {
          const interviewData: InterviewInsert = {
            candidate_name: name,
            job_description: jobDesc,
            feedback: feedback,
            transcript: messages,
            skills: skills,
          };

          const { data, error } = await supabase
            .from("interviews")
            .insert(interviewData)
            .select()
            .single();

          if (error) throw error;
          console.log("Interview saved successfully:", data);
        } catch (error) {
          console.error("Error saving interview:", error);
        }
      };
      saveInterview();
    } catch (err) {
      console.error("Error getting feedback:", err);
      setFeedback("Error getting feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => {
    return name.trim() !== "" && jobDesc.trim() !== "" && isReady;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <Alert
          type={error.type}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8"
        >
          <div className="w-full max-w-2xl rounded-xl shadow-lg p-6 bg-white dark:bg-gray-800 transition-colors">
            <h1 className="text-3xl font-bold mb-6 text-center">
              AI Interview Bot
            </h1>

            {feedback ? (
              <Feedback feedback={feedback} />
            ) : (
              <>
                {!isInterviewActive && !feedback && (
                  <>
                    <div className="mb-4">
                      <label className="block mb-2 font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full border rounded p-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>

                    <label className="block mb-2 font-medium">
                      Upload Resume
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="mb-4 w-full border rounded p-2 bg-white dark:bg-gray-700 dark:border-gray-600"
                      disabled={loading}
                    />

                    <div className="mb-4">
                      <label className="block mb-2 font-medium">
                        Job Description *
                      </label>
                      <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Enter the job description"
                        className="w-full border rounded p-2 bg-white dark:bg-gray-700 dark:border-gray-600 min-h-[100px]"
                        required
                      />
                    </div>

                    {skills.length > 0 && (
                      <p className="mb-4">
                        <strong>Skills:</strong> {skills.join(", ")}
                      </p>
                    )}

                    <button
                      onClick={startInterview}
                      disabled={!isFormValid() || loading}
                      className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                        !isFormValid() || loading
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

                {isInterviewActive && (
                  <>
                    <div className="mt-6">
                      <Chat
                        messages={messages}
                        onSend={sendMessage}
                        onEnd={endInterview}
                        isInterviewActive={isInterviewActive}
                        currentQuestion={currentQuestion}
                        totalQuestions={10}
                      />
                    </div>
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={endInterview}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold"
                        disabled={loading}
                      >
                        End Interview
                      </button>
                    </div>
                  </>
                )}

                {loading && (
                  <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white mr-2"></div>
                      <span>
                        {messages.length
                          ? "Processing response..."
                          : isReady
                            ? "Starting interview..."
                            : "Processing resume..."}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
