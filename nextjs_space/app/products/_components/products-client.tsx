
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchBar } from '@/components/search-bar';
import { LoadingState } from '@/components/loading-state';
import { ErrorMessage } from '@/components/error-message';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Box, FileText, Calendar, Building2, Filter, DollarSign, Package, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Manufacturer {
  id: string;
  name: string;
  website: string;
  category: string | null;
}

interface Product {
  id: string;
  name: string;
  sku?: string;
  category?: string;
  price?: number;
  availability?: string;
  description?: string;
  specifications?: any;
  imageUrl?: string;
  productUrl?: string;
  createdAt: string;
  manufacturer: Manufacturer;
}

export function ProductsClient() {
  const searchParams = useSearchParams();
  const manufacturerIdFromUrl = searchParams?.get('manufacturer');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    manufacturerId: manufacturerIdFromUrl || 'all',
    category: 'all',
    availability: 'all',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    fetchManufacturers();
    fetchProducts();
  }, []);

  useEffect(() => {
    if (manufacturerIdFromUrl) {
      setFilters(prev => ({ ...prev, manufacturerId: manufacturerIdFromUrl }));
    }
  }, [manufacturerIdFromUrl]);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, products]);

  const fetchManufacturers = async () => {
    try {
      const response = await fetch('/api/manufacturers');
      const result = await response?.json();
      
      if (result?.success) {
        setManufacturers(result.data || []);
      }
    } catch (err) {
      console.error('Error fetching manufacturers:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (manufacturerIdFromUrl) {
        params.append('manufacturerId', manufacturerIdFromUrl);
      }
      
      const response = await fetch(`/api/products?${params.toString()}`);
      const result = await response?.json();
      
      if (!result?.success) {
        throw new Error(result?.error || 'Failed to fetch product data');
      }
      
      setProducts(result.data || []);
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
        p?.manufacturer?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        p?.category?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        p?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
        p?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
    
    // Apply manufacturer filter
    if (filters?.manufacturerId && filters?.manufacturerId !== 'all') {
      filtered = filtered?.filter((p) => p?.manufacturer?.id === filters?.manufacturerId);
    }
    
    // Apply category filter
    if (filters?.category && filters?.category !== 'all') {
      filtered = filtered?.filter((p) => p?.category === filters?.category);
    }
    
    // Apply availability filter
    if (filters?.availability && filters?.availability !== 'all') {
      filtered = filtered?.filter((p) => p?.availability === filters?.availability);
    }
    
    // Apply price range filter
    if (filters?.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered?.filter((p) => p?.price && p.price >= minPrice);
    }
    
    if (filters?.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered?.filter((p) => p?.price && p.price <= maxPrice);
    }
    
    setFilteredProducts(filtered);
  };

  const handleResetFilters = () => {
    setFilters({
      manufacturerId: 'all',
      category: 'all',
      availability: 'all',
      minPrice: '',
      maxPrice: '',
    });
  };

  const getAvailabilityBadge = (availability?: string) => {
    if (!availability) return null;
    
    const config: Record<string, { variant: 'default' | 'secondary' | 'destructive', className?: string }> = {
      in_stock: { variant: 'default', className: 'bg-green-500' },
      out_of_stock: { variant: 'secondary' },
      discontinued: { variant: 'destructive' }
    };
    
    const badgeConfig = config[availability] || { variant: 'secondary' };
    
    return (
      <Badge variant={badgeConfig.variant} className={badgeConfig.className}>
        {availability.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return <LoadingState message="Loading products..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Products"
        message={error}
        action={
          <Button onClick={fetchProducts}>
            Try Again
          </Button>
        }
      />
    );
  }

  const categories = Array.from(new Set(products?.map((p) => p?.category)?.filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      {manufacturerIdFromUrl && manufacturers?.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Filtering products from:{' '}
            <span className="font-semibold text-foreground">
              {manufacturers?.find(m => m?.id === manufacturerIdFromUrl)?.name || 'Selected Manufacturer'}
            </span>
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => window.history.pushState({}, '', '/products')}
              className="ml-2"
            >
              Clear filter
            </Button>
          </p>
        </div>
      )}

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
                  value={filters?.manufacturerId || 'all'}
                  onValueChange={(value) => setFilters({ ...filters, manufacturerId: value })}
                >
                  <SelectTrigger id="manufacturer">
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Manufacturers</SelectItem>
                    {manufacturers?.map((manufacturer) => (
                      <SelectItem key={manufacturer?.id} value={manufacturer?.id}>
                        {manufacturer?.name}
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
                <Label htmlFor="availability">Availability</Label>
                <Select
                  value={filters?.availability || 'all'}
                  onValueChange={(value) => setFilters({ ...filters, availability: value })}
                >
                  <SelectTrigger id="availability">
                    <SelectValue placeholder="Select availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Availability</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Min Price
                </Label>
                <Input
                  id="min-price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filters?.minPrice || ''}
                  onChange={(e) => setFilters({ ...filters, minPrice: e?.target?.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-price" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Max Price
                </Label>
                <Input
                  id="max-price"
                  type="number"
                  step="0.01"
                  placeholder="999.99"
                  value={filters?.maxPrice || ''}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e?.target?.value })}
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
                <p className="text-lg font-medium mb-2">No products found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {products?.length === 0 
                    ? "No products have been extracted yet. Go to Manufacturers to start extracting product data."
                    : "Try adjusting your search or filters"}
                </p>
                {products?.length === 0 && (
                  <Link href="/manufacturers">
                    <Button>
                      <Building2 className="mr-2 h-4 w-4" />
                      Go to Manufacturers
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredProducts?.map((product) => (
                <Card key={product?.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center shrink-0">
                          <Package className="h-6 w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-xl">{product?.name}</CardTitle>
                          <CardDescription className="flex flex-col gap-1 mt-1">
                            <Link href={`/manufacturers`} className="flex items-center gap-2 hover:underline">
                              <Building2 className="h-3 w-3 shrink-0" />
                              <span>{product?.manufacturer?.name}</span>
                            </Link>
                            {product?.sku && (
                              <span className="text-xs">SKU: {product.sku}</span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end shrink-0 ml-4">
                        {product?.price && (
                          <Badge variant="outline" className="font-semibold">
                            ${product.price.toFixed(2)}
                          </Badge>
                        )}
                        {getAvailabilityBadge(product?.availability)}
                      </div>
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
                    {product?.specifications && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm font-semibold mb-2">Specifications:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex gap-2">
                              <span className="text-muted-foreground">{key}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {product?.productUrl && (
                      <div className="mt-4">
                        <a 
                          href={product.productUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View on manufacturer's website
                        </a>
                      </div>
                    )}
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
