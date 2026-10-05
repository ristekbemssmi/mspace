import { Link, usePage } from '@inertiajs/react';
import { Building2, FileSpreadsheet, HelpCircle, LayoutGrid, Megaphone, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { Auth, NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard Overview',
        href: '/admin/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Biro & Departemen',
        href: '/admin/birdept',
        icon: Building2,
    },
    {
        title: 'Users & Anggota BEM',
        href: '/admin/users',
        icon: Users,
    },
    {
        title: 'Informasi & Beasiswa',
        href: '/admin/informasi',
        icon: Megaphone,
    },
    {
        title: 'FAQ Management',
        href: '/admin/faqs',
        icon: HelpCircle,
    },
    {
        title: 'CSV Import Hub',
        href: '/admin/csv-hub',
        icon: FileSpreadsheet,
    },
];

export function AppSidebar() {
    const role = usePage<{ auth: Auth }>().props.auth.user?.adminRole;
    const visibleNavItems = role === 'admin'
        ? mainNavItems
        : role === 'editor' || role === 'viewer'
          ? mainNavItems.filter((item) => item.href !== '/admin/users' && item.href !== '/admin/csv-hub')
          : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
