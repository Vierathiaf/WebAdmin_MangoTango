// Bulk Email Processor for MangoTango Admin
// This script fetches all technician registrations and sends appropriate emails

class BulkEmailProcessor {
  constructor(db, emailService) {
    this.db = db;
    this.emailService = emailService;
    this.processedEmails = [];
    this.failedEmails = [];
  }

  // Fetch all technician registrations from database
  async fetchAllTechnicians() {
    try {
      console.log('📥 Fetching all technician registrations...');
      
      const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const technicianRef = collection(this.db, "technician");
      const snapshot = await getDocs(technicianRef);
      
      const technicians = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        technicians.push({
          id: doc.id,
          ...data
        });
      });
      
      console.log(`✅ Found ${technicians.length} technician registrations`);
      return technicians;
      
    } catch (error) {
      console.error('❌ Error fetching technicians:', error);
      throw error;
    }
  }

  // Process all technicians and send appropriate emails
  async processAllTechnicians() {
    try {
      const technicians = await this.fetchAllTechnicians();
      
      if (technicians.length === 0) {
        console.log('ℹ️ No technicians found to process');
        return { processed: 0, failed: 0 };
      }

      console.log(`🔄 Processing ${technicians.length} technician registrations...`);
      
      for (const technician of technicians) {
        await this.processSingleTechnician(technician);
        // Add delay between emails to avoid rate limiting
        await this.delay(1000);
      }

      return {
        processed: this.processedEmails.length,
        failed: this.failedEmails.length,
        processedList: this.processedEmails,
        failedList: this.failedEmails
      };

    } catch (error) {
      console.error('❌ Error processing technicians:', error);
      throw error;
    }
  }

  // Process a single technician based on their status
  async processSingleTechnician(technician) {
    try {
      const { id, firstName, lastName, email, status, expertise } = technician;
      
      console.log(`📧 Processing: ${firstName} ${lastName} (${email}) - Status: ${status}`);

      if (!email || !firstName || !lastName) {
        console.warn(`⚠️ Skipping incomplete record: ${id}`);
        this.failedEmails.push({
          id,
          email: email || 'No email',
          name: `${firstName || 'No name'} ${lastName || ''}`,
          reason: 'Incomplete data'
        });
        return;
      }

      let emailSent = false;

      switch (status?.toLowerCase()) {
        case 'approved':
          emailSent = await this.sendApprovalEmail(technician);
          break;
        case 'rejected':
          emailSent = await this.sendRejectionEmail(technician);
          break;
        case 'pending':
          console.log(`⏳ Skipping pending registration: ${firstName} ${lastName}`);
          return;
        default:
          console.log(`❓ Unknown status '${status}' for: ${firstName} ${lastName}`);
          return;
      }

      if (emailSent) {
        this.processedEmails.push({
          id,
          email,
          name: `${firstName} ${lastName}`,
          status,
          timestamp: new Date().toISOString()
        });
        console.log(`✅ Email sent successfully to: ${firstName} ${lastName}`);
      } else {
        this.failedEmails.push({
          id,
          email,
          name: `${firstName} ${lastName}`,
          reason: 'Email sending failed'
        });
        console.log(`❌ Failed to send email to: ${firstName} ${lastName}`);
      }

    } catch (error) {
      console.error(`❌ Error processing technician ${technician.id}:`, error);
      this.failedEmails.push({
        id: technician.id,
        email: technician.email || 'Unknown',
        name: `${technician.firstName || 'Unknown'} ${technician.lastName || ''}`,
        reason: error.message
      });
    }
  }

  // Send approval email
  async sendApprovalEmail(technician) {
    try {
      return await this.emailService.sendApprovalEmailWithInstructions(technician);
    } catch (error) {
      console.error('Error sending approval email:', error);
      return false;
    }
  }

  // Send rejection email
  async sendRejectionEmail(technician) {
    try {
      return await this.emailService.sendRejectionEmail(technician);
    } catch (error) {
      console.error('Error sending rejection email:', error);
      return false;
    }
  }

  // Utility function to add delay
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Generate summary report
  generateReport(results) {
    const report = `
📊 BULK EMAIL PROCESSING REPORT
=====================================
📧 Total Processed: ${results.processed}
❌ Total Failed: ${results.failed}
⏰ Completed: ${new Date().toLocaleString()}

✅ SUCCESSFUL EMAILS:
${results.processedList.map(item => 
  `• ${item.name} (${item.email}) - ${item.status.toUpperCase()}`
).join('\n') || 'None'}

❌ FAILED EMAILS:
${results.failedList.map(item => 
  `• ${item.name} (${item.email}) - ${item.reason}`
).join('\n') || 'None'}
=====================================
    `;
    
    console.log(report);
    return report;
  }
}

// Export for use in other files
window.BulkEmailProcessor = BulkEmailProcessor;
