// components/Feedback.tsx
import React from "react";
import { useTheme } from "next-themes";

interface FeedbackProps {
  feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`border rounded-xl p-4 my-4 transition-all duration-300 shadow-md ${
        theme === "dark"
          ? "bg-green-950 text-green-100 border-green-800"
          : "bg-green-100 border-green-300 text-green-900"
      }`}
    >
      <h3 className="text-lg font-semibold mb-2">🧠 AI Interview Feedback</h3>
      <p className="leading-relaxed whitespace-pre-line">{feedback}</p>
    </div>
  );
};

export default Feedback;
