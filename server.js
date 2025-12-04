const express = require('express');
const path = require('path');
const nodemailer = require("nodemailer");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS middleware
app.use((req, res, next) => {
    const allowedOrigins = [
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3001',
        'https://web-admin-mango-tango.vercel.app'
    ];
    const origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    
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

// Routes
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

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending approval email:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});


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

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error sending approval email:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
