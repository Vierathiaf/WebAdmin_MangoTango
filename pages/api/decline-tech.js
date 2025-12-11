import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { email, name, reason = "No reason provided" } = req.body;

    if (!email || !name) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    await transporter.sendMail({
      from: "\"MangoTango Admin\" <mangotangodev.ph@gmail.com>",
      to: email,
      subject: "Update on Your MangoTango Technician Application",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; color:#333; line-height: 1.6;">
          <h2 style="color:#D32F2F;">Your Technician Application Status</h2>
          
          <p>Dear ${name},</p>
          
          <p>Thank you for your interest in becoming a MangoTango Technician. After careful review, we regret to inform you that we are unable to approve your application at this time.</p>
          
          <div style="background-color: #FFEBEE; padding: 15px; border-left: 4px solid #D32F2F; margin: 20px 0;">
            <p><strong>Reason for Rejection:</strong></p>
            <p>${reason}</p>
          </div>
          
          <p>We appreciate the time and effort you put into your application. While we can't move forward at this time, we encourage you to review our technician requirements and apply again in the future if you believe you meet the necessary criteria.</p>
          
          <p>If you have any questions about this decision or would like feedback on your application, please don't hesitate to reach out to us.</p>
          
          <hr style="border:0; border-top:1px solid #ddd; margin: 25px 0;">
          
          <p>Best regards,<br><strong>MangoTango Admin Team</strong></p>
          
          <div style="text-align:center; font-size:12px; color:#888; margin-top: 30px;">
            © 2025 MangoTango. All rights reserved.<br>
            This is an automated email — please do not reply.
          </div>
        </div>
      `
    });

    return res.status(200).json({ 
      success: true,
      message: 'Rejection email sent successfully'
    });

  } catch (error) {
    console.error("Error in decline-tech API:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to send rejection email",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
}