# ── Stage 1: install dependencies & build ────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Install OS-level build tools needed by native modules (canvas, etc.)
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package manifest first so Docker can cache the install layer
COPY package.json ./

# No lockfile is present; use npm install.
# --legacy-peer-deps tolerates the peer-dep conflicts that MediaPipe and
# Whisper.js can introduce against React 18 / Next 14.
RUN npm install --legacy-peer-deps

# Copy the rest of the source
COPY . .

# Build the Next.js application
RUN npm run build

# ── Stage 2: production runtime ───────────────────────────────────────────────
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
# Disable Next.js telemetry inside the container
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# Copy only what Next.js needs to run
COPY --from=builder /app/public*          ./public/
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
# Synova Voice Integration - Next.js Dockerfile
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
EXPOSE 3004

# Start the application
CMD ["npm", "start"]
