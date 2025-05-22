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
}
