import React from "react";
import { useTheme } from "next-themes";

interface FeedbackProps {
  feedback: string;
}

const Feedback: React.FC<FeedbackProps> = ({ feedback }) => {
  const { theme } = useTheme();

  return (
    <div
      className={`border rounded p-4 my-2 ${
        theme === "dark"
          ? "bg-green-900 text-white border-green-700"
          : "bg-green-100 border-green-300"
      }`}
    >
      <h3 className="font-bold mb-2">AI Feedback</h3>
      <p>{feedback}</p>
    </div>
  );
};

export default Feedback;
// // components/Feedback.tsx

// import React from "react";

// interface FeedbackProps {
//   feedback: string;
// }

// const Feedback: React.FC<FeedbackProps> = ({ feedback }) => (
//   <div className="bg-green-100 border border-green-300 rounded p-4 my-2">
//     <h3 className="font-bold mb-2">AI Feedback</h3>
//     <p>{feedback}</p>
//   </div>
// );

// export default Feedback;
