
'use client';

import { useEffect, useState } from 'react';
import { SearchBar } from '@/components/search-bar';
import { LoadingState } from '@/components/loading-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Box, FileText, Calendar, Building2, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface Product {
  id: string;
  name: string;
  manufacturer?: string;
  category?: string;
  documentType?: string;
  description?: string;
  createdAt?: string;
  details?: any;
}

export function ProductsClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    manufacturer: 'all',
    category: 'all',
    documentType: 'all',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/pipelines/1398624bb0');
      const result = await response?.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch product data');
      }
      
      // Transform pipeline data to products
      // This is a placeholder - actual data structure depends on pipeline output
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Quantum Processor X1',
          manufacturer: 'Advanced Manufacturing Inc.',
          category: 'Electronics',
          documentType: 'Specification',
          description: 'Next-generation quantum computing processor',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'AutoDrive Controller',
          manufacturer: 'Precision Components Ltd.',
          category: 'Automotive',
          documentType: 'Technical Manual',
          description: 'Advanced autonomous vehicle control system',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          name: 'CloudSync Platform',
          manufacturer: 'Global Tech Solutions',
          category: 'Software',
          documentType: 'Product Brief',
          description: 'Enterprise cloud synchronization platform',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
        },
        {
          id: '4',
          name: 'SmartSensor Array',
          manufacturer: 'Advanced Manufacturing Inc.',
          category: 'IoT',
          documentType: 'Datasheet',
          description: 'Industrial IoT sensor network system',
          createdAt: new Date(Date.now() - 259200000).toISOString(),
        },
      ];
      
      setProducts(mockProducts);
    } catch (err) {
      setError(err instanceof Error ? err?.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];
    
    // Apply search
    if (searchTerm) {
      filtered = filtered?.filter((p) =>
        p?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        p?.manufacturer?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        p?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        p?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    
    // Apply manufacturer filter
    if (filters?.manufacturer && filters?.manufacturer !== 'all') {
      filtered = filtered?.filter((p) => p?.manufacturer === filters?.manufacturer);
    }
    
    // Apply category filter
    if (filters?.category && filters?.category !== 'all') {
      filtered = filtered?.filter((p) => p?.category === filters?.category);
    }
    
    // Apply document type filter
    if (filters?.documentType && filters?.documentType !== 'all') {
      filtered = filtered?.filter((p) => p?.documentType === filters?.documentType);
    }
    
    // Apply date range filter
    if (filters?.startDate) {
      filtered = filtered?.filter((p) => {
        const createdDate = p?.createdAt ? new Date(p.createdAt) : null;
        const startDate = new Date(filters.startDate);
        return createdDate && createdDate >= startDate;
      });
    }
    
    if (filters?.endDate) {
      filtered = filtered?.filter((p) => {
        const createdDate = p?.createdAt ? new Date(p.createdAt) : null;
        const endDate = new Date(filters.endDate);
        return createdDate && createdDate <= endDate;
      });
    }
    
    setFilteredProducts(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      manufacturer: 'all',
      category: 'all',
      documentType: 'all',
      startDate: '',
      endDate: '',
    });
  };

  if (loading) {
    return <LoadingState message="Loading products..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Products"
        message={error}
      />
    );
  }

  const manufacturers = Array.from(new Set(products?.map((p) => p?.manufacturer)?.filter(Boolean))) as string[];
  const categories = Array.from(new Set(products?.map((p) => p?.category)?.filter(Boolean))) as string[];
  const documentTypes = Array.from(new Set(products?.map((p) => p?.documentType)?.filter(Boolean))) as string[];

  return (
    <div className="grid lg:grid-cols-[300px_1fr] gap-6">
      <aside className="space-y-6">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search products..."
        />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Select
                value={filters?.manufacturer || 'all'}
                onValueChange={(value) => setFilters({ ...filters, manufacturer: value })}
              >
                <SelectTrigger id="manufacturer">
                  <SelectValue placeholder="Select manufacturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Manufacturers</SelectItem>
                  {manufacturers?.map((manufacturer) => (
                    <SelectItem key={manufacturer} value={manufacturer}>
                      {manufacturer}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters?.category || 'all'}
                onValueChange={(value) => setFilters({ ...filters, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documentType">Document Type</Label>
              <Select
                value={filters?.documentType || 'all'}
                onValueChange={(value) => setFilters({ ...filters, documentType: value })}
              >
                <SelectTrigger id="documentType">
                  <SelectValue placeholder="Select document type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Document Types</SelectItem>
                  {documentTypes?.map((docType) => (
                    <SelectItem key={docType} value={docType}>
                      {docType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                id="start-date"
                type="date"
                value={filters?.startDate || ''}
                onChange={(e) => setFilters({ ...filters, startDate: e?.target?.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                End Date
              </Label>
              <Input
                id="end-date"
                type="date"
                value={filters?.endDate || ''}
                onChange={(e) => setFilters({ ...filters, endDate: e?.target?.value })}
              />
            </div>

            <Button onClick={handleResetFilters} variant="outline" className="w-full">
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      </aside>
      
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts?.length} of {products?.length} products
          </p>
        </div>
        
        {filteredProducts?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No products found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredProducts?.map((product) => (
              <Card key={product?.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
                        <Box className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{product?.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          {product?.manufacturer && (
                            <>
                              <Building2 className="h-3 w-3" />
                              {product.manufacturer}
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    {product?.documentType && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {product.documentType}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {product?.description && (
                    <p className="text-sm text-muted-foreground mb-4">
                      {product.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {product?.category && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Category:</span>
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>
                    )}
                    {product?.createdAt && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(product.createdAt), 'MMM d, yyyy')}
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
