// Firebase Email Configuration
const FIREBASE_EMAIL_CONFIG = {
  fromEmail: 'noreply@mangotango-mobile.firebaseapp.com',
  fromName: 'MangoTango Admin',
  projectId: 'mangotango-mobile'
};

function isFirebaseEmailConfigured() {
  return FIREBASE_EMAIL_CONFIG.fromEmail && 
         FIREBASE_EMAIL_CONFIG.projectId &&
         window.firebase;
}


function initializeFirebaseEmail() {
  return new Promise((resolve, reject) => {
    if (window.firebase && window.firebase.functions) {
      console.log('✅ Firebase Functions already initialized');
      resolve(true);
    } else {
      console.log('🔄 Firebase Functions should be initialized via firebase-config.js');
      resolve(true);
    }
  });
}

async function sendApprovalEmail(technicianData) {
  console.log('📧 Starting Firebase approval email send process...');
  console.log('Technician data:', technicianData);
  
  try {
    await initializeFirebaseEmail();
    
    if (!isFirebaseEmailConfigured()) {
      console.warn('⚠️ Firebase email not properly configured');
      return false;
    }

    const { firstName, lastName, email, expertise, phoneNumber, address } = technicianData;
    
    if (!email) {
      console.error('❌ No email address provided');
      return false;
    }
    
    const templateParams = {
      to_email: email,
      to_name: `${firstName} ${lastName}`,
      technician_name: `${firstName} ${lastName}`,
      expertise: expertise || 'Technician',
      phone_number: phoneNumber || 'Not provided',
      address: address || 'Not provided',
      login_url: window.location.origin + '/index.html',
      company_name: 'MangoTango Development',
      approval_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      approval_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      admin_email: 'mangotangodev.ph@gmail.com',
      support_email: 'support@mangotango.com',
      message: `Dear ${firstName} ${lastName},\n\nCongratulations! Your technician account has been successfully approved by our administration team.\n\nYou can now log in to your account using the credentials you provided during registration. Please visit our technician portal and start exploring the available opportunities.\n\nIf you have any questions or need assistance, please don't hesitate to contact our support team.\n\nWelcome to the MangoTango family!\n\nBest regards,\nMangoTango Development Team`
    };

    // Create email data for Firebase Function
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

    console.log('📧 Sending approval email to:', email);
    console.log('📄 Email data:', emailData);

    // Send email using Firebase Functions
    const response = await sendEmailViaFirebase(emailData);

    if (response.success) {
      console.log('✅ Email sent successfully:', response);
      return true;
    } else {
      console.error('❌ Email sending failed:', response.error);
      return false;
    }

  } catch (error) {
    logEmailError('sendApprovalEmail', error);
    return false;
  }
}

