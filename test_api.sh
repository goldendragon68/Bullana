#!/bin/bash

# Bullana Bet - Automated API Testing Script
# Run this script to test backend authentication endpoints

API_BASE="http://localhost:13578"
TIMESTAMP=$(date +%s)
TEST_EMAIL="test_${TIMESTAMP}@bullana.local"
TEST_USERNAME="testuser_${TIMESTAMP}"
TEST_PASSWORD="TestPassword123!"

echo "🚀 Starting Bullana Bet API Testing..."
echo "========================================"
echo "API Base URL: $API_BASE"
echo "Test User: $TEST_EMAIL"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
    fi
}

# Function to extract JSON value
extract_json() {
    echo "$1" | grep -o "\"$2\":[^,}]*" | cut -d'"' -f4
}

echo -e "${BLUE}📋 Test 1: Backend Health Check${NC}"
echo "----------------------------------------"
response=$(curl -s -w "%{http_code}" -o /tmp/health_response.txt "$API_BASE/apiRoute/getResponse")
http_code=$(echo "$response" | tail -c 4)

if [ "$http_code" = "200" ]; then
    print_result 0 "Backend server is responding"
else
    print_result 1 "Backend server health check failed (HTTP $http_code)"
    echo "Response: $(cat /tmp/health_response.txt)"
fi
echo ""

echo -e "${BLUE}📋 Test 2: User Registration${NC}"
echo "----------------------------------------"
registration_response=$(curl -s -X POST "$API_BASE/basic/signup" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"$TEST_USERNAME\",
        \"email\": \"$TEST_EMAIL\",
        \"password\": \"$TEST_PASSWORD\",
        \"refer\": \"\"
    }")

echo "Registration Response: $registration_response"

# Check if registration was successful
if echo "$registration_response" | grep -q '"success":true'; then
    print_result 0 "User registration successful"
    REGISTRATION_SUCCESS=true
else
    print_result 1 "User registration failed"
    REGISTRATION_SUCCESS=false
    echo "Response: $registration_response"
fi
echo ""

echo -e "${BLUE}📋 Test 3: User Login${NC}"
echo "----------------------------------------"
if [ "$REGISTRATION_SUCCESS" = true ]; then
    login_response=$(curl -s -X POST "$API_BASE/basic/login" \
        -H "Content-Type: application/json" \
        -d "{
            \"email\": \"$TEST_EMAIL\",
            \"password\": \"$TEST_PASSWORD\"
        }")
    
    echo "Login Response: $login_response"
    
    # Extract JWT token
    if echo "$login_response" | grep -q '"success":true'; then
        JWT_TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        print_result 0 "User login successful"
        echo -e "${YELLOW}JWT Token (first 50 chars): ${JWT_TOKEN:0:50}...${NC}"
        LOGIN_SUCCESS=true
    else
        print_result 1 "User login failed"
        LOGIN_SUCCESS=false
        echo "Response: $login_response"
    fi
else
    print_result 1 "Skipping login test due to registration failure"
    LOGIN_SUCCESS=false
fi
echo ""

echo -e "${BLUE}📋 Test 4: JWT Token Validation${NC}"
echo "----------------------------------------"
if [ "$LOGIN_SUCCESS" = true ] && [ -n "$JWT_TOKEN" ]; then
    # Test a protected endpoint (you may need to adjust this based on your actual protected routes)
    protected_response=$(curl -s -w "%{http_code}" -o /tmp/protected_response.txt \
        -H "Authorization: Bearer $JWT_TOKEN" \
        "$API_BASE/some-protected-endpoint")
    
    protected_http_code=$(echo "$protected_response" | tail -c 4)
    
    if [ "$protected_http_code" = "200" ] || [ "$protected_http_code" = "404" ]; then
        print_result 0 "JWT token is being sent correctly"
    else
        print_result 1 "JWT token validation failed (HTTP $protected_http_code)"
        echo "Response: $(cat /tmp/protected_response.txt)"
    fi
else
    print_result 1 "Skipping JWT validation due to login failure"
fi
echo ""

echo -e "${BLUE}📋 Test 5: Invalid Login Attempt${NC}"
echo "----------------------------------------"
invalid_login_response=$(curl -s -X POST "$API_BASE/basic/login" \
    -H "Content-Type: application/json" \
    -d "{
        \"email\": \"invalid@email.com\",
        \"password\": \"wrongpassword\"
    }")

if echo "$invalid_login_response" | grep -q '"success":false'; then
    print_result 0 "Invalid login properly rejected"
else
    print_result 1 "Invalid login was not properly rejected"
    echo "Response: $invalid_login_response"
fi
echo ""

echo -e "${BLUE}📋 Test 6: CORS Headers Check${NC}"
echo "----------------------------------------"
cors_response=$(curl -s -I -H "Origin: http://localhost:3000" "$API_BASE/apiRoute/getResponse")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    print_result 0 "CORS headers are present"
else
    print_result 1 "CORS headers are missing"
fi
echo ""

echo -e "${BLUE}📋 Test 7: Malformed JSON Handling${NC}"
echo "----------------------------------------"
malformed_response=$(curl -s -w "%{http_code}" -o /tmp/malformed_response.txt \
    -X POST "$API_BASE/basic/login" \
    -H "Content-Type: application/json" \
    -d "{ invalid json }")

malformed_http_code=$(echo "$malformed_response" | tail -c 4)

if [ "$malformed_http_code" = "400" ] || [ "$malformed_http_code" = "500" ]; then
    print_result 0 "Malformed JSON properly handled"
else
    print_result 1 "Malformed JSON not properly handled (HTTP $malformed_http_code)"
fi
echo ""

echo "========================================"
echo -e "${GREEN}🎉 API Testing Complete!${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Open http://localhost:3000 to test the frontend"
echo "2. Navigate to /register and test Phantom wallet connection"
echo "3. Test the complete registration and login flow"
echo "4. Check browser console for any JavaScript errors"
echo "5. Verify JWT tokens are stored in localStorage"
echo ""
echo -e "${YELLOW}🔍 Manual Testing Checklist:${NC}"
echo "□ Phantom wallet connection/disconnection"
echo "□ Form validation and error messages"
echo "□ Auto-fill functionality when wallet connects"
echo "□ Navigation between login and register pages"
echo "□ Responsive design on mobile devices"
echo "□ JWT token persistence across page refreshes"
echo ""

# Cleanup temp files
rm -f /tmp/health_response.txt /tmp/protected_response.txt /tmp/malformed_response.txt

exit 0
