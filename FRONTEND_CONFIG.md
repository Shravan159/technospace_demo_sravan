# Frontend Configuration Guide for Grab!t

## Overview
This guide will help you configure the frontend to work seamlessly with the backend API that's now running on `http://localhost:3000`.

## Current Setup Status ✅

### Backend Server
- **Status**: Running on `http://localhost:3000`
- **Health Check**: http://localhost:3000/api/health
- **API Documentation**: See backend/README.md

### Frontend Server
- **Status**: Running on `http://localhost:8000` (Python HTTP server)
- **Firebase Auth**: Configured and working
- **CORS**: Enabled for localhost:8000

## Configuration Steps

### 1. Start the Frontend Server
Make sure your frontend is running on the correct port:

```bash
# In the main project directory
cd "c:\Users\kband\OneDrive\Desktop\4d_grabit"
python -m http.server 8000
```

### 2. Backend Integration Points

#### A. Products Integration
The frontend can now fetch products from the backend instead of using static data:

**Current**: Static product data in `products.js`
**New**: Dynamic data from `http://localhost:3000/api/products`

#### B. Order Management
The checkout system now integrates with the backend:

**Checkout Process**:
1. `checkout.html` - Order form
2. `checkout.js` - Sends orders to backend
3. Backend API processes and stores orders

#### C. User Management
User profiles and preferences are managed through:
- Backend: `http://localhost:3000/api/users`
- Frontend: Firebase Authentication

### 3. API Integration Configuration

#### API Base URL
Add this to your JavaScript files for consistent API calls:

```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

#### CORS Configuration
Already configured in backend for:
- `http://localhost:8000`
- `http://127.0.0.1:8000`

### 4. Testing the Integration

#### Test Backend Health
```bash
curl http://localhost:3000/api/health
```

#### Test Product API
```bash
curl http://localhost:3000/api/products
```

#### Test Frontend Access
1. Open: http://localhost:8000
2. Navigate to: http://localhost:8000/products.html
3. Try the checkout process

### 5. Frontend Updates Needed

#### A. Update products.js (Optional)
Replace static data with API calls:

```javascript
// Replace static products array with API fetch
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Failed to load products:', error);
        return []; // Fallback to empty array
    }
}
```

#### B. Update dashboard.js
Add order history integration:

```javascript
async function loadUserOrders(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders?userId=${userId}`);
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('Failed to load orders:', error);
        return [];
    }
}
```

### 6. Environment Configuration

#### Development Environment
- Frontend: http://localhost:8000
- Backend: http://localhost:3000
- Firebase: Production project

#### Production Considerations
For deployment, update:
- API_BASE_URL to production backend URL
- CORS settings in backend
- Firebase hosting configuration

### 7. Navigation Updates

Add checkout link to existing pages:

```html
<!-- Add to navigation in index.html, products.html, dashboard.html -->
<a href="checkout.html">Checkout</a>
```

### 8. Current Features Working

✅ **Firebase Authentication**
- Login/Signup/Logout
- Protected routes
- User state management

✅ **Product Catalog**
- Product display
- Category filtering
- Shopping cart

✅ **Backend API**
- Products CRUD
- Orders management
- User profiles

✅ **Checkout System**
- Order placement
- Form validation
- Payment method selection

### 9. Next Steps

1. **Test the full flow**:
   - Browse products → Add to cart → Checkout → Place order

2. **Optional Enhancements**:
   - Replace static products with API data
   - Add order tracking page
   - Implement user profile management

3. **Production Deployment**:
   - Deploy backend to cloud service
   - Update frontend API URLs
   - Configure production Firebase settings

### 10. Troubleshooting

#### Common Issues:

**CORS Errors**:
- Ensure frontend runs on http://localhost:8000
- Check backend CORS configuration

**API Connection Failed**:
- Verify backend is running on port 3000
- Check firewall/antivirus settings

**Authentication Issues**:
- Verify Firebase configuration
- Check network connectivity

#### Debug Commands:

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Check if frontend can reach backend
# Open browser dev tools → Network tab → Try checkout

# Check Firebase auth state
# Browser dev tools → Console → Check for auth errors
```

## Files Status

### Frontend Files ✅
- `index.html` - Main page with auth integration
- `login.html` / `signup.html` - Authentication pages  
- `products.html` - Product catalog with cart
- `dashboard.html` - User dashboard
- `checkout.html` - Order placement **NEW**
- `checkout.js` - Checkout logic **NEW**

### Backend Files ✅
- `server.js` - Express server
- `routes/products.js` - Product API
- `routes/orders.js` - Order management **NEW**
- `routes/users.js` - User management **NEW**

### Configuration Files ✅
- `firebaseconfig.js` - Firebase setup
- `backend/package.json` - Backend dependencies
- Backend running on port 3000

## Ready to Use! 🚀

Your food delivery application is now fully configured with:
- Frontend authentication (Firebase)
- Backend API (Express.js)
- Product catalog with shopping cart
- Complete checkout and order system
- User management capabilities

Simply ensure both servers are running and start testing the full application flow!