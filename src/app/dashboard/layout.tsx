import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ModeToggle";
import "nextjs-toast-notify/dist/nextjs-toast-notify.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative h-screen w-full">
        {/* Contenedor del Header */}
        <div className="flex items-center h-20 px-6 ">
          {/* Ícono de menú + Título alineados */}
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-2xl font-bold text-primary">
              Bienvenido
            </h1>
            <ModeToggle />
          </div>
        </div>

        {/* Contenedor Principal */}
        <div className="container px-5 w-full mt-[25px] ml-[20px]">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}