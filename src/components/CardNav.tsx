"use client";
import React, { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';

type CardNavLink = {
  label: string;
  href: string;
};

export interface CardNavProps {
  logo: React.ReactNode;
  items: CardNavLink[];
  className?: string;
  loginButton?: React.ReactNode;
  themeChanger?: React.ReactNode;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  items,
  className = '',
  loginButton,
  themeChanger,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 ${className}`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold">{logo}</div>
          <div className="hidden md:flex items-center gap-6">
            {items.slice(0, 4).map((item) => (
              <a key={item.label} href={item.href} className="text-sm font-medium hover:text-primary transition-colors">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 text-sm bg-muted rounded-md w-48"
            />
          </div>
          {loginButton}
          {themeChanger}
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-4">
          {items.slice(0, 4).map((item) => (
            <a key={item.label} href={item.href} className="block text-sm font-medium hover:text-primary transition-colors">
              {item.label}
            </a>
          ))}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 text-sm bg-muted rounded-md w-full"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            {loginButton}
            {themeChanger}
          </div>
        </div>
      )}
    </nav>
  );
};

export default CardNav;
