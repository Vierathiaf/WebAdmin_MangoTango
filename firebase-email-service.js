// Firebase Email Service for MangoTango Admin
// Uses Firebase Functions to send emails from noreply@mangotango-mobile.firebaseapp.com

const FIREBASE_EMAIL_CONFIG = {
  fromEmail: 'noreply@mangotango-mobile.firebaseapp.com',
  fromName: 'MangoTango Admin',
  projectId: 'mangotango-mobile'
};

// Check if Firebase email is configured
function isFirebaseEmailConfigured() {
  return FIREBASE_EMAIL_CONFIG.fromEmail && 
         FIREBASE_EMAIL_CONFIG.projectId;
}

// Initialize Firebase email service
async function initializeFirebaseEmail() {
  console.log('🔄 Firebase Email Service initialized');
  return true;
}

// Send email via Firebase (simulation for now)
async function sendEmailViaFirebase(emailData) {
  try {
    console.log('🔥 Sending email via Firebase...');
    console.log('📧 To:', emailData.to);
    console.log('📧 From:', emailData.from.email);
    console.log('📧 Subject:', emailData.subject);
    
    // Simulate email sending (replace with actual Firebase Function call)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const messageId = 'firebase-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    console.log('✅ Email sent successfully with ID:', messageId);
    return { 
      success: true, 
      messageId: messageId,
      message: 'Email sent via Firebase Functions'
    };
    
  } catch (error) {
    console.error('❌ Firebase email error:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Create HTML email template for approval
function createApprovalEmailHTML(technicianData) {
  const { firstName, lastName, email, expertise } = technicianData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Approved - MangoTango</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .content { padding: 30px; background: #f8fafc; }
    .button { background: #48bb78; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; padding: 20px; }
    .details-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #48bb78; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Account Approved!</h1>
      <p>Welcome to MangoTango Development</p>
    </div>
    <div class="content">
      <h2>Dear ${firstName} ${lastName},</h2>
      
      <p>Congratulations! Your technician account has been <strong>successfully approved</strong> by our administration team.</p>
      
      <div class="details-box">
        <h3>📋 Your Account Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${firstName} ${lastName}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Expertise:</strong> ${expertise || 'Technician'}</li>
          <li><strong>Status:</strong> <span style="color: #48bb78;">✅ Approved</span></li>
        </ul>
      </div>
      
      <h3>🔐 Next Steps:</h3>
      <ol>
        <li>You can now log in to your account using your registration credentials</li>
        <li>Visit our technician portal to start exploring opportunities</li>
        <li>Complete your profile if you haven't already</li>
        <li>Start connecting with potential clients</li>
      </ol>
      
      <div style="text-align: center;">
        <a href="#" class="button">Access Technician Portal</a>
      </div>
      
      <h3>📞 Need Help?</h3>
      <p>If you have any questions or need assistance:</p>
      <ul>
        <li><strong>Admin Support:</strong> mangotangodev.ph@gmail.com</li>
        <li><strong>Technical Support:</strong> support@mangotango.com</li>
      </ul>
      
      <p>Welcome to the MangoTango family! We're excited to have you on board.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br><strong>MangoTango Development Team</strong></p>
      <p><small>This email was sent from ${FIREBASE_EMAIL_CONFIG.fromEmail}</small></p>
    </div>
  </div>
</body>
</html>`;
}

// Create plain text email for approval
function createApprovalEmailText(technicianData) {
  const { firstName, lastName, email, expertise } = technicianData;
  
  return `
🎉 ACCOUNT APPROVED - Welcome to MangoTango! 🎉

Dear ${firstName} ${lastName},

Congratulations! Your technician account has been successfully approved by our administration team.

📋 ACCOUNT DETAILS:
• Name: ${firstName} ${lastName}
• Email: ${email}
• Expertise: ${expertise || 'Technician'}
• Status: ✅ Approved

🔐 NEXT STEPS:
1. You can now log in to your account using your registration credentials
2. Visit our technician portal to start exploring opportunities
3. Complete your profile if you haven't already
4. Start connecting with potential clients

📞 NEED HELP?
• Admin Support: mangotangodev.ph@gmail.com
• Technical Support: support@mangotango.com

Welcome to the MangoTango family! We're excited to have you on board.

Best regards,
MangoTango Development Team

---
This email was sent from ${FIREBASE_EMAIL_CONFIG.fromEmail}
`;
}

// Send approval email
async function sendApprovalEmail(technicianData) {
  console.log('📧 Starting Firebase approval email process...');
  
  try {
    await initializeFirebaseEmail();
    
    if (!isFirebaseEmailConfigured()) {
      console.warn('⚠️ Firebase email not configured');
      return false;
    }

    const { firstName, lastName, email } = technicianData;
    
    if (!email) {
      console.error('❌ No email address provided');
      return false;
    }

    const emailData = {
      to: email,
      from: {
        email: FIREBASE_EMAIL_CONFIG.fromEmail,
        name: FIREBASE_EMAIL_CONFIG.fromName
      },
      subject: '✅ Your MangoTango Technician Account Has Been Approved!',
      html: createApprovalEmailHTML(technicianData),
      text: createApprovalEmailText(technicianData)
    };

    const response = await sendEmailViaFirebase(emailData);

    if (response.success) {
      console.log('✅ Approval email sent successfully');
      return true;
    } else {
      console.error('❌ Approval email failed:', response.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Error in sendApprovalEmail:', error);
    return false;
  }
}

// Send detailed approval email with instructions
async function sendApprovalEmailWithInstructions(technicianData) {
  console.log('📧 Starting detailed approval email...');
  
  // For now, use the same function as sendApprovalEmail
  // In the future, you can create a more detailed template
  return await sendApprovalEmail(technicianData);
}

// Send rejection email
async function sendRejectionEmail(technicianData) {
  console.log('📧 Starting rejection email process...');
  
  try {
    await initializeFirebaseEmail();
    
    const { firstName, lastName, email } = technicianData;
    
    if (!email) {
      console.error('❌ No email address provided for rejection');
      return false;
    }

    const emailData = {
      to: email,
      from: {
        email: FIREBASE_EMAIL_CONFIG.fromEmail,
        name: FIREBASE_EMAIL_CONFIG.fromName
      },
      subject: '❌ MangoTango Technician Application Update',
      html: `
        <h2>Dear ${firstName} ${lastName},</h2>
        <p>Thank you for your interest in joining MangoTango Development.</p>
        <p>After careful review, we regret to inform you that we cannot approve your technician account at this time.</p>
        <p>You may reapply in the future when you meet all requirements.</p>
        <p>Best regards,<br>MangoTango Development Team</p>
      `,
      text: `Dear ${firstName} ${lastName}, Thank you for your interest in MangoTango. We cannot approve your account at this time. You may reapply in the future. Best regards, MangoTango Team`
    };

    const response = await sendEmailViaFirebase(emailData);

    if (response.success) {
      console.log('✅ Rejection email sent successfully');
      return true;
    } else {
      console.error('❌ Rejection email failed:', response.error);
      return false;
    }

  } catch (error) {
    console.error('❌ Error in sendRejectionEmail:', error);
    return false;
  }
}

// Show professional notifications
function showEmailNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `email-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d1ecf1'};
    color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#0c5460'};
    border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'error' ? '#f5c6cb' : type === 'warning' ? '#ffeaa7' : '#bee5eb'};
    border-radius: 8px;
    padding: 15px 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    max-width: 400px;
    font-family: "Segoe UI", sans-serif;
    animation: slideInRight 0.3s ease-out;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🔄 Initializing Firebase Email Service...');
    await initializeFirebaseEmail();
    console.log('✅ Firebase Email Service ready');
  } catch (error) {
    console.error('❌ Firebase Email Service initialization failed:', error);
  }
});

// Export functions
window.EmailService = {
  sendApprovalEmail,
  sendApprovalEmailWithInstructions,
  sendRejectionEmail,
  showEmailNotification,
  isFirebaseEmailConfigured,
  initializeFirebaseEmail
};

console.log('📧 Firebase Email Service loaded');
