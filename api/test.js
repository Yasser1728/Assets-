// /api/test.js
// اختبر الـ API بفتح: https://assets-web3.vercel.app/api/test

module.exports = async function handler(req, res) {
  const PI_API_KEY = process.env.PI_API_KEY;

  res.status(200).json({
    status: "✅ API is working",
    hasApiKey: !!PI_API_KEY,
    apiKeyLength: PI_API_KEY ? PI_API_KEY.length : 0,
    apiKeyPrefix: PI_API_KEY ? PI_API_KEY.substring(0, 6) + "..." : "MISSING",
    timestamp: new Date().toISOString()
  });
}
