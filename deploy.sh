#!/bin/bash

echo "🚀 Deploying Mzanzi Shield..."

# Build and start containers
docker-compose down
docker-compose up --build -d

echo "✅ Deployment complete!"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "🗄️  MongoDB: localhost:27017"