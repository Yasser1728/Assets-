// ============================================================
//  ASSETS.PI — /api/payments/approve.js
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

  const { paymentId } = req.body;

  if (!paymentId) {
    return res.status(400).json({ error: "paymentId is required" });
  }

  const PI_API_KEY = process.env.PI_API_KEY;

  if (!PI_API_KEY) {
    console.error("❌ PI_API_KEY missing");
    return res.status(500).json({ error: "PI_API_KEY not configured" });
  }

  try {
    console.log(`⏳ Approving payment: ${paymentId}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const piResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}/approve`,
      {
        method: "POST",
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        },
        signal: controller.signal
      }
    );

    clearTimeout(timeout);

    const data = await piResponse.json();

    if (!piResponse.ok) {
      console.error("❌ Pi API approve error:", JSON.stringify(data));
      return res.status(piResponse.status).json({ error: "Pi API error", details: data });
    }

    console.log(`✅ Approved: ${paymentId}`);
    return res.status(200).json({ success: true, paymentId, data });

  } catch (err) {
    console.error("❌ Approve error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
