const express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
});

// Middleware to parse JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Email configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "mangotangodev.ph@gmail.com",
        pass: "grcz cfcr fjtr dtfm"
    }
});

// Email routes
app.post('/approve-tech', async (req, res) => {
    try {
        const { email, name } = req.body;

        await transporter.sendMail({
            from: '"MangoTango Admin" <mangotangodev.ph@gmail.com>',
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
                        <li><strong>Post and manage seminars</strong> or educational agricultural events</li>
                        <li>Access your personalized <strong>Technician Dashboard</strong></li>
                        <li>Update your <strong>profile and specialization</strong> details</li>
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

                    <p>We’re excited to have you onboard and look forward to the positive impact you’ll make in supporting farmers and enriching the agricultural community.</p>

                    <p style="margin-top: 35px;">Warm regards,<br><strong>MangoTango Admin Team</strong></p>

                    <br>

                    <div style="text-align:center; font-size:12px; color:#888;">
                        © 2025 MangoTango. All rights reserved.<br>
                        This is an automated email — please do not reply.
                    </div>

                </div>
            `
        });

        res.json({ success: true, message: "Approval email sent successfully" });
    } catch (error) {
        console.error("Error sending approval email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


app.post('/decline-tech', async (req, res) => {
    try {
        const { email, name, reason } = req.body;

        await transporter.sendMail({
            from: '"MangoTango Admin" <mangotangodev.ph@gmail.com>',
            to: email,
            subject: "Update Regarding Your MangoTango Technician Application",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; color:#333; line-height: 1.6;">

                    <h2 style="color:#B00020;">⚠️ Application Update for ${name}</h2>

                    <p>Thank you for your interest in joining the <strong>MangoTango Technician Team</strong>. After reviewing your application, we regret to inform you that it has not been approved at this time.</p>

                    ${reason ? `
                        <p><strong>Reason for Decline:</strong></p>
                        <div style="background:#f8d7da; padding:12px; border-left:4px solid #B00020; border-radius:4px; margin-bottom:15px;">
                            <em>${reason}</em>
                        </div>
                    ` : ''}

                    <p>Please know that this decision does not prevent you from applying again in the future. We encourage you to review your information, update your qualifications if needed, and reapply when you are ready.</p>

                    <hr style="border:0; border-top:1px solid #ddd; margin: 25px 0;">

                    <h3>Need Assistance?</h3>
                    <p>If you believe this decision was made in error or if you have any questions, feel free to reach out to our support team:</p>

                    <p>📩 <strong>mangotangodev.ph@gmail.com</strong></p>

                    <p>We appreciate your interest in contributing to the agricultural community and hope to hear from you again.</p>

                    <p style="margin-top: 35px;">Sincerely,<br><strong>MangoTango Admin Team</strong></p>

                    <br>

                    <div style="text-align:center; font-size:12px; color:#888;">
                        © 2025 MangoTango. All rights reserved.<br>
                        This is an automated email — please do not reply.
                    </div>

                </div>
            `
        });

        res.json({ success: true, message: "Rejection email sent successfully" });

    } catch (error) {
        console.error("Error sending rejection email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});