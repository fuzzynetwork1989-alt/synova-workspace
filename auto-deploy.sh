#!/bin/bash
# Synova AI v4.1 - Auto-Update & Deploy Script
# Ensures all tools are updated before deployment

set -e

echo "🔄 Synova AI v4.1 - Auto-Update & Deploy"
echo "=========================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Update all deployment tools
update_tools() {
    print_info "Updating deployment tools..."
    
    echo "📦 Updating Railway CLI..."
    if npm update -g @railway/cli; then
        print_status "Railway CLI updated"
    else
        print_warning "Railway CLI update failed, continuing..."
    fi
    
    echo "📦 Updating Vercel CLI..."
    if npm update -g vercel; then
        print_status "Vercel CLI updated"
    else
        print_warning "Vercel CLI update failed, continuing..."
    fi
    
    echo "📦 Updating EAS CLI..."
    if npm update -g @expo/eas-cli; then
        print_status "EAS CLI updated"
    else
        print_warning "EAS CLI update failed, continuing..."
    fi
    
    # Verify versions
    echo ""
    print_info "Current tool versions:"
    echo "   Railway: $(railway --version 2>/dev/null || echo 'Not installed')"
    echo "   Vercel: $(vercel --version 2>/dev/null || echo 'Not installed')"
    echo "   EAS: $(eas --version 2>/dev/null || echo 'Not installed')"
    echo ""
}

# Deploy backend services to Railway
deploy_backend() {
    print_info "Deploying backend services to Railway..."
    
    # Check if logged in to Railway
    if ! railway whoami >/dev/null 2>&1; then
        print_error "Not logged in to Railway. Please run: railway login"
        exit 1
    fi
    
    echo "🏗️ Deploying Core API..."
    cd synova-core-api
    if railway up --service-name synova-core-api; then
        print_status "Core API deployed successfully"
        CORE_API_URL=$(railway domain --service synova-core-api 2>/dev/null)
        echo "   🌐 URL: $CORE_API_URL"
    else
        print_error "Core API deployment failed"
    fi
    cd ..
    
    echo "🎨 Deploying Holo Renderer..."
    cd synova-holo-renderer
    if railway up --service-name synova-holo-renderer; then
        print_status "Holo Renderer deployed successfully"
        RENDERER_URL=$(railway domain --service synova-holo-renderer 2>/dev/null)
        echo "   🌐 URL: $RENDERER_URL"
    else
        print_error "Holo Renderer deployment failed"
    fi
    cd ..
    
    # Export URLs for frontend deployment
    if [[ ! -z "$CORE_API_URL" ]]; then
        export NEXT_PUBLIC_API_URL="$CORE_API_URL"
        export NEXT_PUBLIC_RENDERER_URL="$RENDERER_URL"
        export NEXT_PUBLIC_WS_URL="${CORE_API_URL/https/http}/ws"
    fi
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_info "Deploying frontend to Vercel..."
    
    # Check if logged in to Vercel
    if ! vercel whoami >/dev/null 2>&1; then
        print_error "Not logged in to Vercel. Please run: vercel login"
        exit 1
    fi
    
    cd synova-ui-system
    
    # Update environment variables for production
    if [[ ! -z "$NEXT_PUBLIC_API_URL" ]]; then
        print_info "Updating frontend environment variables..."
        echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL" > .env.production
        echo "NEXT_PUBLIC_RENDERER_URL=$NEXT_PUBLIC_RENDERER_URL" >> .env.production
        echo "NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL" >> .env.production
    fi
    
    echo "🚀 Deploying UI System..."
    if vercel --prod; then
        print_status "Frontend deployed successfully"
        FRONTEND_URL=$(vercel ls 2>/dev/null | grep -m1 -o 'https://[^[:space:]]*\.vercel\.app')
        echo "   🌐 URL: $FRONTEND_URL"
    else
        print_error "Frontend deployment failed"
    fi
    
    cd ..
}

# Build and deploy mobile app
deploy_mobile() {
    print_info "Building and deploying mobile app..."
    
    # Check if logged in to EAS
    if ! eas whoami >/dev/null 2>&1; then
        print_error "Not logged in to EAS. Please run: eas login"
        exit 1
    fi
    
    cd synova-xr-workspace
    
    echo "📱 Building Android APK..."
    if eas build --platform android --profile production; then
        print_status "Android APK built successfully"
    else
        print_error "Android build failed"
    fi
    
    echo "📱 Building iOS IPA..."
    if eas build --platform ios --profile production; then
        print_status "iOS IPA built successfully"
    else
        print_error "iOS build failed"
    fi
    
    echo "📤 Submitting to app stores..."
    if eas submit --platform all --profile production; then
        print_status "Mobile apps submitted to stores"
    else
        print_warning "Mobile submission failed (may need manual upload)"
    fi
    
    cd ..
}

# Run health checks
health_checks() {
    print_info "Running health checks..."
    
    # Check backend services
    if [[ ! -z "$CORE_API_URL" ]]; then
        if curl -f "$CORE_API_URL/health" >/dev/null 2>&1; then
            print_status "Core API health check passed"
        else
            print_warning "Core API health check failed"
        fi
    fi
    
    if [[ ! -z "$RENDERER_URL" ]]; then
        if curl -f "$RENDERER_URL" >/dev/null 2>&1; then
            print_status "Holo Renderer health check passed"
        else
            print_warning "Holo Renderer health check failed"
        fi
    fi
    
    # Check frontend
    if [[ ! -z "$FRONTEND_URL" ]]; then
        if curl -f "$FRONTEND_URL" >/dev/null 2>&1; then
            print_status "Frontend health check passed"
        else
            print_warning "Frontend health check failed"
        fi
    fi
}

# Main deployment flow
main() {
    echo "🎯 Starting standard deployment flow..."
    echo ""
    
    # Step 1: Update tools
    update_tools
    
    # Step 2: Deploy backend (Railway)
    deploy_backend
    
    # Step 3: Deploy frontend (Vercel)
    deploy_frontend
    
    # Step 4: Build mobile (EAS)
    deploy_mobile
    
    # Step 5: Health checks
    health_checks
    
    echo ""
    print_status "Deployment process completed!"
    echo ""
    echo "🌐 Service URLs:"
    echo "   Backend API: $CORE_API_URL"
    echo "   Holo Renderer: $RENDERER_URL"
    echo "   Frontend: $FRONTEND_URL"
    echo ""
    echo "📊 Next Steps:"
    echo "   1. Monitor service health"
    echo "   2. Configure custom domains"
    echo "   3. Set up analytics"
    echo "   4. Test end-to-end functionality"
}

# Run main function
main "$@"
