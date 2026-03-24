#!/bin/bash

# Quick Start Guide for E-Commerce App with Authentication

echo "================================"
echo "E-Commerce App - Quick Start"
echo "================================"
echo ""

# Check if Node modules are installed
if [ ! -d "node_modules" ]; then
    echo "🔹 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "================================"
echo "Starting Services"
echo "================================"
echo ""

echo "📝 Instructions:"
echo ""
echo "1️⃣  Open Terminal 1 and run:"
echo "   npm run json-server"
echo ""
echo "2️⃣  Open Terminal 2 and run:"
echo "   npm start"
echo ""
echo "3️⃣  Open browser and navigate to:"
echo "   http://localhost:4200"
echo ""
echo "================================"
echo "Test Credentials"
echo "================================"
echo ""
echo "Username: john_doe        | Password: password123"
echo "Username: jane_smith      | Password: password456"
echo "Username: bob_wilson      | Password: password789"
echo ""
echo "Or create a new account by clicking 'Sign up here' on the login page"
echo ""

echo "================================"
echo "Project Structure"
echo "================================"
echo ""
echo "✅ Authentication Service       src/app/services/auth.service.ts"
echo "✅ Login Component              src/app/components/login/"
echo "✅ Signup Component             src/app/components/signup/"
echo "✅ Auth Guard                   src/app/guards/auth.guard.ts"
echo "✅ Database                     db.json"
echo "✅ Updated Header               src/app/components/header/"
echo ""

echo "================================"
echo "All systems ready!"
echo "================================"
