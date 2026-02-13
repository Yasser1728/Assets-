// ============================================================
//  ASSETS.PI — /api/payments/complete.js
//  Vercel Serverless Function
// ============================================================

module.exports = async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: "paymentId and txid are required" });
  }

  const PI_API_KEY = process.env.PI_API_KEY;

  if (!PI_API_KEY) {
    console.error("❌ PI_API_KEY missing");
    return res.status(500).json({ error: "PI_API_KEY not configured" });
  }

  try {
    console.log(`⏳ Completing payment: ${paymentId} | txid: ${txid}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid }),
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    const data = await piResponse.json();

    if (!piResponse.ok) {
      console.error("❌ Pi API complete error:", JSON.stringify(data));
      return res.status(piResponse.status).json({ error: "Pi API error", details: data });
    }

    console.log(`✅ Completed: ${paymentId}`);
    return res.status(200).json({ success: true, paymentId, txid, data });

  } catch (err) {
    console.error("❌ Complete error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
