# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install required packages for Prisma (e.g., OpenSSL)
RUN apk add --no-cache openssl

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript to JavaScript
RUN npm run build

# Expose the port (change if needed)
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
