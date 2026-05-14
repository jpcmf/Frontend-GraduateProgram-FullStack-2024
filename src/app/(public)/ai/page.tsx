import { Chat } from "@/features/ai";

export const metadata = {
  title: "AI Assistant | SkateHub",
  description: "Pergunte qualquer coisa sobre skate ao assistente de IA."
};

export default function AIPage() {
  return <Chat />;
}
