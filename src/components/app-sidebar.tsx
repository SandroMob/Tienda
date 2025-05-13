"use client";
import { Home, User, Upload, ArrowLeftFromLineIcon as CerrarSesionIcon } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSession, signOut } from "next-auth/react";

export function AppSidebar() {
    const {data : session} = useSession();

    const items = [
        {
        title: "Home",
        url: "/dashboard",
        icon: Home,
        },
        {
        title: "Perfil",
        url: "/dashboard/perfil",
        icon: User,
        },
        // {
        // title: "Productos",
        // url: "/dashboard/mantendor-producto",
        // icon: Upload,
        // },
    ];

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarHeader>
            <SidebarMenu >
                <SidebarMenuItem title={session?.user?.email || ""} aria-disabled>
                    <SidebarMenuButton  aria-disabled>
                        <User className="w-6 h-6 text-gray-500" />
                        <span>{session?.user?.email}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem title="Cerrar Sesión" aria-disabled>
                <SidebarMenuButton onClick={() => {signOut()}}>
                    <CerrarSesionIcon fontSize="22px"/>
                    <span>Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
            </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
