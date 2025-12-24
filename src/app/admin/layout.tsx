'use client';

import Link from 'next/link';
import {
  Home,
  Newspaper,
  Briefcase,
  Play,
  BookOpen,
  Layers,
  Settings,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarProvider,
  SidebarInset,
} from '@/components/ui/sidebar';
import Logo from '@/components/icons/logo';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 group-data-[collapsible=icon]:justify-center">
            <Logo className="size-8" />
            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">
              NexusEd Admin
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/admin" isActive={pathname === '/admin'}>
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/admin/news"
                isActive={pathname.startsWith('/admin/news')}
              >
                <Newspaper />
                <span>News</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/admin/jobs"
                isActive={pathname.startsWith('/admin/jobs')}
              >
                <Briefcase />
                <span>Jobs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/admin/vlogs"
                isActive={pathname.startsWith('/admin/vlogs')}
              >
                <Play />
                <span>Vlogs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/admin/ebooks"
                isActive={pathname.startsWith('/admin/ebooks')}
              >
                <BookOpen />
                <span>E-Books</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                href="/admin/services"
                isActive={pathname.startsWith('/admin/services')}
              >
                <Layers />
                <span>Services</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
