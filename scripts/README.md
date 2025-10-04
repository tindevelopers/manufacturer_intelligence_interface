# Scripts Directory

This directory contains utility scripts for the Manufacturer Intelligence Interface project.

## Available Scripts

### `deploy.sh`
Comprehensive deployment script that handles building, testing, and deploying the application.

**Usage:**
```bash
# Full deployment
./scripts/deploy.sh

# Deploy with options
./scripts/deploy.sh --skip-tests --skip-lint
```

**Options:**
- `--skip-tests` - Skip running tests
- `--skip-lint` - Skip running linting
- `--skip-build` - Skip building the application
- `--skip-vercel` - Skip Vercel deployment
- `--skip-github` - Skip pushing to GitHub
- `--help` - Show help message

### `push-to-github.sh`
Simple script to commit and push changes to GitHub.

**Usage:**
```bash
# Auto-commit and push
./scripts/push-to-github.sh

# Commit with custom message
./scripts/push-to-github.sh -m "Fix bug in API"

# Push to specific branch
./scripts/push-to-github.sh -b develop -m "Add new feature"
```

**Options:**
- `-m, --message MSG` - Commit message
- `-b, --branch BRANCH` - Target branch
- `-f, --force` - Force push (use with caution)
- `-h, --help` - Show help message

## Package.json Scripts

You can also use these scripts via yarn/npm:

```bash
# Deployment
yarn deploy              # Full deployment
yarn deploy:vercel       # Deploy only to Vercel
yarn deploy:github       # Push only to GitHub

# Git operations
yarn push                # Push to GitHub

# CI operations
yarn ci                  # Run CI pipeline locally
```

## Prerequisites

- Node.js 18 or later
- Yarn package manager
- Git
- Vercel CLI (for deployments)

## Environment Variables

Make sure to set the following environment variables:

- `ABACUS_API_KEY` - Your Abacus API key
- `ABACUSAI_API_KEY` - Your AbacusAI API key

For Vercel deployments, you'll also need:
- Vercel account and project setup
- Vercel CLI installed and authenticated
