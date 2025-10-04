

import { NextResponse } from 'next/server';
import { AbacusAPIClient } from '@/lib/api-client';

const MANUFACTURER_PIPELINE_ID = 'fd507c760';
const PRODUCT_PIPELINE_ID = '1398624bb0';

export async function GET() {
  try {
    const apiKey = process.env.ABACUS_API_KEY || process.env.ABACUSAI_API_KEY;
    
    if (!apiKey || apiKey === 'placeholder_api_key_please_replace') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Please configure your Abacus.AI API key in the .env file. See README.md for instructions.',
          code: 'API_KEY_NOT_CONFIGURED'
        },
        { status: 200 } // Return 200 to handle gracefully on frontend
      );
    }

    const client = new AbacusAPIClient(apiKey);
    
    // Return success with null data if pipelines don't exist yet
    // This allows the app to work without configured pipelines
    return NextResponse.json({
      success: true,
      data: {
        manufacturer: {
          pipeline: null,
          executions: [],
        },
        product: {
          pipeline: null,
          executions: [],
        },
      },
      message: 'Pipelines not configured. Please create pipelines in your Abacus.AI account.'
    });
  } catch (error) {
    console.error('Pipelines API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pipelines data';
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        code: 'API_ERROR'
      },
      { status: 200 } // Return 200 to handle gracefully on frontend
    );
  }
}

