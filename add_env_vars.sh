#!/bin/bash

# Add environment variables to Vercel project
echo "Adding ABACUS_API_KEY..."
echo "2802fae65af84b98883a39078c3929dd" | vercel env add ABACUS_API_KEY

echo "Adding ABACUSAI_API_KEY..."
echo "2802fae65af84b98883a39078c3929dd" | vercel env add ABACUSAI_API_KEY

echo "Environment variables added successfully!"

