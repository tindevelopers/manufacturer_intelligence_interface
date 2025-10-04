

import { Factory, Package } from 'lucide-react';
import { DashboardClient } from './_components/dashboard-client';

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Pipeline Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and access data from your Abacus.AI pipelines
        </p>
      </div>
      
      <DashboardClient />
    </div>
  );
}

