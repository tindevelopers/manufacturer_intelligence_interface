
'use client';

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExtractionConfirmationDialogProps {
  manufacturerId: string;
  manufacturerName: string;
  website: string;
  onSuccess?: () => void;
}

export function ExtractionConfirmationDialog({
  manufacturerId,
  manufacturerName,
  website,
  onSuccess
}: ExtractionConfirmationDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/manufacturers/${manufacturerId}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmed: true })
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to start extraction');
      }

      toast({
        title: 'Extraction Started',
        description: `Product data extraction from ${manufacturerName} has been initiated.`
      });

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to start extraction',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Extract Products
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Confirm Product Extraction
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              You are about to extract product data from:
            </p>
            <div className="bg-muted p-3 rounded-md space-y-1">
              <p className="font-semibold">{manufacturerName}</p>
              <p className="text-sm text-muted-foreground break-all">{website}</p>
            </div>
            <p className="text-sm">
              This will use Abacus.AI pipelines to scrape and extract product information from the manufacturer's website. 
              The process may take several minutes depending on the size of the product catalog.
            </p>
            <p className="text-sm font-semibold">
              Do you want to proceed?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Yes, Start Extraction
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
