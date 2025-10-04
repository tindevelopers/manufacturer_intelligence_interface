

'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorMessageProps {
  title?: string;
  message: string;
  className?: string;
  action?: React.ReactNode;
}

export function ErrorMessage({ 
  title = 'Error', 
  message, 
  className = '',
  action
}: ErrorMessageProps) {
  return (
    <Alert variant="destructive" className={className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span>{message}</span>
        {action && <div>{action}</div>}
      </AlertDescription>
    </Alert>
  );
}

