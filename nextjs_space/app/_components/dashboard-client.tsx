
'use client';

import { useEffect, useState } from 'react';
import { Factory, Package } from 'lucide-react';
import Link from 'next/link';
import { PipelineCard } from '@/components/pipeline-card';
import { LoadingState } from '@/components/loading-state';
import { ErrorMessage } from '@/components/error-message';
import { Button } from '@/components/ui/button';

interface DashboardData {
  manufacturer: any;
  product: any;
}

export function DashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/pipelines');
      const result = await response?.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch pipeline data');
      }
      
      setData(result?.data);
    } catch (err) {
      setError(err instanceof Error ? err?.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading pipeline data..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Dashboard"
        message={error}
      />
    );
  }

  const manufacturerPipeline = data?.manufacturer?.pipeline;
  const manufacturerExecutionsRaw = data?.manufacturer?.executions;
  const manufacturerExecutions = Array.isArray(manufacturerExecutionsRaw) ? manufacturerExecutionsRaw : [];
  
  const productPipeline = data?.product?.pipeline;
  const productExecutionsRaw = data?.product?.executions;
  const productExecutions = Array.isArray(productExecutionsRaw) ? productExecutionsRaw : [];

  const getLatestExecution = (executions: any[]) => {
    if (!Array.isArray(executions) || executions?.length === 0) return null;
    return executions?.[0]?.startedAt || null;
  };

  const calculateSuccessRate = (executions: any[]) => {
    if (!Array.isArray(executions) || executions?.length === 0) return 0;
    const successful = executions?.filter((e: any) => 
      e?.status?.toLowerCase() === 'complete' || e?.status?.toLowerCase() === 'success'
    )?.length ?? 0;
    return Math.round((successful / executions?.length) * 100);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <Link href="/manufacturers">
          <PipelineCard
            title="Manufacturer Discovery Pipeline V2"
            pipelineId="fd507c760"
            status={manufacturerExecutions?.[0]?.status || 'unknown'}
            lastExecution={getLatestExecution(manufacturerExecutions) || undefined}
            totalExecutions={manufacturerExecutions?.length || 0}
            successRate={calculateSuccessRate(manufacturerExecutions)}
            icon={<Factory className="h-6 w-6" />}
          />
        </Link>
        
        <Link href="/products">
          <PipelineCard
            title="Universal Product Intelligence Pipeline"
            pipelineId="1398624bb0"
            status={productExecutions?.[0]?.status || 'unknown'}
            lastExecution={getLatestExecution(productExecutions) || undefined}
            totalExecutions={productExecutions?.length || 0}
            successRate={calculateSuccessRate(productExecutions)}
            icon={<Package className="h-6 w-6" />}
          />
        </Link>
      </div>

      <div className="flex gap-4">
        <Link href="/manufacturers" className="flex-1">
          <Button className="w-full" size="lg">
            <Factory className="mr-2 h-5 w-5" />
            View Manufacturers
          </Button>
        </Link>
        <Link href="/products" className="flex-1">
          <Button className="w-full" size="lg" variant="secondary">
            <Package className="mr-2 h-5 w-5" />
            View Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
