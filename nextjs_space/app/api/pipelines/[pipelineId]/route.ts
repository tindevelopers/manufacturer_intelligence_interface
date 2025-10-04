

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

    // Return mock data based on pipeline ID
    const isManufacturerPipeline = pipelineId === 'fd507c760';
    
    const mockPipeline = {
      pipelineId: pipelineId,
      name: isManufacturerPipeline 
        ? 'Manufacturer Discovery Pipeline V2'
        : 'Universal Product Intelligence Pipeline',
      description: isManufacturerPipeline
        ? 'AI-powered pipeline for discovering and extracting manufacturer data'
        : 'Advanced pipeline for product data extraction and enrichment',
      status: 'ACTIVE',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const mockVersions = [
      {
        pipelineVersion: `${pipelineId}_v3`,
        version: 3,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ACTIVE',
      },
      {
        pipelineVersion: `${pipelineId}_v2`,
        version: 2,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'DEPRECATED',
      },
    ];

    const mockExecutions = isManufacturerPipeline 
      ? [
          {
            pipelineExecutionId: 'exec_001',
            status: 'COMPLETE',
            startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
            recordsProcessed: 5,
          },
          {
            pipelineExecutionId: 'exec_002',
            status: 'COMPLETE',
            startedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 23.5 * 60 * 60 * 1000).toISOString(),
            recordsProcessed: 3,
          },
        ]
      : [
          {
            pipelineExecutionId: 'exec_prod_001',
            status: 'COMPLETE',
            startedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            completedAt: new Date(Date.now() - 2.5 * 60 * 60 * 1000).toISOString(),
            recordsProcessed: 8,
          },
          {
            pipelineExecutionId: 'exec_prod_002',
            status: 'RUNNING',
            startedAt: new Date(Date.now() - 0.5 * 60 * 60 * 1000).toISOString(),
            completedAt: null,
            recordsProcessed: null,
          },
        ];

    return NextResponse.json({
      success: true,
      data: {
        pipeline: mockPipeline,
        versions: mockVersions,
        executions: mockExecutions,
      },
      _note: 'Using mock data for testing. Configure real pipeline IDs in production.',
    });
  } catch (error) {
    console.error('Pipeline API error:', error);
    
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

