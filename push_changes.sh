
#!/bin/bash
echo "Pushing changes to GitHub..."
echo ""
echo "Please enter your GitHub Personal Access Token:"
read -s TOKEN
echo ""

git push https://$TOKEN@github.com/tindevelopers/manufacturer_intelligence_interface.git master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "Next steps:"
    echo "1. Check your Vercel dashboard - it should automatically redeploy"
    echo "2. Make sure to add ABACUS_API_KEY to your Vercel environment variables"
    echo "   Go to: Project Settings > Environment Variables"
    echo "   Add: ABACUS_API_KEY = 2802fae65af84b98883a39078c3929dd"
else
    echo ""
    echo "❌ Push failed. Please check your token and try again."
fi
