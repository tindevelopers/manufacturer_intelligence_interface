

import { NextResponse } from 'next/server';
import { AbacusAPIClient } from '@/lib/api-client';

const MANUFACTURER_PIPELINE_ID = 'fd507c760';
const PRODUCT_PIPELINE_ID = '1398624bb0';

export async function GET() {
  try {
    const apiKey = process.env.ABACUS_API_KEY || process.env.ABACUSAI_API_KEY;
    
    // For testing/demo purposes, return mock pipeline data
    // This simulates realistic pipeline execution data
    const mockManufacturerExecutions = [
      {
        pipelineExecutionId: 'exec_001',
        status: 'COMPLETE',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
        recordsProcessed: 5,
      },
      {
        pipelineExecutionId: 'exec_002',
        status: 'COMPLETE',
        startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        completedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
        recordsProcessed: 3,
      },
      {
        pipelineExecutionId: 'exec_003',
        status: 'COMPLETE',
        startedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
        completedAt: new Date(Date.now() - 47.5 * 60 * 60 * 1000).toISOString(),
        recordsProcessed: 4,
      },
    ];

    const mockProductExecutions = [
      {
        pipelineExecutionId: 'exec_prod_001',
        status: 'COMPLETE',
        startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
        recordsProcessed: 8,
      },
      {
        pipelineExecutionId: 'exec_prod_002',
        status: 'COMPLETE',
        startedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 17.5 * 60 * 60 * 1000).toISOString(),
        recordsProcessed: 7,
      },
      {
        pipelineExecutionId: 'exec_prod_003',
        status: 'RUNNING',
        startedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(), // 30 min ago
        completedAt: null,
        recordsProcessed: null,
      },
    ];

    const mockManufacturerPipeline = {
      pipelineId: MANUFACTURER_PIPELINE_ID,
      name: 'Manufacturer Discovery Pipeline V2',
      description: 'AI-powered pipeline for discovering and extracting manufacturer data',
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    };

    const mockProductPipeline = {
      pipelineId: PRODUCT_PIPELINE_ID,
      name: 'Universal Product Intelligence Pipeline',
      description: 'Advanced pipeline for product data extraction and enrichment',
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: {
        manufacturer: {
          pipeline: mockManufacturerPipeline,
          executions: mockManufacturerExecutions,
        },
        product: {
          pipeline: mockProductPipeline,
          executions: mockProductExecutions,
        },
      },
      _note: 'Using mock data for testing. Configure real pipeline IDs in production.',
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

