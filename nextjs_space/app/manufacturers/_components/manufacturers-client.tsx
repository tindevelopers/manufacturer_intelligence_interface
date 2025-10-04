
'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { FilterPanel } from '@/components/filter-panel';
import { LoadingState } from '@/components/loading-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

interface Manufacturer {
  id: string;
  name: string;
  status?: string;
  location?: string;
  category?: string;
  discoveredAt?: string;
  details?: any;
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
      
      const response = await fetch('/api/pipelines/fd507c760');
      const result = await response?.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch manufacturer data');
      }
      
      // Transform pipeline data to manufacturers
      // This is a placeholder - actual data structure depends on pipeline output
      const mockManufacturers: Manufacturer[] = [
        {
          id: '1',
          name: 'Advanced Manufacturing Inc.',
          status: 'verified',
          location: 'San Francisco, CA',
          category: 'Electronics',
          discoveredAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Precision Components Ltd.',
          status: 'pending',
          location: 'Austin, TX',
          category: 'Automotive',
          discoveredAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          name: 'Global Tech Solutions',
          status: 'verified',
          location: 'New York, NY',
          category: 'Technology',
          discoveredAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ];
      
      setManufacturers(mockManufacturers);
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
        const discoveredDate = m?.discoveredAt ? new Date(m.discoveredAt) : null;
        const startDate = new Date(filters.startDate);
        return discoveredDate && discoveredDate >= startDate;
      });
    }
    
    if (filters?.endDate) {
      filtered = filtered?.filter((m) => {
        const discoveredDate = m?.discoveredAt ? new Date(m.discoveredAt) : null;
        const endDate = new Date(filters.endDate);
        return discoveredDate && discoveredDate <= endDate;
      });
    }
    
    setFilteredManufacturers(filtered);
  };

  if (loading) {
    return <LoadingState message="Loading manufacturers..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Manufacturers"
        message={error}
      />
    );
  }

  const categories = Array.from(new Set(manufacturers?.map((m) => m?.category)?.filter(Boolean))) as string[];

  return (
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
          statusOptions={['all', 'verified', 'pending', 'inactive']}
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
              <p className="text-muted-foreground">No manufacturers found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredManufacturers?.map((manufacturer) => (
              <Card key={manufacturer?.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{manufacturer?.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {manufacturer?.location && (
                            <>
                              <MapPin className="h-3 w-3" />
                              {manufacturer.location}
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    {manufacturer?.status && (
                      <Badge 
                        variant={manufacturer?.status === 'verified' ? 'default' : 'secondary'}
                        className={manufacturer?.status === 'verified' ? 'bg-green-500' : ''}
                      >
                        {manufacturer?.status === 'verified' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                        {manufacturer.status}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {manufacturer?.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="outline">{manufacturer.category}</Badge>
                      </div>
                    )}
                    {manufacturer?.discoveredAt && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Discovered {format(new Date(manufacturer.discoveredAt), 'MMM d, yyyy')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
