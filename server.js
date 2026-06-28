const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');

// Transaction categories and their keywords
const CATEGORY_KEYWORDS = {
  'Food & Dining': ['zomato', 'swiggy', 'dominos', 'pizza', 'restaurant', 'cafe', 'food', 'mcdonald', 'kfc', 'burger'],
  'Travel': ['uber', 'ola', 'rapido', 'irctc', 'makemytrip', 'goibibo', 'flight', 'hotel', 'taxi'],
  'Salary': ['salary', 'private company', 'pvt ltd', 'limited', 'corporation', 'technologies', 'solutions'],
  'Shopping': ['amazon', 'flipkart', 'myntra', 'ajio', 'shopping', 'mall', 'store'],
  'Entertainment': ['netflix', 'prime', 'hotstar', 'spotify', 'bookmyshow', 'movie', 'cinema'],
  'Utilities': ['electricity', 'water', 'gas', 'broadband', 'mobile', 'recharge', 'bill'],
  'Miscellaneous': []
};

// Cashback and reward keywords
const CASHBACK_KEYWORDS = ['cashback', 'reward', 'points', 'bonus', 'offer'];

// In-memory storage for transactions
let transactions = [
  {
    id: 1,
    description: 'Paid Rs. 250 to Zomato',
    amount: -250,
    category: 'Food & Dining',
    timestamp: new Date().toISOString(),
    hasCashback: false
  },
  {
    id: 2,
    description: 'Received Rs. 1200 from Private Company Ltd',
    amount: 1200,
    category: 'Salary',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    hasCashback: false
  },
  {
    id: 3,
    description: 'Paid Rs. 150 to Uber',
    amount: -150,
    category: 'Travel',
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    hasCashback: false
  },
  {
    id: 4,
    description: 'Paid Rs. 500 to Amazon with Cashback offer',
    amount: -500,
    category: 'Shopping',
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    hasCashback: true,
    expectedSavings: 50
  }
];

// Auto-categorize transaction based on keywords
function categorizeTransaction(description) {
  const lowerDesc = description.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === 'Miscellaneous') continue;
    
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword)) {
        return category;
      }
    }
  }
  
  return 'Miscellaneous';
}

// Detect cashback in transaction
function detectCashback(description, amount) {
  const lowerDesc = description.toLowerCase();
  const hasCashback = CASHBACK_KEYWORDS.some(keyword => lowerDesc.includes(keyword));
  
  if (hasCashback && amount < 0) {
    // Calculate expected savings (10% of transaction amount)
    const expectedSavings = Math.abs(amount) * 0.10;
    return { hasCashback: true, expectedSavings: Math.round(expectedSavings) };
  }
  
  return { hasCashback: false, expectedSavings: 0 };
}

// Calculate category summaries
function calculateCategorySummaries() {
  const summaries = {};
  
  // Initialize all categories
  Object.keys(CATEGORY_KEYWORDS).forEach(category => {
    summaries[category] = {
      category,
      totalSpent: 0,
      totalReceived: 0,
      transactionCount: 0,
      netAmount: 0
    };
  });
  
  // Calculate totals
  transactions.forEach(transaction => {
    const category = transaction.category;
    if (!summaries[category]) {
      summaries[category] = {
        category,
        totalSpent: 0,
        totalReceived: 0,
        transactionCount: 0,
        netAmount: 0
      };
    }
    
    summaries[category].transactionCount++;
    
    if (transaction.amount < 0) {
      summaries[category].totalSpent += Math.abs(transaction.amount);
    } else {
      summaries[category].totalReceived += transaction.amount;
    }
    
    summaries[category].netAmount += transaction.amount;
  });
  
  return Object.values(summaries).filter(s => s.transactionCount > 0);
}

// Calculate overall statistics
function calculateOverallStats() {
  let totalIncome = 0;
  let totalExpense = 0;
  let totalCashbackSavings = 0;
  
  transactions.forEach(transaction => {
    if (transaction.amount > 0) {
      totalIncome += transaction.amount;
    } else {
      totalExpense += Math.abs(transaction.amount);
    }
    
    if (transaction.hasCashback && transaction.expectedSavings) {
      totalCashbackSavings += transaction.expectedSavings;
    }
  });
  
  return {
    totalIncome,
    totalExpense,
    netBalance: totalIncome - totalExpense,
    totalCashbackSavings,
    transactionCount: transactions.length
  };
}

// Handle CORS
function setCORSHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Create HTTP server
const server = http.createServer((req, res) => {
  setCORSHeaders(res);
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  // GET /api-docs - Serve Swagger JSON
  if (pathname === '/api-docs' && req.method === 'GET') {
    try {
      const swaggerPath = path.join(__dirname, 'swagger.json');
      const swaggerContent = fs.readFileSync(swaggerPath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(swaggerContent);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        error: 'Failed to load Swagger documentation'
      }));
    }
    return;
  }
  
  // GET /swagger - Serve Swagger UI HTML
  if (pathname === '/swagger' && req.method === 'GET') {
    const swaggerHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bank Transaction API - Swagger Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css">
  <style>
    body { margin: 0; padding: 0; }
    .topbar { display: none; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function() {
      SwaggerUIBundle({
        url: '/api-docs',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        plugins: [
          SwaggerUIBundle.plugins.DownloadUrl
        ],
        layout: "StandaloneLayout"
      });
    };
  </script>
</body>
</html>
    `;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(swaggerHTML);
    return;
  }
  
  // GET /api/transactions - Get all transactions
  if (pathname === '/api/transactions' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: transactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    }));
    return;
  }
  
  // POST /api/transactions - Add new transaction
  if (pathname === '/api/transactions' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { description, amount } = data;
        
        // Auto-categorize
        const category = categorizeTransaction(description);
        
        // Detect cashback
        const cashbackInfo = detectCashback(description, amount);
        
        const newTransaction = {
          id: transactions.length + 1,
          description,
          amount: parseFloat(amount),
          category,
          timestamp: new Date().toISOString(),
          ...cashbackInfo
        };
        
        transactions.push(newTransaction);
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: newTransaction
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
  }
  
  // PUT /api/transactions/:id - Update transaction category
  if (pathname.startsWith('/api/transactions/') && req.method === 'PUT') {
    const id = parseInt(pathname.split('/')[3]);
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const transaction = transactions.find(t => t.id === id);
        
        if (!transaction) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'Transaction not found'
          }));
          return;
        }
        
        transaction.category = data.category;
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          data: transaction
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: 'Invalid request body'
        }));
      }
    });
    return;
  }
  
  // GET /api/categories - Get category summaries
  if (pathname === '/api/categories' && req.method === 'GET') {
    const summaries = calculateCategorySummaries();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: summaries
    }));
    return;
  }
  
  // GET /api/stats - Get overall statistics
  if (pathname === '/api/stats' && req.method === 'GET') {
    const stats = calculateOverallStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      data: stats
    }));
    return;
  }
  
  // 404 Not Found
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    error: 'Route not found'
  }));
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log('\n📚 API Documentation:');
  console.log(`  Swagger UI: http://localhost:${PORT}/swagger`);
  console.log(`  OpenAPI JSON: http://localhost:${PORT}/api-docs`);
  console.log('\n🔌 Available endpoints:');
  console.log('  GET    /api/transactions');
  console.log('  POST   /api/transactions');
  console.log('  PUT    /api/transactions/:id');
  console.log('  GET    /api/categories');
  console.log('  GET    /api/stats');
});

// Made with Bob
