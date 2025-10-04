#!/bin/bash

# Deployment script for Manufacturer Intelligence Interface
# This script handles building, testing, and deploying the application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists node; then
        print_error "Node.js is not installed. Please install Node.js 18 or later."
        exit 1
    fi
    
    if ! command_exists yarn; then
        print_error "Yarn is not installed. Please install Yarn."
        exit 1
    fi
    
    if ! command_exists git; then
        print_error "Git is not installed. Please install Git."
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or later is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "All prerequisites are met"
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    if yarn test --passWithNoTests; then
        print_success "Tests passed"
    else
        print_warning "Some tests failed, but continuing with deployment"
    fi
}

# Function to run linting
run_linting() {
    print_status "Running linting..."
    
    if yarn lint; then
        print_success "Linting passed"
    else
        print_warning "Linting issues found, but continuing with deployment"
    fi
}

# Function to build the application
build_application() {
    print_status "Building application..."
    
    # Check if environment variables are set
    if [ -z "$ABACUS_API_KEY" ] || [ -z "$ABACUSAI_API_KEY" ]; then
        print_warning "API keys not found in environment variables"
        print_warning "Make sure to set ABACUS_API_KEY and ABACUSAI_API_KEY"
    fi
    
    if yarn build; then
        print_success "Application built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Function to deploy to Vercel
deploy_to_vercel() {
    print_status "Deploying to Vercel..."
    
    if ! command_exists vercel; then
        print_status "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    # Check if Vercel is logged in
    if ! vercel whoami >/dev/null 2>&1; then
        print_error "Not logged in to Vercel. Please run 'vercel login' first."
        exit 1
    fi
    
    # Deploy to Vercel
    if vercel --prod; then
        print_success "Deployed to Vercel successfully"
    else
        print_error "Vercel deployment failed"
        exit 1
    fi
}

# Function to push to GitHub
push_to_github() {
    print_status "Pushing changes to GitHub..."
    
    # Check if there are uncommitted changes
    if [ -n "$(git status --porcelain)" ]; then
        print_status "Committing changes..."
        git add .
        git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    # Push to current branch
    CURRENT_BRANCH=$(git branch --show-current)
    if git push origin "$CURRENT_BRANCH"; then
        print_success "Pushed to GitHub successfully"
    else
        print_error "Failed to push to GitHub"
        exit 1
    fi
}

# Main deployment function
main() {
    print_status "Starting deployment process..."
    
    # Parse command line arguments
    SKIP_TESTS=false
    SKIP_LINT=false
    SKIP_BUILD=false
    SKIP_VERCEL=false
    SKIP_GITHUB=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-tests)
                SKIP_TESTS=true
                shift
                ;;
            --skip-lint)
                SKIP_LINT=true
                shift
                ;;
            --skip-build)
                SKIP_BUILD=true
                shift
                ;;
            --skip-vercel)
                SKIP_VERCEL=true
                shift
                ;;
            --skip-github)
                SKIP_GITHUB=true
                shift
                ;;
            --help)
                echo "Usage: $0 [OPTIONS]"
                echo "Options:"
                echo "  --skip-tests     Skip running tests"
                echo "  --skip-lint      Skip running linting"
                echo "  --skip-build     Skip building the application"
                echo "  --skip-vercel    Skip Vercel deployment"
                echo "  --skip-github    Skip pushing to GitHub"
                echo "  --help           Show this help message"
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                exit 1
                ;;
        esac
    done
    
    # Run deployment steps
    check_prerequisites
    
    if [ "$SKIP_TESTS" = false ]; then
        run_tests
    fi
    
    if [ "$SKIP_LINT" = false ]; then
        run_linting
    fi
    
    if [ "$SKIP_BUILD" = false ]; then
        build_application
    fi
    
    if [ "$SKIP_VERCEL" = false ]; then
        deploy_to_vercel
    fi
    
    if [ "$SKIP_GITHUB" = false ]; then
        push_to_github
    fi
    
    print_success "Deployment completed successfully! 🚀"
}

# Run main function with all arguments
main "$@"
