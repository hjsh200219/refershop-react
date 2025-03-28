const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const app = express();

// CORS 설정 업데이트
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3002'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const generateHmac = (method, url, secretKey, timestamp) => {
  const urlPath = url.replace('https://api-gateway.coupang.com', '');
  const message = `${method}\n${urlPath}\n${timestamp}`;
  console.log('Generating HMAC with:', {
    method,
    urlPath,
    timestamp,
    messagePreview: message.substring(0, 50) + '...'
  });
  return crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');
};

app.get('/api/coupang-search', async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({ message: 'Keyword is required' });
    }

    const accessKey = process.env.REACT_APP_COUPANG_ACCESS_KEY;
    const secretKey = process.env.REACT_APP_COUPANG_SECRET_KEY;
    const subId = process.env.REACT_APP_COUPANG_SUB_ID;

    console.log('Environment variables:', {
      accessKey: accessKey ? accessKey.substring(0, 5) + '...' : 'missing',
      secretKey: secretKey ? secretKey.substring(0, 5) + '...' : 'missing',
      subId: subId || 'missing'
    });

    if (!accessKey || !secretKey || !subId) {
      return res.status(500).json({ 
        message: 'Coupang API credentials not configured',
        details: {
          accessKey: !accessKey,
          secretKey: !secretKey,
          subId: !subId
        }
      });
    }

    const baseUrl = "https://api-gateway.coupang.com";
    const searchUrl = "/v2/providers/affiliate_open_api/apis/openapi/products/search";
    
    const params = new URLSearchParams({
      keyword: keyword,
      limit: '10',
      subId: subId
    }).toString();

    const fullUrl = `${baseUrl}${searchUrl}?${params}`;
    const timestamp = new Date().toISOString();
    const signature = generateHmac('GET', fullUrl, secretKey, timestamp);

    console.log('Making request to Coupang API:', {
      fullUrl,
      timestamp,
      signature: signature.substring(0, 10) + '...'
    });

    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Authorization': `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${timestamp}, signature=${signature}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Coupang API Response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    const responseText = await response.text();
    console.log('Response body preview:', responseText.substring(0, 200));

    if (!response.ok) {
      throw new Error(`Coupang API request failed: ${response.status} ${response.statusText}\n${responseText}`);
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      return res.status(500).json({
        message: 'Invalid JSON response from Coupang API',
        error: parseError.message,
        responsePreview: responseText.substring(0, 200)
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      message: 'Server error while processing Coupang API request',
      error: error.message
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 