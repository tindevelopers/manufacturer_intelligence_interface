
import { Package } from 'lucide-react';
import { ProductsClient } from './_components/products-client';

export default function ProductsPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Product Intelligence</h1>
        </div>
        <p className="text-muted-foreground">
          Browse and search products from Pipeline 1398624bb0
        </p>
      </div>
      
      <ProductsClient />
    </div>
  );
}
