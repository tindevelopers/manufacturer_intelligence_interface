
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET all manufacturers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const where: any = {};

    if (status && status !== 'all') {
      where.status = status;
    }

    if (category && category !== 'all') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { website: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    const manufacturers = await prisma.manufacturer.findMany({
      where,
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: manufacturers });
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch manufacturers' },
      { status: 500 }
    );
  }
}

// POST - Create new manufacturer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, website, category, location } = body;

    if (!name || !website) {
      return NextResponse.json(
        { success: false, error: 'Name and website are required' },
        { status: 400 }
      );
    }

    // Check if manufacturer already exists
    const existing = await prisma.manufacturer.findUnique({
      where: { website }
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Manufacturer with this website already exists' },
        { status: 409 }
      );
    }

    const manufacturer = await prisma.manufacturer.create({
      data: {
        name,
        website,
        category,
        location,
        status: 'pending',
        extractionStatus: 'pending'
      }
    });

    return NextResponse.json({ success: true, data: manufacturer });
  } catch (error) {
    console.error('Error creating manufacturer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create manufacturer' },
      { status: 500 }
    );
  }
}
