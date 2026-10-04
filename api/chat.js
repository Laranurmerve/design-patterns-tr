export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Sadece POST istekleri desteklenir." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error:
        "Sunucu yapılandırması eksik: GEMINI_API_KEY tanımlı değil. Lütfen Vercel Environment Variables bölümüne ekleyin.",
    });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body || {};
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const history = Array.isArray(body.history) ? body.history.slice(-10) : [];
    const pageContext = typeof body.pageContext === "string" ? body.pageContext.slice(0, 2000) : "";

    if (!message) {
      return res.status(400).json({ error: "Mesaj boş olamaz." });
    }

    if (message.length > 2000) {
      return res.status(400).json({ error: "Mesaj çok uzun (en fazla 2000 karakter)." });
    }

    const patternCatalog = [
      "Singleton (Creational): Tek örnek, global erişim noktası. Örn: veritabanı bağlantı yöneticisi, Lazy<T> ile thread-safe C# uygulaması.",
      "Factory Method (Creational): Nesne üretimini alt sınıflara bırakır, if-else karmaşasını azaltır. Örn: ILogger -> FileLogger / DbLogger.",
      "Builder (Creational): Karmaşık nesneleri adım adım kurar.",
      "Abstract Factory (Creational): İlişkili nesne aileleri üretir.",
      "Prototype (Creational): Klonlama ile nesne üretir.",
      "Adapter (Structural): Uyumsuz arayüzleri birbirine bağlar.",
      "Decorator (Structural): Nesneye dinamik davranış ekler.",
      "Bridge (Structural): Soyutlama ile gerçeklemeyi ayırır.",
      "Composite (Structural): Ağaç yapıları (parça-bütün) kurar.",
      "Facade (Structural): Alt sisteme basit arayüz sağlar.",
      "Flyweight (Structural): Paylaşımla bellekten tasarruf sağlar.",
      "Proxy (Structural): Erişim kontrolü / tembellik / önbellek sağlar.",
      "Strategy (Behavioral): Algoritmayı çalışma anında değiştirir. Örn: IShippingStrategy.",
      "Chain of Responsibility (Behavioral): İsteği zincir boyunca iletir.",
      "Command (Behavioral): İsteği nesneye dönüştürür (geri al/yinele).",
      "Interpreter (Behavioral): Mini dil kurallarını sınıflarla yorumlar.",
      "Iterator (Behavioral): Koleksiyonda sıralı gezinme sağlar.",
      "Mediator (Behavioral): Nesneler arası iletişimi merkezileştirir.",
      "Memento (Behavioral): Durumu kaydedip geri yükler.",
      "Observer (Behavioral): Abone-bildirim mekanizması kurar.",
      "State (Behavioral): Nesne davranışını iç durumuna göre değiştirir.",
      "Template Method (Behavioral): Algoritma iskeletini sabitler, adımları alt sınıfa bırakır.",
      "Visitor (Behavioral): Sınıfları değiştirmeden yeni işlem ekler.",
    ].join("\n- ");

    const systemPrompt = [
      "Sen Design Patterns TR adlı Türkçe C# eğitim sitesinin yapay zeka asistanısın.",
      "Kurallar:",
      "1) Her zaman Türkçe, sade ve anlaşılır cevap ver.",
      "2) Önceliğin: Design Patterns, C#, OOP ve aşağıdaki sitedeki pattern içerikleridir.",
      "3) Kullanıcı genel sohbet isterse kısaca cevaplayıp konuyu Design Patterns'e bağlamaya çalış.",
      "4) Kod örneği isterse C# ile, kısa ve açıklamalı ver.",
      "5) Emin olmadığın konuda uydurma, dürüstçe sınırını belirt.",
      "6) Cevapların eğitici olsun: tanım + ne zaman kullanılır + kısa C# örneği + ilgili pattern önerisi.",
      "Sitedeki pattern kataloğu:",
      "- " + patternCatalog,
      pageContext ? "Kullanıcının bulunduğu sayfa bağlamı: " + pageContext : "",
    ]
      .filter(Boolean)
      .join("\n");

    const contents = [
      { role: "user", parts: [{ text: systemPrompt }] },
      { role: "model", parts: [{ text: "Anladım. Design Patterns TR asistanı olarak Türkçe, C# odaklı ve eğitici cevaplar vereceğim." }] },
      ...history
        .filter((m) => m && typeof m.text === "string" && (m.role === "user" || m.role === "assistant"))
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.text.slice(0, 2000) }],
        })),
      { role: "user", parts: [{ text: message }] },
    ];

    const geminiRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => "");
      console.error("Gemini API hatası:", geminiRes.status, errText);
      return res.status(502).json({
        error:
          "Yapay zeka servisine şu an ulaşılamıyor. Lütfen biraz sonra tekrar deneyin.",
      });
    }

    const data = await geminiRes.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("")?.trim() ||
      "Üzgünüm, şu an cevap üretemedim. Sorunuzu farklı şekilde sorabilir misiniz?";

    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API hatası:", error);
    return res.status(500).json({ error: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin." });
  }
}
