import ChatWindow from "./chatWindow";

function Header({ title }: { title?: string }) {
  return <h1>{title ?? "Default title"}</h1>;
}

export default function HomePage() {
  return (
    <div>
      <Header title="Ollama Chat" />
      <ChatWindow />
    </div>
  );
}
