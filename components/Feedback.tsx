import React from "react";
import { useTheme } from "next-themes";

interface FeedbackProps {
  feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
          <span className="text-2xl">✨</span>
        </div>
      </div>
      
      <div className="glass-morphism rounded-xl p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-center bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Interview Feedback
        </h3>
        <div className="prose dark:prose-invert max-w-none">
          <p className="leading-relaxed whitespace-pre-line text-gray-700 dark:text-gray-300">
            {feedback}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;