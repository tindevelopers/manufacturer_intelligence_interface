
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/search-bar';
import { FilterPanel } from '@/components/filter-panel';
import { LoadingState } from '@/components/loading-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AddManufacturerDialog } from '@/components/add-manufacturer-dialog';
import { ExtractionConfirmationDialog } from '@/components/extraction-confirmation-dialog';
import { Building2, MapPin, Calendar, CheckCircle2, Package, ExternalLink, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface Manufacturer {
  id: string;
  name: string;
  website: string;
  status: string;
  extractionStatus: string;
  location?: string;
  category?: string;
  createdAt: string;
  _count?: {
    products: number;
  };
}

export function ManufacturersClient() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filteredManufacturers, setFilteredManufacturers] = useState<Manufacturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: 'all',
    category: 'all',
  });

  useEffect(() => {
    fetchManufacturers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, manufacturers]);

  const fetchManufacturers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/manufacturers');
      const result = await response?.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch manufacturer data');
      }
      
      setManufacturers(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err?.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...manufacturers];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered?.filter((m) =>
        m?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        m?.website?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        m?.location?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        m?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filters?.status && filters?.status !== 'all') {
      filtered = filtered?.filter((m) => m?.status?.toLowerCase() === filters?.status?.toLowerCase());
    }
    
    // Apply category filter
    if (filters?.category && filters?.category !== 'all') {
      filtered = filtered?.filter((m) => m?.category === filters?.category);
    }
    
    // Apply date range filter
    if (filters?.startDate) {
      filtered = filtered?.filter((m) => {
        const createdDate = m?.createdAt ? new Date(m.createdAt) : null;
        const startDate = new Date(filters.startDate);
        return createdDate && createdDate >= startDate;
      });
    }
    
    if (filters?.endDate) {
      filtered = filtered?.filter((m) => {
        const createdDate = m?.createdAt ? new Date(m.createdAt) : null;
        const endDate = new Date(filters.endDate);
        return createdDate && createdDate <= endDate;
      });
    }
    
    setFilteredManufacturers(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: 'default' | 'secondary' | 'destructive', className?: string }> = {
      verified: { variant: 'default', className: 'bg-green-500' },
      pending: { variant: 'secondary' },
      failed: { variant: 'destructive' }
    };

    const config = statusConfig[status] || { variant: 'secondary' };
    
    return (
      <Badge variant={config.variant} className={config.className}>
        {status === 'verified' && <CheckCircle2 className="h-3 w-3 mr-1" />}
        {status}
      </Badge>
    );
  };

  const getExtractionStatusBadge = (extractionStatus: string) => {
    const statusConfig: Record<string, { label: string, icon?: any, className?: string }> = {
      pending: { label: 'Not Started', className: 'bg-gray-500' },
      in_progress: { label: 'Extracting...', icon: Loader2, className: 'bg-blue-500' },
      completed: { label: 'Completed', className: 'bg-green-500' },
      failed: { label: 'Failed', className: 'bg-red-500' }
    };

    const config = statusConfig[extractionStatus] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant="default" className={config.className}>
        {Icon && <Icon className="h-3 w-3 mr-1 animate-spin" />}
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingState message="Loading manufacturers..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Manufacturers"
        message={error}
        action={
          <Button onClick={fetchManufacturers}>
            Try Again
          </Button>
        }
      />
    );
  }

  const categories = Array.from(new Set(manufacturers?.map((m) => m?.category)?.filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Manufacturer Database</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Add manufacturers to extract their product catalogs
          </p>
        </div>
        <AddManufacturerDialog onSuccess={fetchManufacturers} />
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <aside className="space-y-6">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search manufacturers..."
          />
          
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            statusOptions={['all', 'verified', 'pending', 'failed']}
            categoryOptions={categories}
            showCategory={true}
          />
        </aside>
        
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {filteredManufacturers?.length} of {manufacturers?.length} manufacturers
            </p>
          </div>
          
          {filteredManufacturers?.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">No manufacturers found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {manufacturers?.length === 0 
                    ? "Get started by adding your first manufacturer"
                    : "Try adjusting your search or filters"}
                </p>
                {manufacturers?.length === 0 && (
                  <AddManufacturerDialog onSuccess={fetchManufacturers} />
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredManufacturers?.map((manufacturer) => (
                <Card key={manufacturer?.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                          <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl">{manufacturer?.name}</CardTitle>
                          <CardDescription className="flex flex-col gap-1 mt-1">
                            {manufacturer?.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3 shrink-0" />
                                <span>{manufacturer.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <a 
                                href={manufacturer.website} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="hover:underline truncate"
                              >
                                {manufacturer.website}
                              </a>
                            </div>
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end shrink-0 ml-4">
                        {getStatusBadge(manufacturer?.status)}
                        {getExtractionStatusBadge(manufacturer?.extractionStatus)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap gap-4 text-sm">
                        {manufacturer?.category && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Category:</span>
                            <Badge variant="outline">{manufacturer.category}</Badge>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {manufacturer?._count?.products || 0} products
                          </span>
                        </div>
                        {manufacturer?.createdAt && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            Added {format(new Date(manufacturer.createdAt), 'MMM d, yyyy')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        {manufacturer?.extractionStatus === 'pending' && (
                          <ExtractionConfirmationDialog
                            manufacturerId={manufacturer.id}
                            manufacturerName={manufacturer.name}
                            website={manufacturer.website}
                            onSuccess={fetchManufacturers}
                          />
                        )}
                        {(manufacturer?._count?.products || 0) > 0 && (
                          <Link href={`/products?manufacturer=${manufacturer.id}`}>
                            <Button variant="outline" size="sm" className="gap-2">
                              <Package className="h-4 w-4" />
                              View Products
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
