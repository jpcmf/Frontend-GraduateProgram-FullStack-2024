export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type AIResponse = {
  answer: string;
  level: "beginner" | "intermediate" | "advanced";
  confidence: number;
};
