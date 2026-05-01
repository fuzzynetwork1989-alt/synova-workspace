# ── Build stage ──────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package manifest and install all dependencies (including devDependencies
# needed for the TypeScript compiler)
COPY package.json ./
RUN npm install

# Copy source and compile TypeScript → JavaScript
COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:18-alpine AS runner

WORKDIR /app

# Copy package manifest and install production dependencies only
COPY package.json ./
RUN npm install --omit=dev

# Copy compiled output from the build stage
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/monitoring.js"]
# Synova Monitoring - Node.js Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3002

# Start the application
CMD ["npm", "start"]
