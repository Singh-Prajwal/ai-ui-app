import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openaiClient";

interface InterviewCategory {
  category: string;
  questions: string[];
}

export async function POST(req: NextRequest) {
  const { name, skills, history } = await req.json();
  const messages = [
    {
      role: "user",
      content: `You are Nora, an expert interviewer.
        Candidate name:
        """${name}"""
        Candidate skills:
        """${skills}"""
        Context: 
        - Focus on the technologies and skills listed to generate technical questions.
        - Ask one clear and specific technical question at a time based on the candidate's expertise.
        - Avoid generic questions. Make it as relevant and personalized as possible.
        - You are simulating a real-time conversation. Wait for the user's answer before asking the next question.
        - Your output should be ONLY the next interview question, with no extra explanation or commentary.
        Begin the interview by asking the most relevant technical question based on the resume.`,
    },
    ...(history ?? []).map((h: { role: string; content: string }) => ({
      role: h.role,
      content: h.content,
    })),
  ];

  // try {
  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: messages,
  });
  const content = completion.choices[0].message.content;
  console.log("OpenAI response:", completion.choices[0].message.content);
  // const lines = content!.split("\n");
  // const questions: string[] = [];

  // for (const line of lines) {
  //   const trimmed = line.trim();
  //   if (trimmed.match(/^\d+\.\s*".+"$/) || trimmed.startsWith("-")) {
  //     questions.push(
  //       trimmed.replace(/^\d+\.\s*|^- /, "").replace(/^"|"$/g, "")
  //     );
  //   }
  // }

  return NextResponse.json({
    question: content || "Tell me about yourself.",
  });
  // } catch (error: any) {
  //   console.error("OpenAI error:", error);
  //   return NextResponse.json(
  //     { error: "Failed to fetch question" },
  //     { status: 500 }
  //   );
  // }
}
// import { NextRequest, NextResponse } from "next/server";
// import openai from "@/lib/openaiClient";

// interface InterviewCategory {
//   category: string;
//   questions: string[];
// }

// export async function POST(req: NextRequest) {
//   const { resumeText, jobDesc, history, interviewId } = await req.json();
//   const messages = [
//     {
//       role: "user",
//       content: `You are Nora, an expert interviewer.
//                 Candidate resume:
//                 """${resumeText}"""
//                 Context:
//                 The resume is passed to you as a text conversion of file blob so convert that into meaningful reference first and then generate queations.
//                 Topic description:
//                 Ask a questions based on the technologies in the resume .
//                 Ask one concise, technical question at a time.
//                 Return ONLY the next question.`,
//     },
//     // Optionally, add previous chat history as messages:
//     ...(history ?? []).map((h: { role: string; content: string }) => ({
//       role: h.role,
//       content: h.content,
//     })),
//   ];
//   console.log("messages", messages);
//   try {
//     const completion = await openai.chat.completions.create({
//       model: "deepseek/deepseek-r1:free",
//       messages: messages,
//       // max_tokens: 2000,
//     });
//     console.log(completion);
//     const input = completion.choices[0].message.content;
//     const lines = input!.split("\n");
//     const result: InterviewCategory[] = [];
//     let currentCategory: string | null = null;
//     let currentQuestions: string[] = [];
//     for (const line of lines) {
//       const trimmed = line.trim();

//       if (trimmed.startsWith("###")) {
//         if (currentCategory) {
//           result.push({
//             category: currentCategory,
//             questions: currentQuestions,
//           });
//           currentQuestions = [];
//         }
//         currentCategory = trimmed.replace(/^###\s?\*\*(.+?)\*\*$/, "$1");
//       } else if (trimmed.match(/^\d+\.\s*".+"$/) || trimmed.startsWith("-")) {
//         const question = trimmed
//           .replace(/^\d+\.\s*|^- /, "")
//           .replace(/^"|"$/g, "");
//         currentQuestions.push(question);
//       }
//     }
//     console.log("currentQuestions", currentQuestions);
//     const question = currentQuestions ?? "Tell me about yourself.";

//     // Optionally: Save Q&A to Supabase here!

//     return NextResponse.json({ question });
//   } catch (error: any) {
//     // Handle quota or other errors gracefully
//     console.error("OpenAI API ERROR:", error);
//     return NextResponse.json(
//       {
//         question:
//           "Sorry, AI service quota is reached! Here's a sample question: Tell me about yourself.",
//       },
//       { status: 200 }
//     );
//   }
// }
