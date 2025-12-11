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
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { email, name } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    console.log(`Approval request for: ${name} <${email}>`);
    
    // For now, just return success
    return res.status(200).json({ 
      success: true,
      message: 'Approval processed successfully',
      data: { email, name }
    });
    
  } catch (error) {
    console.error('Error in approve-tech:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Server error',
      details: error.message 
    });
  }
}
