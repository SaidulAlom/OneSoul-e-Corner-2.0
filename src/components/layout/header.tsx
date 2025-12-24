"use client";

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, BookOpen, Briefcase, Newspaper, Home, Play, Layers, Info, Phone } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Logo from '@/components/icons/logo';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'News', href: '/news', icon: Newspaper },
  { name: 'Jobs', href: '/jobs', icon: Briefcase },
  { name: 'Vlogs', href: '/vlogs', icon: Play },
  { name: 'E-Books', href: '/e-books', icon: BookOpen },
  { name: 'Services', href: '/services', icon: Layers },
  { name: 'About', href: '/about', icon: Info },
  { name: 'Contact', href: '/contact', icon: Phone },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const showAuthButtons = !pathname.startsWith('/admin') && pathname !== '/login';

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          'py-4'
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex items-center justify-between rounded-full bg-black/30 backdrop-blur-lg border border-white/10 px-4 py-2 shadow-2xl shadow-primary/10">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-8 w-8 animate-[breathe_4s_ease-in-out_infinite]" />
              <span className="font-headline text-xl font-bold text-white">
                NexusEd
              </span>
            </Link>

            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink key={item.name} href={item.href} isActive={pathname === item.href}>
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center">
              {showAuthButtons && (
                <>
                  <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex text-white hover:bg-white/10 hover:text-white">
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" className="hidden md:inline-flex ml-2 bg-primary/80 hover:bg-primary text-primary-foreground rounded-full shadow-[0_0_15px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.6)] transition-shadow">
                    Sign Up
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:bg-white/10 hover:text-white"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto px-4 h-full">
              <div className="flex justify-between items-center py-4">
                 <Link href="/" className="flex items-center space-x-2" onClick={toggleMobileMenu}>
                    <Logo className="h-8 w-8" />
                    <span className="font-headline text-xl font-bold text-foreground">
                      NexusEd
                    </span>
                  </Link>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Close menu">
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col items-center justify-center h-[calc(100%-100px)] -mt-8">
                <ul className="space-y-8 text-center">
                  {navItems.map((item, i) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link
                        href={item.href}
                        onClick={toggleMobileMenu}
                        className={cn("flex items-center gap-4 text-3xl font-headline transition-colors", pathname === item.href ? "text-primary" : "text-foreground/80 hover:text-primary")}
                      >
                        <item.icon className="h-8 w-8" />
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                {showAuthButtons && (
                  <div className="absolute bottom-16 flex gap-4">
                    <Button asChild variant="outline" size="lg">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button size="lg" className="bg-primary/80 hover:bg-primary text-primary-foreground rounded-full shadow-[0_0_15px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_25px_hsl(var(--primary)/0.6)] transition-shadow">
                      Sign Up
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const NavLink = ({ href, children, isActive }: { href: string; children: React.ReactNode; isActive: boolean }) => {
  return (
    <Link
      href={href}
      className={cn(
        "relative group px-3 py-2 text-sm font-medium hover:text-white transition-colors duration-300",
        isActive ? "text-white" : "text-slate-300"
      )}
    >
      <span className="relative z-10">
        {children}
      </span>
      {isActive && (
         <motion.span 
            layoutId="nav-underline"
            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary" 
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};
