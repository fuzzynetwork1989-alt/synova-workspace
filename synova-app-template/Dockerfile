# syntax=docker/dockerfile:1

# ── Stage 1: deps ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package manifest.
# This template repo ships without a lockfile, so fall back to npm install.
COPY package.json ./
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# ── Stage 2: builder ──────────────────────────────────────────────────────────
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ── Scaffold missing Next.js config files ─────────────────────────────────────

# tsconfig.json
RUN [ -f tsconfig.json ] || cat > tsconfig.json <<'TSEOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
TSEOF

# next.config.js — enable standalone output for a lean production image
RUN [ -f next.config.js ] || cat > next.config.js <<'NCEOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
};
module.exports = nextConfig;
NCEOF

# Minimal App Router pages (only created when no pages exist at all)
RUN if [ ! -d app ] && [ ! -d pages ] && [ ! -d src ]; then \
      mkdir -p app && \
      printf 'export const metadata = { title: "Synova App" };\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n' > app/layout.tsx && \
      printf 'export default function Home() {\n  return <main><h1>Synova App Template</h1></main>;\n}\n' > app/page.tsx; \
    fi

ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# ── Stage 3: runner ───────────────────────────────────────────────────────────
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public                              ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static     ./.next/static

USER nextjs

EXPOSE 3000

# next start (via the standalone server.js) — equivalent to "npm start"
CMD ["node", "server.js"]
