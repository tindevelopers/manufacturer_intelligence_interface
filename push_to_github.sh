
#!/bin/bash

echo "========================================"
echo "  GitHub Push Helper Script"
echo "========================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d ".git" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "Current repository: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"
echo ""

# Check git status
echo "📊 Git Status:"
git status --short
echo ""

# Count commits
COMMIT_COUNT=$(git rev-list --count HEAD 2>/dev/null || echo 0)
echo "📝 Total commits: $COMMIT_COUNT"
echo ""

# Check if remote exists
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "Adding remote origin..."
    git remote add origin https://github.com/tindevelopers/manufacturer_intelligence_interface.git
fi

echo "========================================"
echo "  Authentication Options"
echo "========================================"
echo ""
echo "1. GitHub CLI (gh auth login)"
echo "2. Personal Access Token"
echo "3. SSH Key"
echo ""
read -p "Choose authentication method (1-3): " auth_method

case $auth_method in
    1)
        echo ""
        echo "🔐 Authenticating with GitHub CLI..."
        if ! command -v gh &> /dev/null; then
            echo "❌ GitHub CLI not found. Install from: https://cli.github.com/"
            exit 1
        fi
        gh auth login
        echo ""
        echo "✅ Authentication complete!"
        echo ""
        echo "🚀 Pushing to GitHub..."
        git push -u origin master
        ;;
    2)
        echo ""
        read -sp "Enter your GitHub Personal Access Token: " token
        echo ""
        git remote set-url origin "https://${token}@github.com/tindevelopers/manufacturer_intelligence_interface.git"
        echo ""
        echo "🚀 Pushing to GitHub..."
        git push -u origin master
        # Reset to HTTPS URL (without token) for security
        git remote set-url origin "https://github.com/tindevelopers/manufacturer_intelligence_interface.git"
        ;;
    3)
        echo ""
        echo "🔑 Using SSH authentication..."
        git remote set-url origin "git@github.com:tindevelopers/manufacturer_intelligence_interface.git"
        echo ""
        echo "🚀 Pushing to GitHub..."
        git push -u origin master
        ;;
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
if [ $? -eq 0 ]; then
    echo "========================================"
    echo "  ✅ Successfully pushed to GitHub!"
    echo "========================================"
    echo ""
    echo "🌐 View your repository:"
    echo "   https://github.com/tindevelopers/manufacturer_intelligence_interface"
    echo ""
    echo "📋 Next Steps:"
    echo "   1. Set up GitHub Secrets for CI/CD"
    echo "   2. Configure Vercel deployment (optional)"
    echo "   3. Review the DEPLOYMENT.md for detailed instructions"
    echo ""
else
    echo "========================================"
    echo "  ❌ Push failed"
    echo "========================================"
    echo ""
    echo "Common issues:"
    echo "  • Check your authentication credentials"
    echo "  • Ensure repository exists on GitHub"
    echo "  • Verify you have push permissions"
    echo ""
    echo "For help, see: PUSH_TO_GITHUB.md"
    echo ""
fi
