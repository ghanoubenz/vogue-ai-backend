import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amountAed, isTest, plan } = req.body;
  const amountInFils = amountAed * 100;

  try {
    const ziinaResponse = await axios.post(
      "https://api.ziina.com/payment_intent",
      {
        amount: amountInFils,
        test: isTest === true,
        success_url: "https://YOUR-AI-STUDIO-DOMAIN/success",
        cancel_url: "https://YOUR-AI-STUDIO-DOMAIN/cancel",
        metadata: { plan }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.ZIINA_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      redirect_url: ziinaResponse.data.redirect_url,
      id: ziinaResponse.data.id
    });
  } catch (err) {
    console.error("Ziina error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}
