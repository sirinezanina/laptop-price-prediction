# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source files
COPY . .

# Inject a placeholder at build time
ENV NEXT_PUBLIC_BACKEND_URL=PLACEHOLDER_NEXT_PUBLIC_BACKEND_URL
RUN npm run build

# 2. Production stage
FROM node:18-alpine

WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json ./
RUN npm install --only=production

# Copy the built app
COPY --from=builder /app ./

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Start with entrypoint that replaces placeholder at runtime
ENTRYPOINT ["/entrypoint.sh"]
CMD ["npm", "start", "--", "-p", "80"]
