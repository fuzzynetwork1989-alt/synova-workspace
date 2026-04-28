FROM ollama/ollama:latest

# Expose Ollama port
EXPOSE 11434

# Start Ollama server (override ENTRYPOINT to avoid double "ollama" command)
ENTRYPOINT []
CMD ["sh", "-c", "OLLAMA_HOST=0.0.0.0:${PORT:-11434} exec ollama serve"]
