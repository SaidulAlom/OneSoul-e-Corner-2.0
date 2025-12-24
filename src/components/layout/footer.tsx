"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Twitter, Instagram, Linkedin, Facebook } from 'lucide-react';
import Logo from '@/components/icons/logo';

const socialLinks = [
  { icon: Twitter, href: '#' },
  { icon: Instagram, href: '#' },
  { icon: Linkedin, href: '#' },
  { icon: Facebook, href: '#' },
];

const footerLinks = [
  {
    title: 'Platform',
    links: [
      { name: 'News', href: '/news' },
      { name: 'Jobs', href: '/jobs' },
      { name: 'Vlogs', href: '/vlogs' },
      { name: 'E-Books', href: '/e-books' },
    ],
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '/about' },
      { name: 'Services', href: '/services' },
      { name: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Privacy Policy', href: '#' },
      { name: 'Terms of Service', href: '#' },
      { name: 'Cookie Policy', href: '#' },
    ],
  },
];

export default function Footer() {
  const pathname = usePathname();
  const isAdminPage = pathname.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return (
    <footer className="relative w-full bg-background border-t py-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="h-10 w-10 text-primary" />
              <span className="font-headline text-2xl font-bold">NexusEd</span>
            </Link>
            <p className="mt-4 text-muted-foreground max-w-xs">
              Your futuristic portal to knowledge, careers, and digital services.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transform hover:-translate-y-1 transition-all duration-300"
                >
                  <social.icon className="h-6 w-6" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-headline text-lg font-semibold text-foreground">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="relative text-muted-foreground hover:text-primary transition-colors group"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} NexusEd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
