import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  // CORS FIX
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, name } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    await transporter.sendMail({
      from: "\"MangoTango Admin\" <mangotangodev.ph@gmail.com>",
      to: email,
      subject: "Your MangoTango Technician Account Has Been Approved",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; color:#333; line-height: 1.6;">
          <h2 style="color:#2E7D32;">🎉 Congratulations, ${name}!</h2>
          <p>We are pleased to inform you that your <strong>MangoTango Technician Account</strong> has been <strong>successfully approved</strong>.</p>
          <p>You are now officially part of our growing network of agricultural support professionals dedicated to helping farmers and enhancing our agricultural community.</p>
          <hr style="border:0; border-top:1px solid #ddd; margin: 25px 0;">
          <h3 style="color:#2E7D32;">🌱 What You Can Do Now</h3>
          <ul>
            <li>Provide <strong>expert consultations</strong> to farmers</li>
            <li>Post and manage seminars or educational agricultural events</li>
            <li>Access your personalized <strong>Technician Dashboard</strong></li>
            <li>Update your profile and specialization details</li>
          </ul>
          <p>You can now log in to the MangoTango Technician Portal using your registered email address:</p>
          <p style="margin-top: 15px;">
            <a href="https://web-tech-mango-tango.vercel.app/"
               style="background:#2E7D32; padding:12px 20px; color:white; text-decoration:none; border-radius:6px; font-weight:bold;">
                🔗 Go to MangoTango Technician Portal
            </a>
          </p>
          <hr style="border:0; border-top:1px solid #ddd; margin: 25px 0;">
          <h3>Need Help?</h3>
          <p>If you have any questions or need assistance, feel free to contact us:</p>
          <p>📩 <strong>mangotangodev.ph@gmail.com</strong></p>
          <p>We're excited to have you onboard and look forward to the positive impact you'll make in supporting farmers and enriching the agricultural community.</p>
          <p style="margin-top: 35px;">Warm regards,<br><strong>MangoTango Admin Team</strong></p>
          <br>
          <div style="text-align:center; font-size:12px; color:#888;">
            © 2025 MangoTango. All rights reserved.<br>
            This is an automated email — please do not reply.
          </div>
        </div>
      `
    });

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Error in approve-tech API:", error);
    return res.status(500).json({ success: false, error: "Failed to send email" });
  }
}