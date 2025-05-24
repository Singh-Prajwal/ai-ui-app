export type Interview = {
  id: string;
  created_at: string;
  candidate_name: string;
  job_description: string;
  feedback: string | null;
  transcript: {
    role: "ai" | "user";
    content: string;
  }[];
  skills: string[];
};

export type InterviewInsert = Omit<Interview, "id" | "created_at">;
