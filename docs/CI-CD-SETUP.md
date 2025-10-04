# CI/CD Setup Guide

This document provides instructions for setting up the CI/CD pipeline for the Manufacturer Intelligence Interface project.

## Overview

The project includes:
- **GitHub Actions CI/CD Pipeline** - Automated testing, building, and deployment
- **Vercel Integration** - Automatic deployments to Vercel
- **Manual Deployment Scripts** - For local deployments and testing

## GitHub Secrets Configuration

To enable the CI/CD pipeline, you need to configure the following secrets in your GitHub repository:

### Required Secrets

1. **VERCEL_TOKEN**
   - Description: Vercel API token for deployment
   - How to get: Go to [Vercel Dashboard](https://vercel.com/account/tokens) → Create Token
   - Required for: Vercel deployments

2. **VERCEL_ORG_ID**
   - Description: Vercel organization ID
   - How to get: Run `vercel whoami` or check Vercel dashboard URL
   - Required for: Vercel deployments

3. **VERCEL_PROJECT_ID**
   - Description: Vercel project ID
   - How to get: Run `vercel link` in your project or check Vercel dashboard
   - Required for: Vercel deployments

4. **ABACUS_API_KEY**
   - Description: API key for Abacus service
   - How to get: From your Abacus service provider
   - Required for: Application functionality

5. **ABACUSAI_API_KEY**
   - Description: API key for AbacusAI service
   - How to get: From your AbacusAI service provider
   - Required for: Application functionality

### Setting Up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the exact name and value

## Workflow Triggers

The CI/CD pipeline is triggered by:

- **Push to master/main branch** - Full deployment
- **Pull requests** - Testing and validation only
- **Manual workflow dispatch** - On-demand deployment

## Workflow Jobs

### 1. Test & Lint Job
- Runs on: All triggers
- Steps:
  - Checkout code
  - Setup Node.js 18
  - Install dependencies
  - Type checking
  - Linting
  - Build application
  - Run tests

### 2. Deploy Job
- Runs on: Push to master/main, manual trigger
- Depends on: Test job success
- Steps:
  - Checkout code
  - Setup Node.js 18
  - Install dependencies
  - Build application
  - Deploy to Vercel

### 3. Security Scan Job
- Runs on: Pull requests only
- Steps:
  - Vulnerability scanning with Trivy
  - Upload results to GitHub Security tab

## Manual Deployment

You can deploy manually using the provided script:

```bash
# Full deployment (build, test, deploy to Vercel, push to GitHub)
yarn deploy

# Deploy only to Vercel (skip GitHub push)
yarn deploy:vercel

# Push only to GitHub (skip Vercel deployment)
yarn deploy:github

# Deploy with custom options
./scripts/deploy.sh --skip-tests --skip-lint
```

### Deployment Script Options

- `--skip-tests` - Skip running tests
- `--skip-lint` - Skip running linting
- `--skip-build` - Skip building the application
- `--skip-vercel` - Skip Vercel deployment
- `--skip-github` - Skip pushing to GitHub
- `--help` - Show help message

## Vercel Configuration

The project includes a `vercel.json` configuration file with:

- Build settings
- Environment variables
- Function runtime configuration
- Deployment settings

### Environment Variables in Vercel

Make sure to set the following environment variables in your Vercel project:

1. `ABACUS_API_KEY` - Your Abacus API key
2. `ABACUSAI_API_KEY` - Your AbacusAI API key

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check if all environment variables are set
   - Verify Node.js version compatibility
   - Check for TypeScript errors

2. **Deployment Failures**
   - Verify Vercel secrets are correctly set
   - Check Vercel project configuration
   - Ensure API keys are valid

3. **Test Failures**
   - Check test configuration
   - Verify test dependencies are installed
   - Review test output for specific errors

### Debugging

1. **Check GitHub Actions logs**
   - Go to Actions tab in GitHub
   - Click on failed workflow
   - Review step-by-step logs

2. **Local testing**
   - Run `yarn ci` to test the CI pipeline locally
   - Use `yarn deploy:vercel` to test Vercel deployment
   - Check build output with `yarn build`

## Best Practices

1. **Branch Protection**
   - Enable branch protection on master/main
   - Require status checks to pass
   - Require pull request reviews

2. **Environment Management**
   - Use different Vercel projects for staging/production
   - Keep secrets secure and rotate regularly
   - Use environment-specific configurations

3. **Monitoring**
   - Monitor deployment status
   - Set up alerts for failed deployments
   - Review security scan results

## Support

For issues with the CI/CD pipeline:

1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Verify all secrets are correctly configured
4. Test deployment locally using the provided scripts
