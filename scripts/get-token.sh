#!/bin/bash

# Script to get authentication token for API calls
# Usage: source scripts/get-token.sh

# Default admin credentials (you should change these in production)
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="password123"

# API base URL
API_BASE_URL="http://localhost:3000/v1"

echo "Getting authentication token..."

# Login and get token
TOKEN=$(curl -s -X POST "${API_BASE_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\"
  }" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "Failed to get token. Please check your credentials and server status."
  exit 1
fi

echo "Token obtained successfully!"
echo "Token: $TOKEN"
echo ""
echo "You can now use this token in your API calls:"
echo "export API_TOKEN=\"$TOKEN\""
echo ""
echo "Or use it directly:"
echo "curl -H \"Authorization: Bearer $TOKEN\" http://localhost:3000/v1/cron/status" 