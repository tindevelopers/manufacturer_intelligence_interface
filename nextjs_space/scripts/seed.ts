import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.product.deleteMany();
  await prisma.searchHistory.deleteMany();
  await prisma.manufacturer.deleteMany();

  // Create manufacturers
  console.log('Creating manufacturers...');
  const manufacturers = await Promise.all([
    prisma.manufacturer.create({
      data: {
        name: 'TechCorp Industries',
        website: 'https://techcorp.example.com',
        category: 'Electronics',
        location: 'San Francisco, CA',
        status: 'verified',
        extractionStatus: 'completed',
        pipelineId: 'fd507c760',
      },
    }),
    prisma.manufacturer.create({
      data: {
        name: 'AutoParts Manufacturing',
        website: 'https://autoparts.example.com',
        category: 'Automotive',
        location: 'Detroit, MI',
        status: 'verified',
        extractionStatus: 'completed',
        pipelineId: 'fd507c760',
      },
    }),
    prisma.manufacturer.create({
      data: {
        name: 'GreenHome Solutions',
        website: 'https://greenhome.example.com',
        category: 'Home & Garden',
        location: 'Portland, OR',
        status: 'pending',
        extractionStatus: 'pending',
        pipelineId: 'fd507c760',
      },
    }),
    prisma.manufacturer.create({
      data: {
        name: 'MediSupply Corp',
        website: 'https://medisupply.example.com',
        category: 'Medical Equipment',
        location: 'Boston, MA',
        status: 'verified',
        extractionStatus: 'in_progress',
        pipelineId: 'fd507c760',
      },
    }),
    prisma.manufacturer.create({
      data: {
        name: 'FashionWorks',
        website: 'https://fashionworks.example.com',
        category: 'Apparel',
        location: 'New York, NY',
        status: 'verified',
        extractionStatus: 'completed',
        pipelineId: 'fd507c760',
      },
    }),
  ]);

  console.log(`✅ Created ${manufacturers.length} manufacturers`);

  // Create products for TechCorp Industries
  console.log('Creating products for TechCorp Industries...');
  await prisma.product.createMany({
    data: [
      {
        manufacturerId: manufacturers[0].id,
        name: 'SmartPhone Pro X',
        sku: 'TECH-SP-001',
        category: 'Smartphones',
        price: 899.99,
        availability: 'in_stock',
        description: 'High-performance smartphone with advanced AI capabilities and 5G connectivity.',
        specifications: {
          processor: 'Octa-core 3.0 GHz',
          ram: '8GB',
          storage: '256GB',
          display: '6.5" OLED',
          camera: '108MP Triple Camera',
          battery: '5000mAh',
        },
      },
      {
        manufacturerId: manufacturers[0].id,
        name: 'Wireless Earbuds Elite',
        sku: 'TECH-WE-002',
        category: 'Audio',
        price: 199.99,
        availability: 'in_stock',
        description: 'Premium wireless earbuds with active noise cancellation and 30-hour battery life.',
        specifications: {
          battery: '30 hours with case',
          connectivity: 'Bluetooth 5.3',
          noiseCancellation: 'Active ANC',
          waterResistance: 'IPX7',
        },
      },
      {
        manufacturerId: manufacturers[0].id,
        name: 'Smart Watch Series 5',
        sku: 'TECH-SW-003',
        category: 'Wearables',
        price: 399.99,
        availability: 'low_stock',
        description: 'Advanced smartwatch with health monitoring, GPS, and fitness tracking.',
        specifications: {
          display: '1.9" Retina Display',
          battery: '48 hours',
          sensors: 'Heart Rate, SpO2, GPS, Compass',
          waterResistance: '50m',
        },
      },
    ],
  });

  // Create products for AutoParts Manufacturing
  console.log('Creating products for AutoParts Manufacturing...');
  await prisma.product.createMany({
    data: [
      {
        manufacturerId: manufacturers[1].id,
        name: 'Premium Brake Pad Set',
        sku: 'AUTO-BP-101',
        category: 'Brakes',
        price: 89.99,
        availability: 'in_stock',
        description: 'High-performance ceramic brake pads for superior stopping power.',
        specifications: {
          material: 'Ceramic Composite',
          compatibility: 'Universal Fit',
          warranty: '2 years',
        },
      },
      {
        manufacturerId: manufacturers[1].id,
        name: 'LED Headlight Kit',
        sku: 'AUTO-HL-102',
        category: 'Lighting',
        price: 149.99,
        availability: 'in_stock',
        description: 'Ultra-bright LED headlight conversion kit with 6000K color temperature.',
        specifications: {
          lumens: '12000 LM',
          colorTemp: '6000K',
          powerDraw: '40W',
          lifespan: '50,000 hours',
        },
      },
    ],
  });

  // Create products for FashionWorks
  console.log('Creating products for FashionWorks...');
  await prisma.product.createMany({
    data: [
      {
        manufacturerId: manufacturers[4].id,
        name: 'Classic Denim Jacket',
        sku: 'FASH-DJ-201',
        category: 'Outerwear',
        price: 79.99,
        availability: 'in_stock',
        description: 'Timeless denim jacket with modern fit and premium fabric.',
        specifications: {
          material: '100% Cotton Denim',
          fit: 'Regular Fit',
          care: 'Machine Washable',
          sizes: 'XS-XXL',
        },
      },
      {
        manufacturerId: manufacturers[4].id,
        name: 'Premium Leather Handbag',
        sku: 'FASH-HB-202',
        category: 'Accessories',
        price: 249.99,
        availability: 'in_stock',
        description: 'Elegant leather handbag crafted from genuine Italian leather.',
        specifications: {
          material: 'Genuine Italian Leather',
          dimensions: '12" x 10" x 4"',
          features: 'Multiple compartments, adjustable strap',
        },
      },
    ],
  });

  const productCount = await prisma.product.count();
  console.log(`✅ Created ${productCount} products`);

  // Create search history
  console.log('Creating search history...');
  await prisma.searchHistory.createMany({
    data: [
      {
        manufacturerId: manufacturers[0].id,
        searchQuery: 'smartphone',
        productsFound: 1,
        filterApplied: { category: 'Electronics' },
      },
      {
        manufacturerId: manufacturers[1].id,
        searchQuery: 'brake pads',
        productsFound: 1,
        filterApplied: { category: 'Automotive' },
      },
      {
        manufacturerId: manufacturers[4].id,
        searchQuery: 'leather handbag',
        productsFound: 1,
        filterApplied: { category: 'Accessories' },
      },
    ],
  });

  console.log('✅ Created search history');
  console.log('🎉 Database seeding completed successfully!');
  
  // Print summary
  const manufacturerCount = await prisma.manufacturer.count();
  const searchCount = await prisma.searchHistory.count();
  
  console.log('\n📊 Database Summary:');
  console.log(`   - Manufacturers: ${manufacturerCount}`);
  console.log(`   - Products: ${productCount}`);
  console.log(`   - Search History: ${searchCount}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
