
#!/bin/bash

echo "🚀 Manufacturer Intelligence Interface - Deployment Helper"
echo "=========================================================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Manufacturer Intelligence Interface"
fi

echo ""
echo "📝 Before pushing to GitHub, you need to:"
echo ""
echo "1. Create a new repository on GitHub:"
echo "   → Go to https://github.com/new"
echo "   → Name: manufacturer-intelligence"
echo "   → Description: Web interface for Abacus.AI pipelines"
echo "   → Visibility: Private (recommended)"
echo "   → DO NOT initialize with README"
echo ""
echo "2. Then run this command (replace YOUR_USERNAME):"
echo "   git remote add origin https://github.com/YOUR_USERNAME/manufacturer-intelligence.git"
echo ""
echo "3. Push to GitHub:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Add GitHub Secrets:"
echo "   → Go to Settings → Secrets and variables → Actions"
echo "   → Add ABACUS_API_KEY and ABACUSAI_API_KEY"
echo ""
echo "5. Deploy to Vercel:"
echo "   → Go to https://vercel.com"
echo "   → Import your GitHub repository"
echo "   → Set Root Directory to: apps/web"
echo "   → Add environment variables"
echo ""
echo "For detailed instructions, see GITHUB_SETUP.md"
echo ""
