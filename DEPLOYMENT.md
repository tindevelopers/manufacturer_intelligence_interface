
# Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd /home/ubuntu/manufacturer_intelligence_interface/apps/web
   vercel
   ```

4. **Add Environment Variables in Vercel Dashboard**:
   - Go to your project settings
   - Add `ABACUS_API_KEY` and `ABACUSAI_API_KEY`
   - Redeploy

5. **Setup Continuous Deployment**:
   ```bash
   vercel --prod
   ```
   - Link to your GitHub repository
   - Vercel will auto-deploy on every push to main

---

### Option 2: GitHub + Vercel Integration

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure:
     - Framework Preset: Next.js
     - Root Directory: `apps/web`
     - Build Command: `yarn build`
     - Output Directory: `.next`

3. **Add Environment Variables**:
   - In Vercel dashboard → Settings → Environment Variables
   - Add `ABACUS_API_KEY` and `ABACUSAI_API_KEY`

---

### Option 3: Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   cd /home/ubuntu/manufacturer_intelligence_interface/apps/web
   netlify deploy --prod
   ```

4. **Add Environment Variables**:
   - Netlify dashboard → Site settings → Environment variables

---

### Option 4: Docker Deployment

1. **Create Dockerfile** (already included in apps/web/):
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Dependencies
   FROM base AS deps
   WORKDIR /app
   COPY package.json yarn.lock ./
   RUN yarn install --frozen-lockfile
   
   # Builder
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN yarn build
   
   # Runner
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. **Build and Run**:
   ```bash
   cd /home/ubuntu/manufacturer_intelligence_interface/apps/web
   docker build -t manufacturer-intelligence .
   docker run -p 3000:3000 -e ABACUS_API_KEY=your_key manufacturer-intelligence
   ```

---

### Option 5: AWS Amplify

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Setup in AWS Console**:
   - Go to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Configure:
     - Build settings will auto-detect Next.js
     - Set Root Directory: `apps/web`
   
3. **Add Environment Variables**:
   - In Amplify Console → App settings → Environment variables
   - Add `ABACUS_API_KEY` and `ABACUSAI_API_KEY`

---

## GitHub Setup

### Push to GitHub

```bash
cd /home/ubuntu/manufacturer_intelligence_interface

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Manufacturer Intelligence Interface"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/manufacturer-intelligence.git

# Push to GitHub
git push -u origin main
```

### Add GitHub Secrets

For the GitHub Actions workflow to work:

1. Go to your repository on GitHub
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add:
   - `ABACUS_API_KEY`: Your Abacus.AI API key
   - `ABACUSAI_API_KEY`: Your Abacus.AI API key

---

## Environment Variables

Make sure these are set in your deployment platform:

```env
ABACUS_API_KEY=2802fae65af84b98883a39078c3929dd
ABACUSAI_API_KEY=2802fae65af84b98883a39078c3929dd
```

⚠️ **Important**: Never commit `.env` files to GitHub. They are already in `.gitignore`.

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Dashboard displays pipeline data
- [ ] Search and filtering work
- [ ] No console errors
- [ ] API key is working (no "Failed to Load Dashboard" errors)
- [ ] Mobile responsiveness is good
- [ ] All navigation links work

---

## Troubleshooting

### Issue: "Failed to Load Dashboard"
- Check that environment variables are set correctly
- Verify API key is valid
- Check application logs for specific errors

### Issue: Build Fails
- Ensure Node.js version is >= 18.0.0
- Run `yarn install` to update dependencies
- Check for TypeScript errors: `yarn lint`

### Issue: API Errors
- Verify pipeline IDs are correct
- Check Abacus.AI API documentation
- Ensure API key has necessary permissions

---

## Need Help?

Refer to platform-specific documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com)
- [AWS Amplify Docs](https://docs.amplify.aws)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
