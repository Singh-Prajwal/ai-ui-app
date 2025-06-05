"use client";
import Chat from "@/components/Chat";
import React, { useState } from "react";
import { useTheme } from "next-themes";
import Feedback from "@/components/Feedback";
import { supabase } from "@/lib/supabase";
import { InterviewInsert } from "../types/supabase";
import { motion } from "framer-motion";
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
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) throw new Error("File upload failed");

      const data = await response.json();
      setResumeText(data.name || "");
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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <Alert
          type={error.type}
          message={error.message}
          onClose={() => setError(null)}
        />
      )}
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-morphism rounded-2xl p-8 sm:p-10"
        >
          <div className="w-full max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Interview Assistant
            </h1>

            {feedback ? (
              <Feedback feedback={feedback} />
            ) : (
              <>
                {!isInterviewActive && !feedback && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-lg font-medium">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-lg font-medium">
                        Upload Resume
                      </label>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-200"
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="block text-lg font-medium">
                        Job Description *
                      </label>
                      <textarea
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        placeholder="Enter the job description"
                        className="w-full px-4 py-3 rounded-xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
                        required
                      />
                    </div>

                    {skills.length > 0 && (
                      <div className="p-4 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
                        <h3 className="font-semibold mb-2">Detected Skills:</h3>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      onClick={startInterview}
                      disabled={!isFormValid() || loading}
                      className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                        !isFormValid() || loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      }`}
                    >
                      {loading && !messages.length
                        ? "Analyzing Resume..."
                        : "Start Interview"}
                    </button>
                  </div>
                )}

                {isInterviewActive && (
                  <div className="space-y-6">
                    <Chat
                      messages={messages}
                      onSend={sendMessage}
                      onEnd={endInterview}
                      isInterviewActive={isInterviewActive}
                      currentQuestion={currentQuestion}
                      totalQuestions={10}
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={endInterview}
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        disabled={loading}
                      >
                        End Interview
                      </button>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="fixed bottom-4 right-4 glass-morphism px-6 py-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      <span className="font-medium">
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