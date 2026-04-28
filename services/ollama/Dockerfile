FROM ollama/ollama:latest

# Expose Ollama port
EXPOSE 11434

# Start Ollama server (override ENTRYPOINT to avoid double "ollama" command)
ENTRYPOINT ["ollama", "serve"]
