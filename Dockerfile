FROM node:18-alpine

WORKDIR /app

# Copy root workspace manifest
COPY package.json ./

# Copy workspace package manifests so npm can resolve the workspace graph
COPY synova-app-template/package.json ./synova-app-template/
COPY synova-holo-renderer/package.json ./synova-holo-renderer/
COPY synova-monitoring/package.json ./synova-monitoring/

# Install workspace dependencies (no postinstall scripts, production only)
RUN npm install --ignore-scripts --omit=dev

# Copy the rest of the source
COPY . .

# Inline health-check server — no extra runtime dependencies required
RUN printf '%s\n' \
  "const http = require('http');" \
  "const PORT = process.env.PORT || 3000;" \
  "const server = http.createServer((req, res) => {" \
  "  if (req.url === '/health' || req.url === '/') {" \
  "    res.writeHead(200, { 'Content-Type': 'application/json' });" \
  "    res.end(JSON.stringify({ status: 'ok', service: 'synova-workspace', version: '1.0.0' }));" \
  "  } else {" \
  "    res.writeHead(404, { 'Content-Type': 'application/json' });" \
  "    res.end(JSON.stringify({ error: 'not found' }));" \
  "  }" \
  "});" \
  "server.listen(PORT, '0.0.0.0', () => {" \
  "  console.log('synova-workspace health server listening on port ' + PORT);" \
  "});" \
  > server.js

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "server.js"]
