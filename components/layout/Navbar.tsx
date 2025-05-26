'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Code } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-8',
        isScrolled
          ? 'bg-background/90 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
        <img src="/icon.svg" alt="Ebrojevi Icon" className="h-[3rem] w-[3rem]" />
          <span className="text-xl font-medium text-white">Ebrojevi</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </div>

        {/* Mobile Navigation Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md mt-4 px-6 py-4 rounded-md shadow-md">
          <div className="flex flex-col space-y-4">
            <NavLinks mobile onClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLinks = ({
  mobile = false,
  onClick,
}: {
  mobile?: boolean;
  onClick?: () => void;
}) => {
  const links = [
    { name: 'Početna', href: '/' },
    { name: 'Baza Ebrojeva', href: '/database' },
    { name: 'Ručni upis', href: '/manual-input' },
  ];

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className={cn(
            'text-muted-foreground hover:text-white transition-colors',
            mobile ? 'text-base py-1' : 'text-sm'
          )}
          onClick={onClick}
        >
          {link.name}
        </Link>
      ))}
      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'text-muted-foreground hover:text-white transition-colors',
          mobile ? 'text-base py-1' : 'text-sm'
        )}
        onClick={onClick}
      >
        GitHub
      </a>
    </>
  );
};

export default Navbar;