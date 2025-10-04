
import { NextResponse } from 'next/server';
import { AbacusAPIClient } from '@/lib/api-client';

const MANUFACTURER_PIPELINE_ID = 'fd507c760';
const PRODUCT_PIPELINE_ID = '1398624bb0';

export async function GET() {
  try {
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
    
    // Fetch both pipelines
    const [manufacturerPipeline, productPipeline] = await Promise.all([
      client.getPipeline(MANUFACTURER_PIPELINE_ID).catch(err => ({ error: err?.message })),
      client.getPipeline(PRODUCT_PIPELINE_ID).catch(err => ({ error: err?.message })),
    ]);

    // Fetch execution data for both pipelines
    const [manufacturerExecutions, productExecutions] = await Promise.all([
      client.listPipelineExecutions(MANUFACTURER_PIPELINE_ID).catch(err => ({ error: err?.message })),
      client.listPipelineExecutions(PRODUCT_PIPELINE_ID).catch(err => ({ error: err?.message })),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        manufacturer: {
          pipeline: manufacturerPipeline,
          executions: manufacturerExecutions,
        },
        product: {
          pipeline: productPipeline,
          executions: productExecutions,
        },
      },
    });
  } catch (error) {
    console.error('Pipelines API error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pipelines data';
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
