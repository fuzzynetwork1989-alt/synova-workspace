#!/bin/bash
# Synova AI v4.1 Docker Management Script

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
check_docker() {
    if ! docker info >/dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker first."
        exit 1
    fi
}

# Create necessary directories
setup_directories() {
    log_info "Creating necessary directories..."
    
    mkdir -p data/{postgres,redis,ollama,models,api,prometheus,grafana,loki}
    mkdir -p logs/{nginx,api,renderer}
    mkdir -p nginx/ssl
    mkdir -p monitoring/{grafana/dashboards,grafana/datasources}
    
    log_success "Directories created"
}

# Generate environment file
generate_env() {
    if [[ ! -f ".env" ]]; then
        log_info "Generating .env file..."
        
        cat > .env << EOF
# Synova AI v4.1 Environment Configuration
# Generated on $(date)

# Database Configuration
POSTGRES_PASSWORD=synova_secure_$(date +%s)
DATABASE_URL=postgresql://synova_user:\${POSTGRES_PASSWORD}@synova-db:5432/synova_ai

# Redis Configuration
REDIS_PASSWORD=redis_secure_$(date +%s)
REDIS_URL=redis://:\${REDIS_PASSWORD}@synova-redis:6379

# API Configuration
SECRET_KEY=synova_secret_key_$(date +%s)_ultra_secure
ENVIRONMENT=production
LOG_LEVEL=INFO

# Monitoring
GRAFANA_PASSWORD=grafana_$(date +%s)

# External Services
RAILWAY_TOKEN=
EAS_PROJECT_ID=
EAS_TOKEN=
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=

# AI Configuration
OLLAMA_HOST=http://synova-brain:11434
SYNOVA_BRAIN_MODEL=synova-brain-v3.2

# SSL (for production)
SSL_CERT_PATH=./nginx/ssl/synova.crt
SSL_KEY_PATH=./nginx/ssl/synova.key
EOF
        
        log_success ".env file generated"
        log_warning "Please update the .env file with your actual tokens and passwords"
    else
        log_info ".env file already exists"
    fi
}

# Start services
start_services() {
    log_info "Starting Synova AI services..."
    
    # Start core services first
    docker-compose up -d synova-db synova-redis synova-brain
    
    log_info "Waiting for core services to be ready..."
    sleep 30
    
    # Start application services
    docker-compose up -d synova-core-api synova-holo-renderer synova-ui-system
    
    log_info "Waiting for application services to be ready..."
    sleep 30
    
    # Start monitoring and proxy
    docker-compose up -d synova-prometheus synova-grafana synova-loki synova-nginx
    
    log_success "All services started"
}

# Stop services
stop_services() {
    log_info "Stopping Synova AI services..."
    docker-compose down
    log_success "All services stopped"
}

# Restart services
restart_services() {
    log_info "Restarting Synova AI services..."
    docker-compose restart
    log_success "All services restarted"
}

# Show status
show_status() {
    log_info "Synova AI Service Status:"
    echo ""
    
    docker-compose ps
    
    echo ""
    log_info "Service URLs:"
    echo "   🌐 Frontend: http://localhost"
    echo "   🔧 API: http://localhost/api"
    echo "   📊 API Docs: http://localhost/docs"
    echo "   🏗️  Renderer: http://localhost/renderer"
    echo "   📈 Prometheus: http://localhost:9090"
    echo "   📊 Grafana: http://localhost:9000"
    echo "   🗄️  Adminer: http://localhost:8080"
    echo "   💾 Redis Commander: http://localhost:8081"
}

# Show logs
show_logs() {
    local service=${1:-}
    
    if [[ -z "$service" ]]; then
        log_info "Showing logs for all services..."
        docker-compose logs -f --tail=100
    else
        log_info "Showing logs for $service..."
        docker-compose logs -f --tail=100 "$service"
    fi
}

# Backup data
backup_data() {
    local backup_dir="backups/$(date +%Y%m%d_%H%M%S)"
    
    log_info "Creating backup in $backup_dir..."
    
    mkdir -p "$backup_dir"
    
    # Backup databases
    docker-compose exec synova-db pg_dump -U synova_user synova_ai > "$backup_dir/postgres.sql"
    
    # Backup Redis
    docker-compose exec synova-redis redis-cli --rdb - > "$backup_dir/redis.rdb"
    
    # Backup Ollama models
    docker cp synova-brain:/root/.ollama "$backup_dir/ollama"
    
    # Backup configuration files
    cp .env "$backup_dir/"
    cp docker-compose.yml "$backup_dir/"
    
    log_success "Backup completed: $backup_dir"
}

