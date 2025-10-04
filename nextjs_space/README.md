
# Manufacturer Intelligence Interface

A modern web interface for querying and displaying data from Abacus.AI pipelines. This application provides easy access to manufacturer discovery and product intelligence data from your pipelines.

## Features

- 📊 **Dashboard Overview**: Monitor pipeline status and execution history
- 🏭 **Manufacturer Discovery**: Browse and search manufacturers from Pipeline fd507c760
- 📦 **Product Intelligence**: Explore products from Pipeline 1398624bb0
- 🔍 **Advanced Search & Filtering**: Filter by date, status, category, and more
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🎨 **Modern UI**: Clean and intuitive interface built with Next.js and Tailwind CSS

## Prerequisites

- Node.js 18+ and Yarn
- Abacus.AI API key ([Get yours here](https://abacus.ai/app/profile/apikey))

## Getting Started

### 1. Clone and Setup

```bash
cd /home/ubuntu/manufacturer_intelligence_interface/nextjs_space
```

### 2. Configure API Key

Create a `.env` file in the `nextjs_space` directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Abacus.AI API key:

```env
ABACUS_API_KEY=your_actual_api_key_here
```

**How to get your API key:**
1. Log in to [Abacus.AI](https://abacus.ai)
2. Navigate to your profile
3. Go to the API Keys section
4. Generate a new API key or copy an existing one

### 3. Install Dependencies

```bash
yarn install
```

### 4. Run the Development Server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
nextjs_space/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   └── pipelines/           # Pipeline endpoints
│   ├── manufacturers/           # Manufacturer pages
│   ├── products/                # Product pages
│   └── _components/             # Page-specific components
├── components/                   # Reusable components
│   ├── ui/                      # UI primitives
│   ├── navigation.tsx           # Main navigation
│   ├── search-bar.tsx           # Search component
│   ├── filter-panel.tsx         # Filter component
│   └── pipeline-card.tsx        # Pipeline status card
├── lib/                         # Utilities and configurations
│   ├── api-client.ts            # Abacus.AI API client
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Helper functions
└── .env                         # Environment variables (create this)
```

## API Integration

The application integrates with Abacus.AI REST API to fetch pipeline data. Key endpoints used:

- `POST /v0/describePipeline` - Get pipeline details
- `POST /v0/listPipelineVersions` - List pipeline versions
- `POST /v0/listPipelineExecutions` - Get execution history

### Pipeline IDs

- **Manufacturer Discovery**: `fd507c760`
- **Product Intelligence**: `1398624bb0`

## Usage

### Dashboard

The main dashboard provides an overview of both pipelines:
- Current status
- Recent execution history
- Success rates
- Quick access to detailed views

### Manufacturer Discovery

Browse and filter manufacturers:
- Search by name, location, or category
- Filter by status (verified, pending, inactive)
- Filter by discovery date range
- View detailed manufacturer information

### Product Intelligence

Explore products with advanced filtering:
- Search by product name, manufacturer, or description
- Filter by manufacturer, category, or document type
- Filter by creation date range
- View product details and associated documents

## Development

### Building for Production

```bash
yarn build
```

### Running Production Build

```bash
yarn start
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ABACUS_API_KEY` | Your Abacus.AI API key | Yes |

## Troubleshooting

### API Key Issues

If you see "API key not configured" errors:
1. Verify the `.env` file exists in the `nextjs_space` directory
2. Check that `ABACUS_API_KEY` is set correctly
3. Restart the development server after changing environment variables

### Connection Issues

If the application can't connect to Abacus.AI:
1. Verify your API key is valid
2. Check your internet connection
3. Ensure you have access to the specified pipelines

### Data Not Showing

The application currently uses mock data for demonstration. To integrate with real pipeline data:
1. Modify the API route handlers in `app/api/pipelines/`
2. Update data transformation logic in the client components
3. Adjust type definitions in `lib/types.ts` to match your pipeline output

## Support

For issues related to:
- **Abacus.AI API**: Visit [Abacus.AI Documentation](https://api.abacus.ai/documentation)
- **Application bugs**: Check the console for error messages

## License

This project is provided as-is for use with Abacus.AI pipelines.
