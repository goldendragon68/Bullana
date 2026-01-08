# Bullana Bet - Production Testing Guide
## Phantom Wallet Authentication & Registration

### 🚀 Services Status
- **Frontend (React)**: http://localhost:3000
- **Backend (Node.js)**: http://localhost:13578  
- **Admin Panel (Angular)**: http://localhost:4200

---

## 🧪 Test Scenarios

### 1. **Registration Flow Testing**

#### 1.1 Basic Registration (Without Wallet)
- [ ] Navigate to `/register`
- [ ] Enter valid name and email
- [ ] Click "REGISTER" button
- [ ] Verify success message appears
- [ ] Verify redirect to login page after 2 seconds
- [ ] Check backend logs for user creation

#### 1.2 Phantom Wallet Connection
- [ ] Navigate to `/register`
- [ ] Click "CONNECT WALLET" button
- [ ] Verify Phantom wallet popup appears
- [ ] Approve connection in Phantom
- [ ] Verify wallet address appears on screen
- [ ] Verify auto-fill of name and email fields
- [ ] Check wallet status display shows "Wallet Connected"

#### 1.3 Registration with Connected Wallet
- [ ] Connect wallet (follow 1.2)
- [ ] Modify auto-filled name/email if needed
- [ ] Click "REGISTER" button
- [ ] Verify successful registration
- [ ] Check that user is created with wallet association

#### 1.4 Wallet Disconnection
- [ ] Connect wallet first
- [ ] Click "DISCONNECT WALLET" button
- [ ] Verify wallet status disappears
- [ ] Verify form fields remain filled
- [ ] Check console for clean disconnection

### 2. **Login Flow Testing**

#### 2.1 Traditional Email/Password Login
- [ ] Navigate to `/login`
- [ ] Enter registered email and password
- [ ] Click "LOGIN" button
- [ ] Verify JWT token is stored
- [ ] Verify redirect to dashboard/home
- [ ] Check network tab for token in headers

#### 2.2 Wallet Connection on Login
- [ ] Navigate to `/login`
- [ ] Click "CONNECT WALLET" button
- [ ] Approve connection in Phantom
- [ ] Verify wallet address display
- [ ] Verify login form still functional

#### 2.3 Wallet-Based Authentication (Future)
- [ ] Connect wallet on login page
- [ ] Verify placeholder for wallet-based login
- [ ] Test error handling for unsupported flow

### 3. **Authentication Security Testing**

#### 3.1 JWT Token Validation
- [ ] Login successfully
- [ ] Open browser dev tools → Application → Local Storage
- [ ] Verify JWT token is stored
- [ ] Copy token and decode at jwt.io
- [ ] Verify token contains correct user data and expiry

#### 3.2 Protected Route Access
- [ ] Without login, try accessing protected pages
- [ ] Verify redirects to login page
- [ ] Login and verify access is granted
- [ ] Clear token and verify access is denied

#### 3.3 Token Expiry Handling
- [ ] Login and get token
- [ ] Manually modify token expiry in localStorage
- [ ] Refresh page or make API call
- [ ] Verify automatic logout/re-authentication

### 4. **Error Handling Testing**

#### 4.1 Phantom Wallet Not Installed
- [ ] Test on browser without Phantom extension
- [ ] Click "CONNECT WALLET"
- [ ] Verify error message appears
- [ ] Verify redirect to Phantom installation page

#### 4.2 Network/Backend Errors
- [ ] Temporarily stop backend server
- [ ] Try registration/login
- [ ] Verify appropriate error messages
- [ ] Restart backend and verify recovery

#### 4.3 Invalid Form Data
- [ ] Submit registration with empty fields
- [ ] Submit with invalid email format
- [ ] Submit with very long inputs
- [ ] Verify validation errors display

### 5. **Cross-Browser Testing**

#### 5.1 Browser Compatibility
- [ ] Test on Chrome with Phantom
- [ ] Test on Firefox with Phantom
- [ ] Test on Edge (if Phantom available)
- [ ] Verify consistent behavior

#### 5.2 Mobile Responsiveness
- [ ] Open on mobile browser
- [ ] Test registration form layout
- [ ] Test wallet connection (if mobile wallet available)
- [ ] Verify touch interactions work

### 6. **Backend API Testing**

#### 6.1 Registration Endpoint
```bash
# Test with curl or Postman
curl -X POST http://localhost:13578/basic/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com", 
    "password": "TestPassword123!",
    "refer": ""
  }'
```

#### 6.2 Login Endpoint
```bash
curl -X POST http://localhost:13578/basic/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'
```

#### 6.3 Protected Endpoint Test
```bash
# Replace YOUR_JWT_TOKEN with actual token
curl -X GET http://localhost:13578/some-protected-route \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 7. **Database Verification**

#### 7.1 User Creation Verification
- [ ] Access MongoDB database
- [ ] Check users collection for new registrations
- [ ] Verify password is properly hashed
- [ ] Verify wallet address storage (when implemented)

#### 7.2 Login History Verification
- [ ] Check user_history collection
- [ ] Verify login attempts are logged
- [ ] Check IP address and browser tracking

### 8. **Security Penetration Testing**

#### 8.1 SQL Injection Attempts
- [ ] Try SQL injection in login fields
- [ ] Try in registration fields
- [ ] Verify proper sanitization

#### 8.2 XSS Prevention
- [ ] Try script injection in form fields
- [ ] Verify proper output encoding
- [ ] Check for reflected XSS vulnerabilities

#### 8.3 CSRF Protection
- [ ] Test cross-origin requests
- [ ] Verify CORS headers are properly set
- [ ] Test with different origins

---

## 🔧 Test Data

### Sample User Accounts
```javascript
// Registration Test Data
{
  name: "Test User 1",
  email: "testuser1@bullana.local",
  password: "TestPassword123!"
}

{
  name: "Wallet User", 
  email: "wallet_ABC12345@bullana.local",
  password: "Generated_password"
}
```

### Wallet Test Addresses
- Use Phantom wallet on Solana Devnet
- Test with different wallet addresses
- Test connection/disconnection cycles

---

## 📊 Expected Results

### Success Criteria
- ✅ Registration completes without errors
- ✅ Wallet connection shows proper address
- ✅ JWT tokens are properly generated and validated
- ✅ User data is correctly stored in database
- ✅ Login redirects to appropriate pages
- ✅ Error messages are user-friendly and informative
- ✅ No console errors in browser dev tools
- ✅ Responsive design works on mobile

### Performance Metrics
- Registration: < 2 seconds
- Login: < 1 second  
- Wallet connection: < 3 seconds
- Page loads: < 2 seconds

---

## 🐛 Issue Tracking

### Common Issues to Watch For
1. **CORS errors** - Check browser network tab
2. **JWT token format** - Verify Bearer token format
3. **Phantom connection failures** - Check wallet popup blockers
4. **Database connection** - Verify MongoDB Atlas connection
5. **Port conflicts** - Ensure all services on correct ports

### Debugging Tools
- Browser Dev Tools (Network, Console, Application)
- Phantom Wallet Developer Mode
- MongoDB Compass for database inspection
- Postman/curl for API testing

---

## ✅ Production Readiness Checklist

Before going live, ensure:
- [ ] All tests pass successfully
- [ ] Error handling is comprehensive
- [ ] JWT secrets are properly configured
- [ ] Database connections are stable
- [ ] CORS is properly configured for production domains
- [ ] Rate limiting is implemented (if required)
- [ ] SSL/HTTPS is configured for production
- [ ] Monitoring and logging are set up
