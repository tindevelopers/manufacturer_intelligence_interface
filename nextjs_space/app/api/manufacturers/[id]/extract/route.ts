
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST - Start extraction process for a manufacturer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { confirmed } = body;

    if (!confirmed) {
      return NextResponse.json(
        { success: false, error: 'Extraction must be confirmed' },
        { status: 400 }
      );
    }

    // Get manufacturer details
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: params.id }
    });

    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer not found' },
        { status: 404 }
      );
    }

    // Update status to in_progress
    await prisma.manufacturer.update({
      where: { id: params.id },
      data: { 
        extractionStatus: 'in_progress',
        status: 'pending'
      }
    });

    // Call Abacus.AI pipeline to extract products
    // This is where you would trigger the actual web scraping pipeline
    const ABACUS_API_KEY = process.env.ABACUS_API_KEY || process.env.ABACUSAI_API_KEY;
    
    // TODO: Replace with actual pipeline endpoint
    // For now, we'll simulate the extraction process
    try {
      // Example: Call Abacus.AI pipeline
      const response = await fetch('https://api.abacus.ai/v0/runPipeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apiKey': ABACUS_API_KEY || ''
        },
        body: JSON.stringify({
          pipelineId: manufacturer.pipelineId || 'default_scraping_pipeline',
          inputs: {
            website_url: manufacturer.website,
            manufacturer_name: manufacturer.name,
            manufacturer_id: manufacturer.id
          }
        })
      });

      if (!response.ok) {
        throw new Error('Pipeline execution failed');
      }

      const pipelineResult = await response.json();

      // For demo purposes, create some sample products
      // In production, these would come from the pipeline results
      const sampleProducts = [
        {
          name: `${manufacturer.name} Product 1`,
          manufacturerId: manufacturer.id,
          sku: 'SKU-001',
          category: manufacturer.category || 'General',
          price: 99.99,
          availability: 'in_stock',
          description: `Sample product from ${manufacturer.name}`,
          specifications: {
            weight: '1.5 lbs',
            dimensions: '10x8x2 inches'
          }
        },
        {
          name: `${manufacturer.name} Product 2`,
          manufacturerId: manufacturer.id,
          sku: 'SKU-002',
          category: manufacturer.category || 'General',
          price: 149.99,
          availability: 'in_stock',
          description: `Premium product from ${manufacturer.name}`,
          specifications: {
            weight: '2.5 lbs',
            dimensions: '12x10x3 inches'
          }
        }
      ];

      // Create products in database
      await prisma.product.createMany({
        data: sampleProducts
      });

      // Update manufacturer status
      await prisma.manufacturer.update({
        where: { id: params.id },
        data: { 
          extractionStatus: 'completed',
          status: 'verified'
        }
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Extraction started successfully',
        pipelineId: pipelineResult.pipelineExecutionId || 'demo'
      });

    } catch (pipelineError) {
      // Update status to failed
      await prisma.manufacturer.update({
        where: { id: params.id },
        data: { 
          extractionStatus: 'failed',
          status: 'failed'
        }
      });

      throw pipelineError;
    }

  } catch (error) {
    console.error('Error starting extraction:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to start extraction process' },
      { status: 500 }
    );
  }
}

// GET - Check extraction status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: params.id },
      select: {
        extractionStatus: true,
        status: true,
        _count: {
          select: { products: true }
        }
      }
    });

    if (!manufacturer) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: manufacturer });
  } catch (error) {
    console.error('Error checking extraction status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check extraction status' },
      { status: 500 }
    );
  }
}
