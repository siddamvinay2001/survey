'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Blockchain01Icon,
  Menu01Icon,
  Cancel01Icon,
  Sun02Icon,
  Moon02Icon,
} from '@hugeicons/core-free-icons';
import { Button } from '@survey/ui/components/button';
import { cn } from '@survey/ui/lib/utils';
import { WalletButton } from '@/components/wallet-button';

interface NavLinkProps {
  href: string;
  label: string;
  pathname: string;
}

function NavLink({ href, label, pathname }: NavLinkProps) {
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        'text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm px-1',
        isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
      )}
    >
      {label}
    </Link>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      variant="ghost"
      className="h-8 w-8 p-0"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <HugeiconsIcon
        icon={isDark ? Sun02Icon : Moon02Icon}
        size={16}
        strokeWidth={1.5}
        aria-hidden="true"
      />
    </Button>
  );
}

const NAV_LINKS = [
  { href: '/surveys', label: 'Browse' },
  { href: '/create', label: 'Create' },
  { href: '/dashboard', label: 'Dashboard' },
] as const;

export function NavBar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background">
      <nav
        className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:text-foreground/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          <HugeiconsIcon
            icon={Blockchain01Icon}
            size={18}
            strokeWidth={1.5}
            className="text-primary"
            aria-hidden="true"
          />
          Survey
        </Link>

        {/* Desktop links */}
        <div className="hidden sm:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} pathname={pathname} {...link} />
          ))}
          <ThemeToggle />
          <WalletButton />
        </div>

        {/* Mobile: theme + wallet + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <WalletButton />
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <HugeiconsIcon
              icon={mobileOpen ? Cancel01Icon : Menu01Icon}
              size={18}
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="sm:hidden border-t border-border bg-background px-4 py-4 flex flex-col gap-4"
          role="menu"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={() => setMobileOpen(false)}
              className={cn(
                'text-sm py-1 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm',
                pathname === link.href || pathname.startsWith(link.href)
                  ? 'text-foreground font-medium'
                  : 'text-muted-foreground',
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
