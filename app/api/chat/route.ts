export async function POST(req: Request) {
  const { chatId, message } = await req.json();

  const res = await fetch("http://100.116.93.26:3001/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message })
  });

  return new Response(await res.text(), {
    headers: { "Content-Type": "application/json" }
  });
}
