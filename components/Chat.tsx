import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";

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
}

const Chat: React.FC<ChatProps> = ({
  messages,
  onSend,
  onEnd,
  isInterviewActive,
  feedback,
}) => {
  const { theme } = useTheme();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className={`flex flex-col h-[400px] border rounded shadow-sm p-4 ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white"
      }`}
    >
      <div className="flex-1 overflow-y-auto space-y-2 mb-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              m.role === "ai"
                ? theme === "dark"
                  ? "bg-gray-700"
                  : "bg-gray-100"
                : theme === "dark"
                  ? "bg-blue-700"
                  : "bg-blue-100"
            } self-${m.role === "ai" ? "start" : "end"} text-${
              m.role === "ai" ? "left" : "right"
            }`}
          >
            <span className="font-semibold">
              {m.role === "ai" ? "AI: " : "You: "}
            </span>
            {m.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      {isInterviewActive && (
        <form
          className="flex"
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              onSend(input);
              setInput("");
            }
          }}
        >
          <input
            className={`border p-2 flex-1 rounded-l ${
              theme === "dark" ? "bg-gray-700 text-white" : "text-black"
            }`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your answer..."
            autoFocus
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r"
            type="submit"
          >
            Send
          </button>
          <button
            type="button"
            className="ml-2 bg-red-500 text-white px-3 rounded"
            onClick={onEnd}
          >
            End Interview
          </button>
        </form>
      )}
      {feedback && (
        <div className="bg-green-100 p-2 mt-2 rounded border border-green-300">
          <strong>Feedback:</strong>
          <div>{feedback}</div>
        </div>
      )}
    </div>
  );
};

export default Chat;
// // components/Chat.tsx

// import React, { useState, useRef, useEffect } from "react";

// type Message = {
//   role: "ai" | "user";
//   content: string;
// };

// interface ChatProps {
//   messages: Message[];
//   onSend: (msg: string) => void;
//   onEnd: () => void;
//   feedback?: string;
//   isInterviewActive: boolean;
// }

// const Chat: React.FC<ChatProps> = ({
//   messages,
//   onSend,
//   onEnd,
//   isInterviewActive,
//   feedback,
// }) => {
//   const [input, setInput] = useState("");
//   const bottomRef = useRef<HTMLDivElement>(null);

//   // Keep chat scrolled down
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   return (
//     <div className="flex flex-col h-[400px] border rounded shadow-sm p-4 bg-white">
//       <div className="flex-1 overflow-y-auto space-y-2 mb-3">
//         {messages.map((m, i) => (
//           <div
//             key={i}
//             className={`p-2 rounded ${
//               m.role === "ai"
//                 ? "bg-gray-100 self-start"
//                 : "bg-blue-100 self-end text-right"
//             }`}
//           >
//             <span className="font-semibold">
//               {m.role === "ai" ? "AI: " : "You: "}
//             </span>
//             {m.content}
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>
//       {isInterviewActive ? (
//         <form
//           className="flex"
//           onSubmit={(e) => {
//             e.preventDefault();
//             if (input.trim()) {
//               onSend(input);
//               setInput("");
//             }
//           }}
//         >
//           <input
//             className="border p-2 flex-1 rounded-l text-white"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Type your answer..."
//             autoFocus
//           />
//           <button
//             className="bg-blue-500 text-white px-4 rounded-r"
//             type="submit"
//           >
//             Send
//           </button>
//           <button
//             type="button"
//             className="ml-2 bg-red-500 text-white px-3 rounded"
//             onClick={onEnd}
//           >
//             End Interview
//           </button>
//         </form>
//       ) : feedback ? (
//         <div className="bg-green-100 p-2 mt-2 rounded border border-green-300">
//           <strong>Feedback:</strong>
//           <div>{feedback}</div>
//         </div>
//       ) : null}
//     </div>
//   );
// };

// export default Chat;
