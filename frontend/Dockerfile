# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Build the Next.js app
RUN npm run build

# 2. Production stage
FROM node:18-alpine

WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app ./

# Install only production dependencies
RUN npm install --only=production

# Expose port 80 (default for Next.js)
EXPOSE 80

# Start the Next.js app
CMD ["npm", "start"]
