
# Vercel Deployment Instructions

## Important: Root Directory Configuration

This Next.js application is located in the `nextjs_space` subdirectory. When deploying to Vercel, you **must** configure the Root Directory setting.

### Deployment Steps

1. **Import your GitHub repository** to Vercel
2. **Configure Root Directory**:
   - In the Vercel project settings, set **Root Directory** to: `nextjs_space`
   - OR use the vercel.json configuration at the project root

3. **Environment Variables**:
   Add these environment variables in Vercel project settings:
   - `DATABASE_URL` - Your PostgreSQL database connection string
   - `NEXTAUTH_SECRET` - Your NextAuth secret key
   - `NEXTAUTH_URL` - Your production URL (e.g., https://your-app.vercel.app)
   - `ABACUSAI_API_KEY` - Your Abacus.ai API key

4. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically detect Next.js and build your app

### Alternative: Manual Configuration

If you prefer not to use the Root Directory setting:

1. You can move all contents from `nextjs_space` to the root directory
2. Or keep the vercel.json file at the root (already created)

### Verify Deployment

After deployment, check that:
- ✓ The app loads correctly
- ✓ Database connections work
- ✓ Authentication flows function properly
- ✓ API routes respond as expected

---

For more help, visit: https://vercel.com/docs/concepts/projects/overview
