

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface PipelineCardProps {
  title: string;
  pipelineId: string;
  status?: string;
  lastExecution?: string;
  totalExecutions?: number;
  successRate?: number;
  icon?: React.ReactNode;
}

export function PipelineCard({
  title,
  pipelineId,
  status = 'unknown',
  lastExecution,
  totalExecutions = 0,
  successRate = 0,
  icon,
}: PipelineCardProps) {
  const getStatusIcon = () => {
    switch (status?.toLowerCase()) {
      case 'complete':
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'failed':
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'running':
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = () => {
    switch (status?.toLowerCase()) {
      case 'complete':
      case 'success':
        return <Badge variant="default" className="bg-green-500">Active</Badge>;
      case 'failed':
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      case 'running':
      case 'pending':
        return <Badge variant="secondary">Running</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <CardDescription className="mt-1 font-mono text-xs">
                ID: {pipelineId}
              </CardDescription>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="text-sm text-muted-foreground">
              {status || 'No recent executions'}
            </span>
          </div>
          
          {lastExecution && (
            <div className="text-sm">
              <span className="text-muted-foreground">Last execution: </span>
              <span className="font-medium">
                {format(new Date(lastExecution), 'MMM d, yyyy HH:mm')}
              </span>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <div className="text-2xl font-bold">{totalExecutions}</div>
              <div className="text-xs text-muted-foreground">Total Executions</div>
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="text-2xl font-bold">{successRate}%</div>
                <div className="text-xs text-muted-foreground">Success Rate</div>
              </div>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

