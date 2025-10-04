

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

    const apiKey = process.env.ABACUS_API_KEY;
    
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
    
    // Fetch pipeline details
    const pipelineData = await client.getPipeline(pipelineId);
    
    // Fetch recent versions
    const versionsData = await client.listPipelineVersions(pipelineId);
    
    // Fetch execution history
    const executionsData = await client.listPipelineExecutions(pipelineId);

    return NextResponse.json({
      success: true,
      data: {
        pipeline: pipelineData,
        versions: versionsData,
        executions: executionsData,
      },
    });
  } catch (error) {
    console.error('Pipeline API error:', error);
    
    // Provide helpful error message for authentication issues
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pipeline data';
    const isAuthError = errorMessage?.toLowerCase()?.includes('not found') || 
                       errorMessage?.toLowerCase()?.includes('unauthorized') ||
                       errorMessage?.toLowerCase()?.includes('forbidden');
    
    return NextResponse.json(
      { 
        success: false, 
        error: isAuthError 
          ? 'Invalid API key or insufficient permissions. Please verify your API key in the .env file.'
          : errorMessage,
        code: isAuthError ? 'AUTH_ERROR' : 'API_ERROR'
      },
      { status: 200 } // Return 200 to handle gracefully on frontend
    );
  }
}

