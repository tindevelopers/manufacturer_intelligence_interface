#!/bin/bash

# Script to push latest code to GitHub
# This script handles committing and pushing changes to the repository

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

# Function to check if git is available
check_git() {
    if ! command -v git >/dev/null 2>&1; then
        print_error "Git is not installed. Please install Git first."
        exit 1
    fi
}

# Function to check if we're in a git repository
check_git_repo() {
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository. Please run this script from the project root."
        exit 1
    fi
}

# Function to check git status
check_status() {
    print_status "Checking git status..."
    
    # Check if there are any changes
    if [ -z "$(git status --porcelain)" ]; then
        print_warning "No changes to commit. Repository is clean."
        return 1
    fi
    
    # Show status
    git status --short
    return 0
}

# Function to add all changes
add_changes() {
    print_status "Adding all changes..."
    git add .
    print_success "Changes added to staging area"
}

# Function to commit changes
commit_changes() {
    local commit_message="$1"
    
    if [ -z "$commit_message" ]; then
        commit_message="Update: $(date '+%Y-%m-%d %H:%M:%S')"
    fi
    
    print_status "Committing changes with message: $commit_message"
    git commit -m "$commit_message"
    print_success "Changes committed successfully"
}

# Function to push to GitHub
push_to_github() {
    local branch="$1"
    
    if [ -z "$branch" ]; then
        branch=$(git branch --show-current)
    fi
    
    print_status "Pushing to GitHub (branch: $branch)..."
    
    # Check if remote exists
    if ! git remote get-url origin >/dev/null 2>&1; then
        print_error "No remote 'origin' found. Please add a remote repository."
        exit 1
    fi
    
    # Push to GitHub
    if git push origin "$branch"; then
        print_success "Successfully pushed to GitHub"
    else
        print_error "Failed to push to GitHub"
        exit 1
    fi
}

# Function to show help
show_help() {
    echo "Usage: $0 [OPTIONS] [COMMIT_MESSAGE]"
    echo ""
    echo "Options:"
    echo "  -b, --branch BRANCH    Specify branch to push to (default: current branch)"
    echo "  -m, --message MSG      Commit message (default: auto-generated)"
    echo "  -f, --force           Force push (use with caution)"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Auto-commit and push"
    echo "  $0 -m \"Fix bug in API\"              # Commit with custom message"
    echo "  $0 -b develop -m \"Add new feature\"  # Push to specific branch"
    echo "  $0 -f                                # Force push (dangerous)"
}

# Main function
main() {
    local commit_message=""
    local branch=""
    local force_push=false
    
    # Parse command line arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -m|--message)
                commit_message="$2"
                shift 2
                ;;
            -b|--branch)
                branch="$2"
                shift 2
                ;;
            -f|--force)
                force_push=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            -*)
                print_error "Unknown option: $1"
                show_help
                exit 1
                ;;
            *)
                if [ -z "$commit_message" ]; then
                    commit_message="$1"
                fi
                shift
                ;;
        esac
    done
    
    # Check prerequisites
    check_git
    check_git_repo
    
    # Check if there are changes to commit
    if ! check_status; then
        exit 0
    fi
    
    # Add changes
    add_changes
    
    # Commit changes
    commit_changes "$commit_message"
    
    # Push to GitHub
    if [ "$force_push" = true ]; then
        print_warning "Force pushing to GitHub..."
        git push --force origin "${branch:-$(git branch --show-current)}"
    else
        push_to_github "$branch"
    fi
    
    print_success "All done! 🚀"
}

# Run main function with all arguments
main "$@"
