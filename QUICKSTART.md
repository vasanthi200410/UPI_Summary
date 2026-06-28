# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Start the Backend Server

```bash
cd backend
npm start
```

Server will run on: `http://localhost:3001`

### Step 3: Start the Frontend

Open a new terminal:
```bash
cd frontend
npm start
```

Application will open automatically at: `http://localhost:3000`

## ✅ Verify Installation

1. Backend should show:
   ```
   Backend server running on http://localhost:3001
   Available endpoints:
     GET    /api/transactions
     POST   /api/transactions
     PUT    /api/transactions/:id
     GET    /api/categories
     GET    /api/stats
   ```

2. Frontend should open in browser showing:
   - Statistics dashboard
   - Category breakdown
   - Transaction stream
   - Add transaction form

## 🧪 Test the Application

### Test 1: View Existing Transactions
- You should see 4 pre-loaded sample transactions
- Statistics should show totals
- Categories should display with progress bars

### Test 2: Add a Food Transaction
1. In "Add New Transaction" form:
   - Description: `Paid Rs. 300 to Swiggy`
   - Amount: `-300`
2. Click "Add Transaction"
3. Verify:
   - Transaction appears in stream
   - Auto-categorized as "Food & Dining"
   - Statistics updated

### Test 3: Add a Cashback Transaction
1. In "Add New Transaction" form:
   - Description: `Paid Rs. 1000 to Flipkart with Cashback offer`
   - Amount: `-1000`
2. Click "Add Transaction"
3. Verify:
   - Transaction appears with cashback indicator
   - Shows "Expected Savings: ₹100"
   - Auto-categorized as "Shopping"

### Test 4: Change Category
1. Find any transaction
2. Click the category dropdown
3. Select a different category
4. Verify:
   - Category updates immediately
   - Statistics recalculate
   - Progress bars adjust

### Test 5: Add Income
1. In "Add New Transaction" form:
   - Description: `Received Rs. 50000 from Tech Solutions Pvt Ltd`
   - Amount: `50000`
2. Click "Add Transaction"
3. Verify:
   - Shows as positive (green) amount
   - Auto-categorized as "Salary"
   - Total Income increases

## 🎯 Key Features to Explore

### Automated Categorization
Try these descriptions to see auto-categorization:
- `Paid Rs. 200 to Zomato` → Food & Dining
- `Paid Rs. 100 to Uber` → Travel
- `Paid Rs. 500 to Amazon` → Shopping
- `Paid Rs. 199 to Netflix` → Entertainment
- `Received Rs. 30000 from ABC Technologies` → Salary

### Cashback Detection
Add "cashback", "reward", "points", "bonus", or "offer" to any expense:
- `Paid Rs. 800 to Myntra with reward points` → Shows savings
- `Paid Rs. 1500 to BookMyShow cashback offer` → Shows savings

### Category Override
- Every transaction has a dropdown
- Change category anytime
- All statistics update automatically

## 📱 Mobile Testing

1. Open `http://localhost:3000` on your mobile device (same network)
2. Or use browser DevTools responsive mode
3. Verify responsive design works correctly

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if Node.js is installed
node --version

# Should show v14 or higher
```

### Frontend won't start
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm start
```

### Can't connect to backend
1. Verify backend is running on port 3001
2. Check `frontend/src/App.js` line 4:
   ```javascript
   const API_BASE_URL = 'http://localhost:3001/api';
   ```
3. Make sure no firewall is blocking the connection

### Port already in use
```bash
# Backend - use different port
PORT=3002 npm start

# Frontend - will prompt to use different port automatically
```

## 📊 Sample Data

The application comes with 4 pre-loaded transactions:
1. Paid Rs. 250 to Zomato (Food & Dining)
2. Received Rs. 1200 from Private Company Ltd (Salary)
3. Paid Rs. 150 to Uber (Travel)
4. Paid Rs. 500 to Amazon with Cashback (Shopping, with ₹50 savings)

## 🎓 Next Steps

1. Read `README.md` for complete documentation
2. Check `IMPLEMENTATION_DETAILS.md` for technical details
3. Explore the code in `backend/server.js` and `frontend/src/App.js`
4. Customize categories and keywords as needed
5. Deploy to production (see README for deployment guide)

## 💡 Tips

- Use negative amounts for expenses (e.g., -500)
- Use positive amounts for income (e.g., 5000)
- Include merchant names for auto-categorization
- Add "cashback" keyword to see savings calculation
- Categories can be changed anytime via dropdown

## 🎉 You're Ready!

Your Bank Transaction Manager is now running. Start adding transactions and explore the features!

For questions or issues, refer to the main README.md file.