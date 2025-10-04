
# Push to GitHub Instructions

Your project is ready to be pushed to GitHub! Follow these steps:

## Option 1: Using GitHub CLI (Recommended)

```bash
# Install GitHub CLI if not already installed
# Visit: https://cli.github.com/

# Login to GitHub
gh auth login

# Push to GitHub
cd /home/ubuntu/manufacturer_intelligence_interface
git push -u origin master
```

## Option 2: Using Personal Access Token

1. **Create a Personal Access Token**
   - Go to: https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control of private repositories)
   - Copy the token

2. **Push with Token**
```bash
cd /home/ubuntu/manufacturer_intelligence_interface

# Use this format: https://YOUR_TOKEN@github.com/tindevelopers/manufacturer_intelligence_interface.git
git remote set-url origin https://YOUR_TOKEN@github.com/tindevelopers/manufacturer_intelligence_interface.git
git push -u origin master
```

## Option 3: Using SSH (If you have SSH keys set up)

```bash
cd /home/ubuntu/manufacturer_intelligence_interface

# Change remote to SSH
git remote set-url origin git@github.com:tindevelopers/manufacturer_intelligence_interface.git
git push -u origin master
```

## Verify Your Push

After pushing, visit:
https://github.com/tindevelopers/manufacturer_intelligence_interface

## Next Steps After Pushing

1. **Set up GitHub Secrets** (for CI/CD)
   - Go to: https://github.com/tindevelopers/manufacturer_intelligence_interface/settings/secrets/actions
   - Add these secrets:
     - `ABACUSAI_API_KEY` - Your Abacus.AI API key
     - `VERCEL_TOKEN` - Your Vercel token (optional, for auto-deployment)

2. **Enable GitHub Actions**
   - The workflow is already configured in `.github/workflows/deploy.yml`
   - It will run automatically on push to master

3. **Deploy to Vercel** (Optional)
   - Visit: https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect the Turborepo setup
   - Add environment variables:
     - `ABACUSAI_API_KEY`

## Turborepo Commands

Once pushed, you can use these Turborepo commands:

```bash
# Build all apps
yarn turbo build

# Run all apps in development
yarn turbo dev

# Lint all apps
yarn turbo lint

# Run specific app
yarn workspace @manufacturer-intelligence/web dev
```

## Project Structure

```
manufacturer_intelligence_interface/
├── apps/
│   └── web/               # Main Next.js application
├── packages/
│   └── config/            # Shared configurations
├── .github/
│   └── workflows/
│       └── deploy.yml     # CI/CD pipeline
├── turbo.json             # Turborepo configuration
└── package.json           # Root package.json
```

## Troubleshooting

**Authentication Failed?**
- Make sure your token has `repo` permissions
- Check that the repository exists: https://github.com/tindevelopers/manufacturer_intelligence_interface

**Push Rejected?**
- If the repository already has commits, you may need to pull first:
  ```bash
  git pull origin master --allow-unrelated-histories
  git push -u origin master
  ```

**Need Help?**
- GitHub Authentication: https://docs.github.com/en/authentication
- Turborepo Docs: https://turbo.build/repo/docs