# Restore data
restore_data() {
    local backup_dir=${1:-}
    
    if [[ -z "$backup_dir" ]]; then
        log_error "Please specify backup directory"
        exit 1
    fi
    
    if [[ ! -d "$backup_dir" ]]; then
        log_error "Backup directory not found: $backup_dir"
        exit 1
    fi
    
    log_warning "This will overwrite existing data. Are you sure? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        log_info "Restore cancelled"
        exit 0
    fi
    
    log_info "Restoring from $backup_dir..."
    
    # Stop services
    docker-compose down
    
    # Restore databases
    docker-compose up -d synova-db
    sleep 10
    docker-compose exec -T synova-db psql -U synova_user synova_ai < "$backup_dir/postgres.sql"
    
    # Restore Redis
    docker-compose up -d synova-redis
    sleep 5
    docker cp "$backup_dir/redis.rdb" synova-redis:/data/dump.rdb
    docker-compose restart synova-redis
    
    # Restore Ollama models
    docker-compose up -d synova-brain
    sleep 10
    docker cp "$backup_dir/ollama" synova-brain:/root/.ollama
    docker-compose restart synova-brain
    
    # Start all services
    start_services
    
    log_success "Restore completed"
}

# Update services
update_services() {
    log_info "Updating Synova AI services..."
    
    # Pull latest images
    docker-compose pull
    
    # Restart with new images
    docker-compose up -d --force-recreate
    
    log_success "Services updated"
}

# Cleanup
cleanup() {
    log_info "Cleaning up unused Docker resources..."
    
    docker system prune -f
    docker volume prune -f
    
    log_success "Cleanup completed"
}

# Install models
install_models() {
    log_info "Installing AI models..."
    
    # Wait for Ollama to be ready
    log_info "Waiting for Ollama to start..."
    until docker-compose exec synova-brain ollama list >/dev/null 2>&1; do
        sleep 5
    done
    
    # Install base models
    docker-compose exec synova-brain ollama pull llama3.2
    docker-compose exec synova-brain ollama pull codellama
    
    # Install custom Synova Brain if available
    if [[ -f "synova-brain/Modelfile" ]]; then
        log_info "Installing custom Synova Brain model..."
        docker cp synova-brain/Modelfile synova-brain:/tmp/
        docker-compose exec synova-brain ollama create synova-brain -f /tmp/Modelfile
    fi
    
    log_success "AI models installed"
}

# Health check
health_check() {
    log_info "Performing health check..."
    
    services=(
        "synova-db:5432"
        "synova-redis:6379"
        "synova-brain:11434"
        "synova-core-api:8000"
        "synova-holo-renderer:3001"
        "synova-ui-system:3000"
    )
    
    for service in "${services[@]}"; do
        IFS=':' read -r name port <<< "$service"
        
        if docker-compose exec "$name" curl -f "http://localhost:$port/health" >/dev/null 2>&1; then
            log_success "$name: Healthy"
        else
            log_error "$name: Unhealthy"
        fi
    done
}

# Main menu
show_menu() {
    echo ""
    echo "🚀 Synova AI v4.1 Docker Management"
    echo "===================================="
    echo "1) Start services"
    echo "2) Stop services"
    echo "3) Restart services"
    echo "4) Show status"
    echo "5) Show logs"
    echo "6) Backup data"
    echo "7) Restore data"
    echo "8) Update services"
    echo "9) Cleanup"
    echo "10) Install AI models"
    echo "11) Health check"
    echo "12) Exit"
    echo ""
}

# Main execution
main() {
    check_docker
    
    case "${1:-}" in
        "start")
            setup_directories
            generate_env
            start_services
            show_status
            ;;
        "stop")
            stop_services
            ;;
        "restart")
            restart_services
            ;;
        "status")
            show_status
            ;;
        "logs")
            show_logs "${2:-}"
            ;;
        "backup")
            backup_data
            ;;
        "restore")
            restore_data "${2:-}"
            ;;
        "update")
            update_services
            ;;
        "cleanup")
            cleanup
            ;;
        "install-models")
            install_models
            ;;
        "health")
            health_check
            ;;
        "setup")
            setup_directories
            generate_env
            ;;
        *)
            while true; do
                show_menu
                read -p "Select an option: " choice
                
                case $choice in
                    1) main "start" ;;
                    2) main "stop" ;;
                    3) main "restart" ;;
                    4) main "status" ;;
                    5) 
                        read -p "Enter service name (or leave empty for all): " service
                        main "logs" "$service"
                        ;;
                    6) main "backup" ;;
                    7) 
                        read -p "Enter backup directory: " backup_dir
                        main "restore" "$backup_dir"
                        ;;
                    8) main "update" ;;
                    9) main "cleanup" ;;
                    10) main "install-models" ;;
                    11) main "health" ;;
                    12) exit 0 ;;
                    *) log_error "Invalid option" ;;
                esac
                
                echo ""
                read -p "Press Enter to continue..."
            done
            ;;
    esac
}

# Run main function with all arguments
main "$@"
