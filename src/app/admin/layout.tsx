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
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';

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
import AuthGuard from '@/components/admin/auth-guard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <AuthGuard>
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
              <SidebarMenuItem>
                <button
                  onClick={handleLogout}
                  className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 h-8 text-sm"
                >
                  <LogOut />
                  <span>Logout</span>
                </button>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="pt-0">{children}</SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  );
}
