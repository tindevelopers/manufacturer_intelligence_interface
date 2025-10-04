
# Manufacturer Intelligence Interface

A modern web application for accessing and analyzing manufacturer discovery and product intelligence data from Abacus.AI pipelines.

## 🚀 Tech Stack

- **Framework**: Next.js 14.2.28 (App Router)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.3
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack React Query 5.0.0
- **Monorepo**: Turborepo
- **Package Manager**: Yarn

## 📋 Prerequisites

- Node.js >= 18.0.0
- Yarn >= 1.22.0
- Abacus.AI API Key

## 🛠️ Getting Started

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd manufacturer_intelligence_interface
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Configure environment variables

Create a `.env` file in `apps/web/`:

```env
ABACUS_API_KEY=your_api_key_here
ABACUSAI_API_KEY=your_api_key_here
```

### 4. Run the development server

```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 📦 Project Structure

```
manufacturer_intelligence_interface/
├── apps/
│   └── web/                    # Next.js application
│       ├── app/               # App router pages
│       ├── components/        # React components
│       ├── lib/              # Utility functions and API clients
│       └── public/           # Static assets
├── packages/                  # Shared packages (future)
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions workflow
├── turbo.json                # Turborepo configuration
├── package.json              # Root package.json
└── README.md
```

## 🔧 Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn clean` - Clean build artifacts

## 🔌 API Integration

The application connects to two Abacus.AI pipelines:

1. **Manufacturer Discovery Pipeline V2** (ID: `fd507c760`)
2. **Universal Product Intelligence Pipeline** (ID: `1398624bb0`)

### API Endpoints

- `GET /api/pipelines` - Fetch all pipeline data
- `GET /api/pipelines/[pipelineId]` - Fetch specific pipeline details

## 🚢 Deployment

### GitHub Setup

1. Push your code to GitHub:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Add GitHub Secrets:
   - Go to Settings → Secrets and variables → Actions
   - Add `ABACUS_API_KEY` and `ABACUSAI_API_KEY`

### Deploy to Vercel (Recommended)

1. Install Vercel CLI:

```bash
npm i -g vercel
```

2. Deploy:

```bash
cd apps/web
vercel
```

3. Add environment variables in Vercel dashboard

### Deploy to Other Platforms

The application can be deployed to:
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Google Cloud Run**
- **Docker** (custom infrastructure)

## 🔐 Environment Variables

Required environment variables:

| Variable | Description |
|----------|-------------|
| `ABACUS_API_KEY` | Abacus.AI API key for authentication |
| `ABACUSAI_API_KEY` | Alternative API key variable |

## 📱 Features

- ✅ Real-time pipeline monitoring
- ✅ Manufacturer discovery data display
- ✅ Product intelligence search and filtering
- ✅ Responsive design
- ✅ Modern UI with Radix components
- ✅ Type-safe API client
- ✅ Server-side rendering

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 📞 Support

For questions or issues, contact your team lead or create an issue in the repository.

---

Built with ❤️ using Next.js and Turborepo
