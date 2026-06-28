# Bank Transaction UPI Summary & Categorization

A full-stack automated money manager application that parses unstructured transaction alerts, categorizes transactions, and visualizes spending habits.

## 🎯 Features

### Backend Features
- **Automated Keyword Tagging Parser**: Automatically detects merchant keywords (Zomato, Swiggy, Uber, etc.) and assigns appropriate categories
- **Cumulative Metric Reducer**: Processes financial transactions and calculates category-wise summaries
- **Cashback Detection**: Identifies transactions with cashback/reward keywords and displays expected savings
- **Swagger/OpenAPI Documentation**: Interactive API documentation with Swagger UI
- **RESTful API**: Complete API for transaction management

### Frontend Features
- **Transaction Stream**: Chronological feed of transaction alerts with detailed information
- **Visual Analytics**: Category-wise breakdown with progress bars and statistics
- **Interactive Category Selector**: Dropdown menu to manually change transaction categories
- **Real-time Statistics**: Overall income, expense, net balance, and expected savings
- **Cashback Indicators**: Green "Expected Savings" display for eligible transactions
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Backend (Node.js)
- Pure Node.js HTTP server (no Express dependency required)
- In-memory data storage
- RESTful API endpoints
- Business logic for categorization and calculations

### Frontend (React)
- React 18 with Hooks
- Component-based architecture
- State management with useState and useEffect
- Responsive CSS Grid and Flexbox layout

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd bank-transaction-app
```

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The backend server will start on `http://localhost:3001`

### 3. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

## 📚 API Documentation

### Swagger UI
Interactive API documentation is available at: `http://localhost:3001/swagger`

### OpenAPI Specification
Raw OpenAPI/Swagger JSON: `http://localhost:3001/api-docs`

The Swagger UI provides:
- Complete API endpoint documentation
- Request/response schemas
- Interactive "Try it out" functionality
- Example requests and responses
- Data model definitions

## 🔌 API Endpoints

### GET /api/transactions
Get all transactions sorted by timestamp (newest first)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "description": "Paid Rs. 250 to Zomato",
      "amount": -250,
      "category": "Food & Dining",
      "timestamp": "2024-06-28T12:00:00.000Z",
      "hasCashback": false
    }
  ]
}
```

### POST /api/transactions
Add a new transaction with automatic categorization

**Request Body:**
```json
{
  "description": "Paid Rs. 500 to Amazon with Cashback",
  "amount": -500
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5,
    "description": "Paid Rs. 500 to Amazon with Cashback",
    "amount": -500,
    "category": "Shopping",
    "timestamp": "2024-06-28T12:00:00.000Z",
    "hasCashback": true,
    "expectedSavings": 50
  }
}
```

### PUT /api/transactions/:id
Update transaction category

**Request Body:**
```json
{
  "category": "Food & Dining"
}
```

### GET /api/categories
Get category-wise summaries

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "category": "Food & Dining",
      "totalSpent": 250,
      "totalReceived": 0,
      "transactionCount": 1,
      "netAmount": -250
    }
  ]
}
```

### GET /api/stats
Get overall statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalIncome": 1200,
    "totalExpense": 900,
    "netBalance": 300,
    "totalCashbackSavings": 50,
    "transactionCount": 4
  }
}
```

## 📊 Categories

The application supports the following transaction categories:

1. **Food & Dining** - Zomato, Swiggy, restaurants, cafes
2. **Travel** - Uber, Ola, IRCTC, flights, hotels
3. **Salary** - Company payments, salary credits
4. **Shopping** - Amazon, Flipkart, Myntra
5. **Entertainment** - Netflix, Spotify, BookMyShow
6. **Utilities** - Electricity, water, broadband bills
7. **Miscellaneous** - Everything else

## 💡 Key Features Explained

### Automated Categorization
When you add a transaction, the backend automatically:
1. Scans the description for merchant keywords
2. Assigns the most appropriate category
3. Returns the categorized transaction

Example:
- "Paid Rs. 250 to Zomato" → Auto-categorized as "Food & Dining"
- "Received Rs. 1200 from Private Company Ltd" → Auto-categorized as "Salary"

### Cashback Detection
The system identifies transactions containing keywords like:
- "cashback"
- "reward"
- "points"
- "bonus"
- "offer"

When detected, it:
1. Calculates expected savings (10% of transaction amount)
2. Displays a green indicator with the savings amount
3. Includes savings in overall statistics

### Manual Category Override
Users can manually change any transaction's category using the dropdown selector, which immediately updates:
- Category summaries
- Progress bars
- Overall statistics

## 🎨 UI Components

### Statistics Dashboard
- Total Income (green)
- Total Expense (red)
- Net Balance (blue)
- Expected Savings (orange)

### Category Breakdown
- Visual progress bars
- Spent vs Received amounts
- Transaction counts
- Net amount per category

### Transaction Stream
- Chronological feed
- Transaction details
- Amount with color coding
- Category selector dropdown
- Cashback indicators

### Add Transaction Form
- Description input
- Amount input (negative for expense, positive for income)
- Automatic categorization on submission

## 🧪 Testing the Application

### Test Scenarios

1. **Add Food Transaction:**
   - Description: "Paid Rs. 300 to Swiggy"
   - Amount: -300
   - Expected: Auto-categorized as "Food & Dining"

2. **Add Cashback Transaction:**
   - Description: "Paid Rs. 1000 to Flipkart with Cashback offer"
   - Amount: -1000
   - Expected: Auto-categorized as "Shopping" with Rs. 100 expected savings

3. **Add Salary:**
   - Description: "Received Rs. 50000 from Tech Solutions Pvt Ltd"
   - Amount: 50000
   - Expected: Auto-categorized as "Salary"

4. **Manual Category Change:**
   - Select any transaction
   - Change category from dropdown
   - Verify statistics update

## 📁 Project Structure

```
bank-transaction-app/
├── backend/
│   ├── package.json
│   └── server.js          # Node.js HTTP server with all business logic
├── frontend/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── App.js         # Main React component
│   │   ├── App.css        # Styling
│   │   ├── index.js       # React entry point
│   │   └── index.css      # Global styles
│   └── package.json
└── README.md
```

## 🔧 Configuration

### Backend Port
Default: `3001`
To change: Set `PORT` environment variable
```bash
PORT=4000 npm start
```

### Frontend API URL
Located in `frontend/src/App.js`:
```javascript
const API_BASE_URL = 'http://localhost:3001/api';
```

## 🚨 Troubleshooting

### Backend won't start
- Ensure Node.js is installed: `node --version`
- Check if port 3001 is available
- Try a different port: `PORT=3002 npm start`

### Frontend can't connect to backend
- Verify backend is running on port 3001
- Check CORS settings in server.js
- Update API_BASE_URL in App.js if needed

### Transactions not categorizing
- Check keyword matching in server.js
- Verify description contains recognizable merchant names
- Use manual category selector as fallback

## 🎯 Future Enhancements

- Database integration (MongoDB/PostgreSQL)
- User authentication
- Multiple user accounts
- Export transactions to CSV/PDF
- Advanced analytics and charts
- Budget setting and alerts
- Recurring transaction detection
- Mobile app version

## 📝 License

MIT License

## 👨‍💻 Author

Created for Vibe Coding Assessment

## 🙏 Acknowledgments

- React team for the amazing framework
- Node.js community for excellent documentation