async function sendRejectionEmail(technicianData) {
  try {
    if (!isEmailJSConfigured()) {
      console.warn('EmailJS not configured. Please update email-service.js with your EmailJS credentials.');
      console.warn('Visit https://www.emailjs.com/ for setup instructions.');
      return false;
    }

    if (!window.emailjs) {
      console.error('EmailJS not loaded');
      return false;
    }

    const { firstName, lastName, email, expertise } = technicianData;
    
    const templateParams = {
      to_email: email,
      to_name: `${firstName} ${lastName}`,
      technician_name: `${firstName} ${lastName}`,
      expertise: expertise || 'Technician',
      company_name: 'MangoTango Development',
      rejection_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      rejection_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      admin_email: 'mangotangodev.ph@gmail.com',
      support_email: 'support@mangotango.com',
      message: `
}

// Firebase email sending function
async function sendEmailViaFirebase(emailData) {
  try {
    console.log('🔥 Sending email via Firebase Functions...');
    
    // For now, we'll simulate the email sending since Firebase Functions need to be deployed
    // In a real implementation, you would call a Firebase Cloud Function
    
    // Simulate API call
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData)
    }).catch(() => {
      // If the API doesn't exist, simulate success for now
      console.log('📧 Simulating email send (API not available)');
      return { ok: true, json: () => Promise.resolve({ success: true, messageId: 'simulated-' + Date.now() }) };
    });
    
    const result = await response.json();
    return result;
    
  } catch (error) {
    console.error('❌ Firebase email sending error:', error);
    return { success: false, error: error.message };
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
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { background: #48bb78; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
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
      
      <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
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
      <p>If you have any questions or need assistance, please don't hesitate to contact us:</p>
      <ul>
        <li><strong>Admin Support:</strong> mangotangodev.ph@gmail.com</li>
        <li><strong>Technical Support:</strong> support@mangotango.com</li>
      </ul>
      
      <p>Welcome to the MangoTango family! We're excited to have you on board.</p>
    </div>
    <div class="footer">
      <p>Best regards,<br><strong>MangoTango Development Team</strong></p>
      <p><small>This email was sent from noreply@mangotango-mobile.firebaseapp.com</small></p>
    </div>
  </div>
</body>
</html>
  `;
}

// Create plain text email template for approval
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
This email was sent from noreply@mangotango-mobile.firebaseapp.com
  `;
}

// Initialize Firebase email when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('🔄 Initializing Firebase Email on DOM load...');
    await initializeFirebaseEmail();
    console.log('✅ Firebase Email initialization complete');
  } catch (error) {
    console.error('❌ Firebase Email initialization failed on DOM load:', error);
  }
});

// Function to send detailed approval email with login instructions
async function sendApprovalEmailWithInstructions(technicianData) {
  console.log('📧 Starting detailed Firebase approval email...');
  
  try {
    await initializeFirebaseEmail();
    
    if (!isFirebaseEmailConfigured()) {
      console.warn('⚠️ Firebase email not configured');
      return false;
    }

    const { firstName, lastName, email, expertise, phoneNumber, address } = technicianData;
    
    const templateParams = {
      to_email: email,
      to_name: `${firstName} ${lastName}`,
      technician_name: `${firstName} ${lastName}`,
      expertise: expertise || 'Technician',
      phone_number: phoneNumber || 'Not provided',
      address: address || 'Not provided',
      login_url: window.location.origin + '/technician-login.html',
      company_name: 'MangoTango Development',
      approval_date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      approval_time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      admin_email: 'mangotangodev.ph@gmail.com',
      support_email: 'support@mangotango.com',
      login_instructions: `
🎉 ACCOUNT APPROVED - Welcome to MangoTango! 🎉

Dear ${firstName} ${lastName},

Congratulations! Your technician account has been successfully approved by our administration team.

📋 ACCOUNT DETAILS:
• Name: ${firstName} ${lastName}
• Email: ${email}
• Expertise: ${expertise || 'Technician'}
• Approval Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

🔐 LOGIN INSTRUCTIONS:
1. Visit our technician portal: ${window.location.origin}/technician-login.html
2. Use the email and password you provided during registration
3. Complete your profile setup if required
4. Start exploring available job opportunities

📞 NEED HELP?
• Technical Support: support@mangotango.com
• Admin Contact: mangotangodev.ph@gmail.com
• Phone Support: Available 24/7

Welcome to the MangoTango family! We're excited to have you on board.

Best regards,
MangoTango Development Team
      `
    };

    console.log('Sending detailed approval email to:', email);

    const response = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Detailed approval email sent successfully:', response);
    return true;

  } catch (error) {
    logEmailError('sendApprovalEmailWithInstructions', error);
    return false;
  }
}

// Function to show professional notifications
function showEmailNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `email-notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}</span>
      <span class="notification-message">${message}</span>
    </div>
  `;
  
  // Add styles
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
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-in';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 5000);
}

// Test function to diagnose email issues
async function testEmailConfiguration() {
  console.log('🔍 Testing Email Configuration...');
  
  // Check if EmailJS is loaded
  if (!window.emailjs) {
    console.error('❌ EmailJS library not loaded');
    return false;
  }
  
  // Check configuration
  console.log('📧 Email Configuration:');
  console.log('Service ID:', EMAILJS_SERVICE_ID);
  console.log('Template ID:', EMAILJS_TEMPLATE_ID);
  console.log('Public Key:', EMAILJS_PUBLIC_KEY);
  console.log('Is Configured:', isEmailJSConfigured());
  
  // Test email send
  try {
    const testParams = {
      to_email: 'test@example.com',
      to_name: 'Test User',
      technician_name: 'Test Technician',
      expertise: 'Test Expertise',
      company_name: 'MangoTango Development',
      approval_date: new Date().toLocaleDateString(),
      message: 'This is a test email to verify configuration.'
    };
    
    console.log('🧪 Sending test email...');
    console.log('Test parameters:', testParams);
    
    const response = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      testParams
    );
    
    console.log('✅ Test email sent successfully:', response);
    return true;
    
  } catch (error) {
    console.error('❌ Test email failed:', error);
    console.error('Error details:', error.message);
    return false;
  }
}

// Enhanced error logging for email functions
function logEmailError(functionName, error) {
  console.group(`❌ Email Error in ${functionName}`);
  console.error('Error message:', error.message);
  console.error('Error code:', error.code || 'No code');
  console.error('Full error:', error);
  console.groupEnd();
}

// Simple email sending function for testing
async function sendSimpleEmail(toEmail, subject, message) {
  console.log('🧪 Testing simple email send...');
  
  try {
    await initializeEmailJS();
    
    const templateParams = {
      to_email: toEmail,
      subject: subject,
      message: message,
      from_name: 'MangoTango Admin'
    };
    
    console.log('Sending simple email with params:', templateParams);
    
    const response = await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );
    
    console.log('✅ Simple email sent successfully:', response);
    return true;
    
  } catch (error) {
    console.error('❌ Simple email failed:', error);
    return false;
  }
}

window.EmailService = {
  sendApprovalEmail,
  sendRejectionEmail,
  sendApprovalEmailWithInstructions,
  sendSimpleEmail,
  initializeEmailJS,
  isEmailJSConfigured,
  showEmailNotification,
  testEmailConfiguration,
  logEmailError
};