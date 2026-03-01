#!/bin/bash

echo "--- Running Backend Tests (Pytest) ---"
cd backend
pytest tests/
cd ..

echo ""
echo "--- Running Frontend Tests (Vitest) ---"
cd frontend
npm run test
cd ..
