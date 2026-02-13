// ============================================================
//  ASSETS.PI — /api/payments/complete.js
//  Vercel Serverless Function
//  يستقبل paymentId + txid ويرسل Complete لـ Pi Network API
// ============================================================

export default async function handler(req, res) {

  // ── CORS Headers ──────────────────────────────────────────
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ── Validate Input ────────────────────────────────────────
  const { paymentId, txid } = req.body;

  if (!paymentId || !txid) {
    return res.status(400).json({ error: "paymentId and txid are required" });
  }

  // ── Pi API Key ────────────────────────────────────────────
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!PI_API_KEY) {
    console.error("PI_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // ── Call Pi Network API ───────────────────────────────────
  try {
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/complete`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ txid })
      }
    );

    const data = await piResponse.json();

    if (!piResponse.ok) {
      console.error("Pi API complete error:", data);
      return res.status(piResponse.status).json({
        error: "Pi API error",
        details: data
      });
    }

    console.log(`✅ Payment completed: ${paymentId} | txid: ${txid}`);
    return res.status(200).json({
      success: true,
      paymentId,
      txid,
      data
    });

  } catch (err) {
    console.error("Complete handler error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
}
