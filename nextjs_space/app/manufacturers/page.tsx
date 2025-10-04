

import { Factory } from 'lucide-react';
import { ManufacturersClient } from './_components/manufacturers-client';

export default function ManufacturersPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Factory className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Manufacturer Discovery</h1>
        </div>
        <p className="text-muted-foreground">
          Browse and search manufacturers discovered by Pipeline fd507c760
        </p>
      </div>
      
      <ManufacturersClient />
    </div>
  );
}

