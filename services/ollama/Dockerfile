FROM ollama/ollama:latest

# Expose Ollama port
EXPOSE 11434

# Start Ollama server with Railway's PORT variable
CMD sh -c "OLLAMA_HOST=0.0.0.0:${PORT:-11434} ollama serve"
