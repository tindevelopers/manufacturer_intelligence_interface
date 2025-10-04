
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET single manufacturer
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const manufacturer = await prisma.manufacturer.findUnique({
      where: { id: params.id },
      include: {
        products: {
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { products: true, searches: true }
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
    console.error('Error fetching manufacturer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manufacturer' },
      { status: 500 }
    );
  }
}

// PATCH - Update manufacturer
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const manufacturer = await prisma.manufacturer.update({
      where: { id: params.id },
      data: body
    });

    return NextResponse.json({ success: true, data: manufacturer });
  } catch (error) {
    console.error('Error updating manufacturer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update manufacturer' },
      { status: 500 }
    );
  }
}

// DELETE manufacturer
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.manufacturer.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting manufacturer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete manufacturer' },
      { status: 500 }
    );
  }
}
