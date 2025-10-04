
'use client';

import { Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FilterPanelProps {
  filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
    category?: string;
  };
  onFilterChange: (filters: any) => void;
  statusOptions?: string[];
  categoryOptions?: string[];
  showCategory?: boolean;
}

export function FilterPanel({
  filters,
  onFilterChange,
  statusOptions = ['all', 'active', 'inactive', 'pending'],
  categoryOptions = [],
  showCategory = false,
}: FilterPanelProps) {
  const handleReset = () => {
    onFilterChange({
      startDate: '',
      endDate: '',
      status: 'all',
      category: 'all',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={filters?.status || 'all'}
            onValueChange={(value) => onFilterChange({ ...filters, status: value })}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option?.charAt(0)?.toUpperCase() + option?.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCategory && categoryOptions?.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters?.category || 'all'}
              onValueChange={(value) => onFilterChange({ ...filters, category: value })}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categoryOptions?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="start-date" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Start Date
          </Label>
          <Input
            id="start-date"
            type="date"
            value={filters?.startDate || ''}
            onChange={(e) => onFilterChange({ ...filters, startDate: e?.target?.value })}
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
            onChange={(e) => onFilterChange({ ...filters, endDate: e?.target?.value })}
          />
        </div>

        <Button onClick={handleReset} variant="outline" className="w-full">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  );
}
