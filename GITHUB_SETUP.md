
# GitHub Setup & Deployment Guide

## Step 1: Initialize Git Repository (if not already done)

```bash
cd /home/ubuntu/manufacturer_intelligence_interface
git init
git add .
git commit -m "Initial commit: Manufacturer Intelligence Interface"
```

## Step 2: Create GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the "+" icon in the top right → "New repository"
3. Fill in:
   - **Repository name**: `manufacturer-intelligence`
   - **Description**: "Web interface for Abacus.AI manufacturer and product intelligence pipelines"
   - **Visibility**: Private (recommended) or Public
   - **DO NOT** initialize with README (we already have one)
4. Click "Create repository"

## Step 3: Push to GitHub

```bash
cd /home/ubuntu/manufacturer_intelligence_interface

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/manufacturer-intelligence.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### If you need to authenticate:

**Option A: Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token
5. When pushing, use the token as your password

**Option B: SSH Key**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Paste the public key

# Change remote to SSH
git remote set-url origin git@github.com:YOUR_USERNAME/manufacturer-intelligence.git
```

## Step 4: Configure GitHub Secrets

For the GitHub Actions workflow to work:

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add these secrets:

   **Secret 1:**
   - Name: `ABACUS_API_KEY`
   - Value: `2802fae65af84b98883a39078c3929dd`

   **Secret 2:**
   - Name: `ABACUSAI_API_KEY`
   - Value: `2802fae65af84b98883a39078c3929dd`

## Step 5: Verify GitHub Actions

1. Go to your repository → "Actions" tab
2. You should see the "Deploy Manufacturer Intelligence Interface" workflow
3. It will run automatically on pushes to `main` branch

## Step 6: Deploy to Vercel (Easiest Option)

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web` (or `nextjs_space` if using that structure)
   - **Build Command**: `yarn build`
   - **Output Directory**: `.next`
5. Add Environment Variables:
   - `ABACUS_API_KEY` = `2802fae65af84b98883a39078c3929dd`
   - `ABACUSAI_API_KEY` = `2802fae65af84b98883a39078c3929dd`
6. Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /home/ubuntu/manufacturer_intelligence_interface/apps/web
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: manufacturer-intelligence
# - Directory: ./
# - Override settings? No

# Add environment variables in Vercel dashboard
# Then deploy to production:
vercel --prod
```

## Step 7: Alternative Deployment Options

### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd /home/ubuntu/manufacturer_intelligence_interface/apps/web
netlify deploy

# Follow prompts and add environment variables in Netlify dashboard
```

### Docker

```bash
cd /home/ubuntu/manufacturer_intelligence_interface/apps/web

# Build Docker image
docker build -t manufacturer-intelligence .

# Run locally
docker run -p 3000:3000 \
  -e ABACUS_API_KEY=2802fae65af84b98883a39078c3929dd \
  -e ABACUSAI_API_KEY=2802fae65af84b98883a39078c3929dd \
  manufacturer-intelligence

# Push to Docker Hub (optional)
docker tag manufacturer-intelligence your-username/manufacturer-intelligence:latest
docker push your-username/manufacturer-intelligence:latest
```

## Common Issues & Solutions

### Issue: "Permission denied (publickey)"
**Solution**: Set up SSH key or use Personal Access Token

### Issue: "Build fails on Vercel"
**Solution**: 
- Verify Root Directory is set correctly
- Check that environment variables are added
- Review build logs for specific errors

### Issue: "API Key not working"
**Solution**:
- Double-check the API key value in environment variables
- Ensure there are no extra spaces
- Restart the application after adding environment variables

### Issue: "Module not found"
**Solution**:
```bash
cd /home/ubuntu/manufacturer_intelligence_interface/apps/web
yarn install
yarn build
```

## Continuous Deployment

Once set up, your deployment will automatically update:
- **Vercel**: Automatically deploys on every push to `main`
- **Netlify**: Automatically deploys on every push to `main`
- **GitHub Actions**: Runs workflow on every push

## Monitoring Your Deployment

- **Vercel**: Check deployment status at vercel.com/dashboard
- **Netlify**: Check deployment status at netlify.com/sites
- **GitHub Actions**: Check workflow runs in the "Actions" tab

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Add GitHub Secrets
3. ✅ Deploy to Vercel/Netlify
4. ✅ Verify deployment works
5. ✅ Test API integration
6. ✅ Share deployment URL with team

---

**Your Application URL** will be:
- Vercel: `https://manufacturer-intelligence-xyz.vercel.app`
- Netlify: `https://manufacturer-intelligence-xyz.netlify.app`
- Custom domain: Configure in platform settings

---

Need help? Check:
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
