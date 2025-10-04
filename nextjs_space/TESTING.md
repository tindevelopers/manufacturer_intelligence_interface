# Testing Guide

This guide explains how to test the Manufacturer Intelligence Interface application with seed data and mock pipelines.

## Quick Start - Testing Locally

### 1. Seed the Database

Populate the database with sample manufacturers, products, and search history:

```bash
cd nextjs_space
yarn prisma db seed
```

This will create:
- **5 Manufacturers** (TechCorp Industries, AutoParts Manufacturing, GreenHome Solutions, MediSupply Corp, FashionWorks)
- **7 Products** across different categories (Electronics, Automotive, Fashion)
- **3 Search History** records

### 2. Start the Development Server

```bash
yarn dev
```

The app will be available at `http://localhost:3000`

### 3. Explore the Features

#### Dashboard (/)
- View pipeline statistics and execution history
- See mock data for Manufacturer Discovery and Product Intelligence pipelines
- Click on pipeline cards to navigate to detailed views

#### Manufacturers (/manufacturers)
- Browse all manufacturers with filtering options
- Add new manufacturers
- View manufacturer details
- Extract products from manufacturers (triggers mock pipeline)

#### Products (/products)
- Browse all products
- Filter by manufacturer, category, availability
- Search products by name or SKU

## Mock Pipeline Data

The application currently uses **mock pipeline data** for testing purposes:

### Pipeline IDs (Mock)
- **Manufacturer Discovery Pipeline**: `fd507c760`
- **Product Intelligence Pipeline**: `1398624bb0`

### Mock Execution Data
The pipelines API returns realistic execution history including:
- Execution status (COMPLETE, RUNNING, FAILED)
- Start/completion timestamps
- Records processed count
- Success rates

## Testing Product Extraction

1. Navigate to Manufacturers page
2. Click "Extract Products" on any manufacturer
3. Confirm the extraction
4. The system will create sample products linked to that manufacturer

Note: In the current setup, extraction creates mock sample products. To connect to real Abacus.AI pipelines, see the Production Setup section.

## Database Operations

### Reset Database
Clear all data and reseed:

```bash
yarn prisma migrate reset
```

This will:
1. Drop all tables
2. Re-run migrations
3. Automatically run the seed script

### View Database in Prisma Studio

```bash
yarn prisma studio
```

Access the database GUI at `http://localhost:5555`

## Production Setup

### Connect Real Abacus.AI Pipelines

To use actual Abacus.AI pipelines instead of mock data:

1. **Update Pipeline IDs** in `/app/api/pipelines/route.ts`:
   ```typescript
   const MANUFACTURER_PIPELINE_ID = 'your_actual_pipeline_id';
   const PRODUCT_PIPELINE_ID = 'your_actual_pipeline_id';
   ```

2. **Remove Mock Data Logic**:
   - In `/app/api/pipelines/route.ts`, replace the mock data with actual API calls
   - In `/app/api/pipelines/[pipelineId]/route.ts`, implement real API integration

3. **Configure API Key**:
   Make sure `ABACUSAI_API_KEY` is set in your environment variables (`.env.local` for local, Vercel Environment Variables for production)

4. **Update Extraction Logic**:
   In `/app/api/manufacturers/[id]/extract/route.ts`, update the pipeline execution logic to use your actual pipeline endpoints

## Environment Variables

Required for production:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
ABACUSAI_API_KEY="your-api-key"
```

## Deployment to Vercel

The application is configured for Vercel deployment:

1. Root Directory: `nextjs_space`
2. Build Command: `next build` (automatic)
3. Environment Variables: Set in Vercel dashboard

On deployment, the seed script will NOT run automatically. To seed production database:

```bash
# Connect to production database
DATABASE_URL="your_production_db_url" yarn prisma db seed
```

Or create a custom script to run after deployment.

## Troubleshooting

### Seed Script Fails
- Check that `DATABASE_URL` is correctly set
- Ensure migrations are up to date: `yarn prisma migrate deploy`
- Clear existing data: `yarn prisma migrate reset`

### Products Not Showing
- Run seed script: `yarn prisma db seed`
- Check database connection
- Verify Prisma client is generated: `yarn prisma generate`

### Pipeline Errors
- Current setup uses mock data and should not fail
- For production with real pipelines, verify `ABACUSAI_API_KEY` is set
- Check API connectivity and pipeline IDs

## Sample Test Data

### Manufacturers
- **TechCorp Industries** (Electronics) - 3 products, extraction completed
- **AutoParts Manufacturing** (Automotive) - 2 products, extraction completed  
- **FashionWorks** (Apparel) - 2 products, extraction completed
- **GreenHome Solutions** (Home & Garden) - 0 products, pending extraction
- **MediSupply Corp** (Medical Equipment) - 0 products, extraction in progress

### Products Examples
- SmartPhone Pro X ($899.99)
- Wireless Earbuds Elite ($199.99)
- Premium Brake Pad Set ($89.99)
- Classic Denim Jacket ($79.99)

## Next Steps

1. ✅ Seed the database
2. ✅ Test all features locally
3. ⏳ Configure real Abacus.AI pipelines (optional)
4. ⏳ Deploy to Vercel
5. ⏳ Seed production database

For questions or issues, contact support or check the main README.md.
