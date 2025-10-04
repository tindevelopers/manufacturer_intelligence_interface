

import { NextRequest, NextResponse } from 'next/server';
import { AbacusAPIClient } from '@/lib/api-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { pipelineId: string } }
) {
  try {
    const pipelineId = params?.pipelineId;
    
    if (!pipelineId) {
      return NextResponse.json(
        { success: false, error: 'Pipeline ID is required' },
        { status: 400 }
      );
    }

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

    // Return empty data for now - pipelines not configured
    return NextResponse.json({
      success: true,
      data: {
        pipeline: null,
        versions: [],
        executions: [],
      },
      message: 'Pipeline not configured. Please create this pipeline in your Abacus.AI account.'
    });
  } catch (error) {
    console.error('Pipeline API error:', error);
    
    // Provide helpful error message
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pipeline data';
    
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

