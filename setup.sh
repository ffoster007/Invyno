#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/webapp";

if [ ! -f ".env" ]; then
  echo "Error: .env file not found"
  echo "Please copy .env.example and fill in the required values:"
  echo "  cp webapp/.env.example webapp/.env"
  exit 1
fi

npm install
npx prisma generate
npm run dev