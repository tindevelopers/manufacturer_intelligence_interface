# Deployment Setup Guide

This guide explains how to deploy the Manufacturer Intelligence Interface using GitHub Actions and Vercel.

## Configuration Files Moved to Root

Following Vercel best practices for monorepos, all configuration files have been moved to the root directory:

- `next.config.js` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration  
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui configuration
- `postcss.config.js` - PostCSS configuration
- `vercel.json` - Vercel deployment configuration

## GitHub Actions Setup

### Required Secrets

Add these secrets to your GitHub repository:

1. **VERCEL_TOKEN** - Your Vercel API token
   - Get from: https://vercel.com/account/tokens
   
2. **VERCEL_ORG_ID** - Your Vercel organization ID
   - Get from: https://vercel.com/account/settings
   
3. **VERCEL_PROJECT_ID** - Your Vercel project ID
   - Get from: Your project settings in Vercel dashboard
   
4. **ABACUS_API_KEY** - Your Abacus API key
   
5. **ABACUSAI_API_KEY** - Your AbacusAI API key

### Adding Secrets

1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret with the exact names listed above

## Vercel Setup

### Environment Variables

Add these environment variables in your Vercel project:

1. Go to your Vercel project dashboard
2. Click on "Settings" → "Environment Variables"
3. Add:
   - `ABACUS_API_KEY` = `@abacus_api_key`
   - `ABACUSAI_API_KEY` = `@abacusai_api_key`

### Project Configuration

The `vercel.json` file is configured for:
- Monorepo structure with apps in `apps/web/`
- Next.js framework
- Node.js 18.x runtime for API functions
- Environment variable mapping

## Deployment Process

1. **Push to main/master branch** triggers the CI/CD pipeline
2. **GitHub Actions** runs:
   - Code checkout
   - Dependency installation
   - Linting and type checking
   - Build process
   - Deployment to Vercel
3. **Vercel** automatically deploys the built application

## Local Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Start production server
yarn start
```

## Troubleshooting

### Build Issues
- Ensure all environment variables are set in both GitHub Secrets and Vercel
- Check that the build command works locally: `yarn build`

### Deployment Issues
- Verify Vercel project ID and organization ID are correct
- Check Vercel token has proper permissions
- Review GitHub Actions logs for specific error messages

### Configuration Issues
- Ensure all config files are in the root directory
- Verify paths in config files point to `apps/web/` structure
- Check that TypeScript paths are correctly mapped
