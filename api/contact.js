const { Resend } = require("resend");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, phone, email, project } = req.body || {};

  if (!name || !phone || !email || !project) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400).json({ error: "Invalid email" });
    return;
  }

  if (!process.env.RESEND_API_KEY) {
    res.status(500).json({ error: "Email service not configured" });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "EcoGreenCabins <enquiries@ecogreencabins.com>",
      to: "sal@salaro.com",
      reply_to: email,
      subject: `New enquiry from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nEmail: ${email}\n\nProject:\n${project}`,
    });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(502).json({ error: "Failed to send" });
  }
};
