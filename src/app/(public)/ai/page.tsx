import { Chat } from "@/features/ai/Chat";

export const metadata = {
  title: "AI Assistant | SkateHub",
  description: "Ask the AI Assistant anything about skateboarding"
};

export default function AIPage() {
  return <Chat />;
}
