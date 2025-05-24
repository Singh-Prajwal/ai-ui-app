import { NextRequest, NextResponse } from "next/server";
import openai from "@/lib/openaiClient";

export async function POST(req: NextRequest) {
  const { resume, transcript } = await req.json();

  const conversation = transcript
    .map((h: { role: string; content: string }) => `${h.role}: ${h.content}`)
    .join("\n");

  const messages = [
    {
      role: "user",
      content: `You are Nora, a senior technical interviewer.

The following is the full conversation between you and the candidate so far:

""" ${conversation} """

Your task:
- Carefully review all the answers given by the **candidate** (role: "user").
- Based on these answers, provide a detailed, constructive **feedback summary**.
- Focus on the **technical depth**, clarity, and correctness of the answers.
- Mention both strengths and areas of improvement.
- Do NOT repeat the candidate’s answers.
- Do NOT output anything else — just return a single string starting with: "Feedback Summary: ..."
- Do NOT ask follow-up questions or add continuation instructions.

Only output a single feedback summary string. No formatting, no extra spacing, no markdown..

Output format:
"Feedback Summary: [your observations here]]"`,
    },
    ...(transcript ?? []),
  ];

  try {
    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-r1:free",
      messages,
    });

    const content = completion.choices[0].message.content;

    return NextResponse.json({
      feedbackSummary:
        content ?? "Feedback Summary: Unable to generate feedback.",
    });
  } catch (error) {
    console.error("OpenAI Feedback Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate feedback summary." },
      { status: 500 }
    );
  }
}
