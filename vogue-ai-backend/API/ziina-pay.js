import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { amountAed, isTest, plan } = req.body;

  // Convert AED → fils
  const amountInFils = Math.round(amountAed * 100);

  try {
    const ziinaResponse = await axios.post(
      "https://api.ziina.com/payment_intent",
      {
        amount: amountInFils,
        test: isTest === true,
        success_url: process.env.NEXT_PUBLIC_SITE_URL + "/success",
        cancel_url: process.env.NEXT_PUBLIC_SITE_URL + "/cancel",
        metadata: { plan }
      },
      {
        headers: {
          Authorization: "Bearer " + process.env.ZIINA_API_KEY,
          "Content-Type": "application/json"
        }
      }
    );

    const { redirect_url, id } = ziinaResponse.data;

    return res.status(200).json({ redirect_url, id });

  } catch (err) {
    console.error("Ziina error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to create payment intent" });
  }
}
