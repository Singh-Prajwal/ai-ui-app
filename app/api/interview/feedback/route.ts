import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openaiClient";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  const { resume, jobDesc, transcript, interviewId } = await req.json();

  const systemMessage = {
    role: "system",
    content: `You are an AI interviewer. Given this transcript: """${JSON.stringify(transcript)}""", resume: """${resume}""", and job description: """${jobDesc}""", provide detailed constructive feedback for the candidate.`,
  };

  const messages = [systemMessage];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 300,
  });

  const feedback = response.choices[0]?.message?.content || "Great job!";

  // Optionally: Save feedback to Supabase here.

  return NextResponse.json({ feedback });
}
