// ============================================================
//  ASSETS.PI — /api/payments/incomplete.js
//  Vercel Serverless Function
//  يعالج الـ Payments الناقصة تلقائياً
// ============================================================

export default async function handler(req, res) {

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
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // اجيب تفاصيل الـ payment الناقص
    const getResponse = await fetch(
      `https://api.minepi.com/v2/payments/${paymentId}`,
      {
        headers: {
          "Authorization": `Key ${PI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const payment = await getResponse.json();
    console.log("Incomplete payment details:", payment);

    // لو الـ payment approved بس مش completed → Complete it
    if (payment.status?.developer_approved && !payment.status?.developer_completed) {
      const txid = payment.transaction?.txid;

      if (txid) {
        const completeResponse = await fetch(
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
        const completeData = await completeResponse.json();
        console.log(`✅ Incomplete payment completed: ${paymentId}`);
        return res.status(200).json({ success: true, action: "completed", data: completeData });
      }
    }

    // لو مش approved بعد → Approve it
    if (!payment.status?.developer_approved) {
      const approveResponse = await fetch(
        `https://api.minepi.com/v2/payments/${paymentId}/approve`,
        {
          method: "POST",
          headers: {
            "Authorization": `Key ${PI_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      const approveData = await approveResponse.json();
      console.log(`✅ Incomplete payment approved: ${paymentId}`);
      return res.status(200).json({ success: true, action: "approved", data: approveData });
    }

    return res.status(200).json({ success: true, action: "no_action_needed", payment });

  } catch (err) {
    console.error("Incomplete handler error:", err);
    return res.status(500).json({ error: "Internal server error", message: err.message });
  }
}
