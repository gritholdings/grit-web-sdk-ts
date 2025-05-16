"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from 'next/navigation';
import { SidebarProvider } from "@/app/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { Chat } from "@/app/components/chat";
import { type User } from '@/app/auth/user';


export default function ThreadPage() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<User>({id: '', email: ''});
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar user={user} />
        <Chat id={id} initialMessages={[]} />
      </div>
    </SidebarProvider>
  );
}