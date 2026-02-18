#!/bin/bash
# ClawSouls Setup Script

set -e

echo "🔧 Setting up ClawSouls..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ first."
  exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
  echo "⚠️  Node.js version $NODE_VERSION detected. ClawSouls requires Node.js 18+."
  read -p "Continue anyway? (y/n): " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f .env.local ]; then
  echo "📝 Creating .env.local from .env.local.example..."
  cp .env.local.example .env.local
  echo "⚠️  Remember to edit .env.local with your configuration!"
fi

# Create necessary directories
mkdir -p .next

echo "✅ Setup complete!"
echo "🚀 Run 'npm run dev' to start the development server."
echo "📖 Read README.md for more information."
