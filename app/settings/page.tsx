import { SidebarProvider, SidebarTrigger } from "@/app/components/shadcn/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar";

export default function SettingsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div>This is setting</div>
      </main>
    </SidebarProvider>
  );
}