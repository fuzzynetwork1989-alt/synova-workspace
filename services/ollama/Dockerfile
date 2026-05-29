FROM ollama/ollama:latest

EXPOSE 11434

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
  CMD curl -f http://localhost:11434/ || exit 1

CMD ["serve"]
