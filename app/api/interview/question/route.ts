import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openaiClient";

interface InterviewCategory {
  category: string;
  questions: string[];
}

export async function POST(req: NextRequest) {
  const { name, skills, history, jobDesc } = await req.json();
  const messages = [
    {
      role: "user",
      content: `You are Nora, an expert interviewer.
        Candidate name:
        """${name}"""
        Candidate skills:
        """${skills}"""
        Job description:
        """${jobDesc}"""
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

  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-r1:free",
    messages: messages,
  });
  const content = completion.choices[0].message.content;

  return NextResponse.json({
    question: content || "Tell me about yourself.",
  });
}
