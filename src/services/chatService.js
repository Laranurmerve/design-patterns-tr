/**
 * Chat API istemcisi.
 * API anahtarı frontend'de tutulmaz; istekler Vercel Serverless
 * Function olan /api/chat adresine gider.
 */
export async function sendChatMessage({ message, history, pageContext }) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history, pageContext }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Yapay zeka servisine ulaşılamadı.");
  }

  return data.reply;
}
