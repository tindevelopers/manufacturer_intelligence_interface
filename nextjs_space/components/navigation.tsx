

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Factory, Package, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/manufacturers', label: 'Manufacturers', icon: Factory },
  { href: '/products', label: 'Products', icon: Package },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl flex h-16 items-center px-4">
        <div className="flex items-center gap-2 mr-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">MI</span>
          </div>
          <span className="font-semibold text-lg hidden sm:inline">Manufacturer Intelligence</span>
        </div>
        
        <nav className="flex items-center gap-1 flex-1">
          {navItems?.map((item) => {
            const Icon = item?.icon;
            const isActive = pathname === item?.href;
            
            return (
              <Link
                key={item?.href}
                href={item?.href ?? '/'}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {Icon && <Icon className="h-4 w-4" />}
                {item?.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

