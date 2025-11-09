#!/usr/bin/env bash
for i in {1..2000}; do
  curl -s -o /dev/null -X POST "http://localhost:80/api/buy" \
    -H "Host: purchase.local" \
    -H "Content-Type: application/json" \
    -d '{"username":"elad","userId":"555","price":13.00}' &
done
wait
