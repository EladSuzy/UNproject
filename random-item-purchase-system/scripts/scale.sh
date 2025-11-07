#!/usr/bin/env bash
for i in {1..500}; do
  echo "Request $i"
  curl -i -X POST "http://localhost:80/api/buy"   -H "Host: purchase.local"   -H "Content-Type: application/json"   -d '{"username":"elad","userId":"555","price":13.00}'    
  echo
done
