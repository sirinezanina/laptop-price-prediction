# 1. Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Inject environment variable at build time
ARG NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Production stage
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./
RUN npm install --only=production

EXPOSE 80

# Explicitly set port to 80
CMD ["npm", "start", "--", "-p", "80"]