import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openaiClient";

interface InterviewCategory {
  category: string;
  questions: string[];
}

export async function POST(req: NextRequest) {
  const { resume, transcript } = await req.json();
  const conversation = transcript
    .map((h: { role: string; content: string }) => `${h.role}: ${h.content}`)
    .join("\n");
  console.log("conversation", conversation);
  const messages = [
    {
      role: "user",
      content: `You are Nora, a senior technical interviewer.
  The following is the full conversation between you and the candidate so far:
  
  """ ${conversation}"""
  
  Your task:
  - Carefully review all the answers given by the **candidate** (role: "user").
  - Based on these answers, provide a detailed, constructive **feedback summary**.
  - Focus on the **technical depth**, clarity, and correctness of the answers.
  - Mention both strengths and areas of improvement.
  - Do NOT repeat the candidate’s answers.
  - Avoid generic praise like "great job" — be objective, specific, and helpful.
  
  Your output should be just the feedback summary — no follow-up questions or interview continuation.
  
  Output format:
  "Feedback Summary: ..."
  `,
    },
    ...(transcript ?? []).map((h: { role: string; content: string }) => ({
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

  return NextResponse.json({
    question: content || "Tell me about yourself.",
  });
}
