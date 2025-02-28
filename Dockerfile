# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Accept build arguments for Prisma
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Ensure Prisma schema is included
COPY prisma prisma

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript project
RUN npm run build

# Stage 2: Run
FROM node:20-alpine AS runner

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma  

# Set runtime environment variable (optional)
ENV DATABASE_URL=$DATABASE_URL

EXPOSE 3000

CMD ["node", "dist/index.js"]
