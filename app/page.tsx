"use client";
import Chat from "@/components/Chat";
import React, { useState } from "react";
import { useTheme } from "next-themes";

type Message = {
  role: "ai" | "user";
  content: string;
};

export default function Home() {
  const { theme } = useTheme(); // Get current theme

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

      if (!response.ok) {
        throw new Error("File upload failed");
      }

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
        body: JSON.stringify({
          name: name,
          skills: skills,
          history: [],
        }),
      });

      if (!res.ok) throw new Error(res.statusText);

      const data = await res.json();
      setQuestions(data.question || []);
      setMessages([
        {
          role: "ai",
          content:
            data.question || "Let's begin with: Walk me through your resume.",
        },
      ]);
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

      if (!res.ok) throw new Error((await res.text()) || res.statusText);

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
      const currentAiQuestionCount = messages.filter(
        (m: any) => m.role === "ai"
      ).length;
      if (!(currentAiQuestionCount >= 10 && isInterviewActive)) {
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

      if (!res.ok) throw new Error((await res.text()) || res.statusText);

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

  console.log("Current questions state (for debugging):", questions);

  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center px-4 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-100"
      }`}
    >
      <div
        className={`p-6 rounded shadow-md w-full max-w-md ${
          theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Resume Analyzer</h1>

        {!isInterviewActive && !feedback && (
          <>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="mb-4 w-full"
              disabled={loading}
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
              className={`w-full py-3 rounded font-semibold text-white ${
                !isReady || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading && !messages.length
                ? "Processing..."
                : "Start Interview"}
            </button>
          </>
        )}

        <div className="mt-6">
          {(isInterviewActive || feedback) && (
            <Chat
              messages={messages}
              onSend={sendMessage}
              onEnd={endInterview}
              feedback={feedback ?? undefined}
              isInterviewActive={isInterviewActive}
            />
          )}

          {loading && (
            <div className="text-center text-gray-400 mt-3">Loading...</div>
          )}
        </div>
      </div>
    </main>
  );
}
// "use client";
// import Chat from "@/components/Chat";
// import React, { useState } from "react";

// type Message = {
//   role: "ai" | "user";
//   content: string;
// };

// export default function Home() {
//   const [resumeText, setResumeText] = useState("");
//   const [name, setName] = useState("");
//   const [skills, setSkills] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [resume, setResume] = useState<any>(); // This state is initialized but not explicitly set in the provided code.
//   const [jobDesc, setJobDesc] = useState<string>(""); // This state is initialized but not used.
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isInterviewActive, setIsInterviewActive] = useState(false);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<string[]>([]); // This state is set but not directly rendered.

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     setIsReady(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed");
//       }

//       const data = await response.json();
//       setResumeText(data.text || "");
//       setName(data.name || "");
//       setSkills(data.skills || []);
//       setIsReady(true);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Failed to process resume.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startInterview = async () => {
//     setIsInterviewActive(true);
//     setFeedback(null);
//     setMessages([]); // Clear previous messages
//     setLoading(true);

//     try {
//       const res = await fetch("/api/interview/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name,
//           skills: skills,
//           history: [], // Start with an empty history
//         }),
//       });

//       if (!res.ok) throw new Error(res.statusText);

//       const data = await res.json();
//       setQuestions(data.question || []); // Store questions if needed, though not directly rendered
//       setMessages([
//         {
//           role: "ai",
//           content:
//             data.question || "Let's begin with: Walk me through your resume.",
//         },
//       ]);
//     } catch (err) {
//       console.error("Interview start failed:", err);
//       setMessages([
//         {
//           role: "ai",
//           content:
//             "Let's start with: Describe your most relevant technical experience.", // Fallback question
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async (text: string) => {
//     const updatedMessages = [...messages, { role: "user", content: text }];
//     setMessages(updatedMessages); // Show user's message immediately
//     setLoading(true);

//     try {
//       const res = await fetch("/api/interview/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resume, history: updatedMessages }), // `resume` is passed but not set in this component.
//       });

//       if (!res.ok) throw new Error((await res.text()) || res.statusText);

//       const data = await res.json();
//       const newAiMessage = { role: "ai", content: data.question };
//       const finalMessages = [...updatedMessages, newAiMessage];
//       setMessages(finalMessages);

//       // Count AI messages from the most up-to-date list
//       const aiQuestionCount = finalMessages.filter(
//         (m) => m.role === "ai"
//       ).length;

//       // End interview if 10 AI questions have been asked and interview is still marked active
//       if (aiQuestionCount >= 10 && isInterviewActive) {
//         await endInterview();
//       }
//     } catch (err) {
//       console.error("Error getting next question:", err);
//       setMessages([
//         ...updatedMessages,
//         { role: "ai", content: "Error getting next question. Try again!" },
//       ]);
//     } finally {
//       // Only set loading to false if the interview is not in the process of ending due to question limit
//       // (endInterview will handle its own loading state)
//       const currentAiQuestionCount = messages.filter(
//         (m) => m.role === "ai"
//       ).length;
//       if (!(currentAiQuestionCount >= 10 && isInterviewActive)) {
//         setLoading(false);
//       }
//     }
//   };

//   const endInterview = async () => {
//     // No longer set loading true here if called from sendMessage which already handles it.
//     // If called by button, Chat component should manage its loading state.
//     // For simplicity, we'll keep setLoading(true) but be mindful if Chat has its own end button loading.
//     setLoading(true);
//     setIsInterviewActive(false); // Mark interview as not active

//     try {
//       const res = await fetch("/api/interview/feedback", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resume, transcript: messages }), // `resume` is passed. `messages` contains the full transcript.
//       });

//       if (!res.ok) throw new Error((await res.text()) || res.statusText);

//       const data = await res.json();
//       setFeedback(
//         data.feedback || "Thank you! Interview feedback unavailable."
//       );
//     } catch (err) {
//       console.error("Error getting feedback:", err);
//       setFeedback("Error getting feedback. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("Current questions state (for debugging):", questions);

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4 text-center">Resume Analyzer</h1>

//         {/* Section for file upload and starting interview - hidden when interview is active */}
//         {!isInterviewActive && !feedback && (
//           <>
//             <input
//               type="file"
//               accept=".pdf,.doc,.docx"
//               onChange={handleFileUpload}
//               className="mb-4 w-full"
//               disabled={loading}
//             />
//             {name && (
//               <p className="mb-2">
//                 <strong>Name:</strong> {name}
//               </p>
//             )}
//             {skills.length > 0 && (
//               <p className="mb-4">
//                 <strong>Skills:</strong> {skills.join(", ")}
//               </p>
//             )}
//             <button
//               onClick={startInterview}
//               disabled={!isReady || loading}
//               className={`w-full py-3 rounded font-semibold text-white ${
//                 !isReady || loading
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-blue-600 hover:bg-blue-700"
//               }`}
//             >
//               {loading && !messages.length
//                 ? "Processing..."
//                 : "Start Interview"}
//             </button>
//           </>
//         )}

//         {/* Chat interface - shown when interview is active or feedback is available */}
//         <div className="mt-6">
//           {(isInterviewActive || feedback) && (
//             <Chat
//               messages={messages}
//               onSend={sendMessage}
//               onEnd={endInterview} // Chat component can use this for a manual end button
//               feedback={feedback ?? undefined}
//               isInterviewActive={isInterviewActive} // Chat uses this to enable/disable input
//             />
//           )}

//           {/* Global loading indicator for ongoing operations */}
//           {loading && (
//             <div className="text-center text-gray-400 mt-3">Loading...</div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
// "use client";
// import Chat from "@/components/Chat";
// import React, { useState } from "react";

// type Message = {
//   role: "ai" | "user";
//   content: string;
// };

// export default function Home() {
//   const [resumeText, setResumeText] = useState("");
//   const [name, setName] = useState("");
//   const [skills, setSkills] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [resume, setResume] = useState<any>();
//   const [jobDesc, setJobDesc] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isInterviewActive, setIsInterviewActive] = useState(false);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<string[]>([]);

//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     setIsReady(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed");
//       }

//       const data = await response.json();
//       setResumeText(data.text || "");
//       setName(data.name || "");
//       setSkills(data.skills || []);
//       setIsReady(true);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Failed to process resume.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startInterview = async () => {
//     setIsInterviewActive(true);
//     setFeedback(null);
//     setMessages([]);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/interview/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name,
//           skills: skills,
//           history: [],
//         }),
//       });

//       if (!res.ok) throw new Error(res.statusText);

//       const data = await res.json();
//       setQuestions(data.question || []);
//       setMessages([
//         {
//           role: "ai",
//           content:
//             data.question || "Let's begin with: Walk me through your resume.",
//         },
//       ]);
//     } catch (err) {
//       console.error("Interview start failed:", err);
//       setMessages([
//         {
//           role: "ai",
//           content:
//             "Let's start with: Describe your most relevant technical experience.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendMessage = async (text: string) => {
//     const updatedMessages = [...messages, { role: "user", content: text }];
//     setMessages(updatedMessages);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/interview/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resume, history: updatedMessages }),
//       });

//       const data = await res.json();
//       setMessages([...updatedMessages, { role: "ai", content: data.question }]);
//       const aiQuestionCount = messages.filter((m) => m.role === "ai").length;

//       if (aiQuestionCount >= 10) {
//         await endInterview();
//       }
//     } catch (err) {
//       setMessages([
//         ...updatedMessages,
//         { role: "ai", content: "Error getting next question. Try again!" },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const endInterview = async () => {
//     setIsInterviewActive(false);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/interview/feedback", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ resume, transcript: messages }),
//       });

//       const data = await res.json();
//       setFeedback(
//         data.feedback || "Thank you! Interview feedback unavailable."
//       );
//     } catch (err) {
//       setFeedback("Error getting feedback. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("questions", questions);

//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4 text-center">Resume Analyzer</h1>
//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFileUpload}
//           className="mb-4 w-full"
//         />
//         {name && (
//           <p className="mb-2">
//             <strong>Name:</strong> {name}
//           </p>
//         )}
//         {skills.length > 0 && (
//           <p className="mb-4">
//             <strong>Skills:</strong> {skills.join(", ")}
//           </p>
//         )}
//         <button
//           onClick={startInterview}
//           disabled={!isReady || loading}
//           className={`w-full py-3 rounded font-semibold text-white ${
//             !isReady || loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Processing..." : "Start Interview"}
//         </button>
//         <div className="mt-6">
//           {(isInterviewActive || feedback) && (
//             <Chat
//               messages={messages}
//               onSend={sendMessage}
//               onEnd={endInterview}
//               feedback={feedback ?? undefined}
//               isInterviewActive={isInterviewActive}
//             />
//           )}
//           {loading && (
//             <div className="text-center text-gray-400 mt-3">Loading...</div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
// "use client";
// import Chat from "@/components/Chat";
// import React, { useState } from "react";
// type Message = {
//   role: "ai" | "user";
//   content: string;
// };
// export default function Home() {
//   const [resumeText, setResumeText] = useState("");
//   const [name, setName] = useState("");
//   const [skills, setSkills] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isReady, setIsReady] = useState(false);
//   const [resume, setResume] = useState<any>();
//   const [jobDesc, setJobDesc] = useState<string>("");
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [isInterviewActive, setIsInterviewActive] = useState(false);
//   const [feedback, setFeedback] = useState<string | null>(null);
//   const [questions, setQuestions] = useState<string[]>([]);
//   const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     setLoading(true);
//     setIsReady(false);

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("File upload failed");
//       }

//       const data = await response.json();

//       setResumeText(data.text || "");
//       setName(data.name || "");
//       setSkills(data.skills || []);
//       setIsReady(true);
//     } catch (error) {
//       console.error("Error uploading file:", error);
//       alert("Failed to process resume.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startInterview = async () => {
//     setIsInterviewActive(true);
//     setFeedback(null);
//     setMessages([]);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/interview/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: name,
//           skills: skills,
//           history: [],
//         }),
//       });

//       if (!res.ok) throw new Error(res.statusText);

//       const data = await res.json();
//       setQuestions(data.question || []);
//       setMessages([
//         {
//           role: "ai",
//           content:
//             data.question || "Let's begin with: Walk me through your resume.",
//         },
//       ]);
//     } catch (err) {
//       console.error("Interview start failed:", err);
//       setMessages([
//         {
//           role: "ai",
//           content:
//             "Let's start with: Describe your most relevant technical experience.",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };
//   const sendMessage = async (text: string) => {
//     const updatedMessages = [...messages, { role: "user", content: text }];
//     setMessages(updatedMessages);
//     setLoading(true);
//     try {
//       const res = await fetch("/api/interview/question", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resume,
//           history: updatedMessages,
//         }),
//       });
//       const data = await res.json();
//       setMessages([...updatedMessages, { role: "ai", content: data.question }]);
//     } catch (err) {
//       setMessages([
//         ...updatedMessages,
//         { role: "ai", content: "Error getting next question. Try again!" },
//       ]);
//     }
//     setLoading(false);
//   };
//   const endInterview = async () => {
//     setIsInterviewActive(false);
//     setLoading(true);
//     try {
//       const res = await fetch("/api/interview/feedback", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           resume,
//           transcript: messages,
//         }),
//       });
//       const data = await res.json();
//       setFeedback(
//         data.feedback || "Thank you! Interview feedback unavailable."
//       );
//     } catch (err) {
//       setFeedback("Error getting feedback. Please try again.");
//     }
//     setLoading(false);
//   };

//   console.log("questions", questions);
//   return (
//     <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-4 text-center">Resume Analyzer</h1>

//         <input
//           type="file"
//           accept=".pdf,.doc,.docx"
//           onChange={handleFileUpload}
//           className="mb-4 w-full"
//         />

//         {name && (
//           <p className="mb-2">
//             <strong>Name:</strong> {name}
//           </p>
//         )}
//         {skills.length > 0 && (
//           <p className="mb-4">
//             <strong>Skills:</strong> {skills.join(", ")}
//           </p>
//         )}

//         <button
//           onClick={startInterview}
//           disabled={!isReady || loading}
//           className={`w-full py-3 rounded font-semibold text-white ${
//             !isReady || loading
//               ? "bg-gray-400 cursor-not-allowed"
//               : "bg-blue-600 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Processing..." : "Start Interview"}
//         </button>
//         <div className="mt-6">
//           {(isInterviewActive || feedback) && (
//             <Chat
//               messages={messages}
//               onSend={sendMessage}
//               onEnd={endInterview}
//               feedback={feedback ?? undefined}
//               isInterviewActive={isInterviewActive}
//             />
//           )}
//           {loading && (
//             <div className="text-center text-gray-400 mt-3">Loading...</div>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
