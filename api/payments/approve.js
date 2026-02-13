// ============================================================
//  ASSETS.PI — /api/payments/approve.js
//  Vercel Serverless Function
//  يستقبل paymentId ويرسل Approve لـ Pi Network API
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
  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is required" });
  }

  // ── Pi API Key ────────────────────────────────────────────
  // ضع الـ API Key في Vercel Environment Variables
  // اسمه: PI_API_KEY
  const PI_API_KEY = process.env.PI_API_KEY;

  if (!PI_API_KEY) {
    console.error("PI_API_KEY is not set in environment variables");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // ── Call Pi Network API ───────────────────────────────────
  try {
    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const data = await piResponse.json();

    if (!piResponse.ok) {
      console.error("Pi API approve error:", data);
      return res.status(piResponse.status).json({
        error: "Pi API error",
        details: data
      });
    }

    console.log(`✅ Payment approved: ${paymentId}`);
    return res.status(200).json({
      success: true,
      paymentId,
      data
    });

  } catch (err) {
    console.error("Approve handler error:", err);
    return res.status(500).json({
      error: "Internal server error",
      message: err.message
    });
  }
}
