#!/bin/sh

echo "🔄 Replacing placeholders with real environment variables..."

# Replace placeholder in all built .next files
find /app/.next -type f -exec sed -i "s#PLACEHOLDER_NEXT_PUBLIC_BACKEND_URL#$NEXT_PUBLIC_BACKEND_URL#g" {} +

echo "✅ Starting application..."
exec "$@"
