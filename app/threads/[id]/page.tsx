"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { SidebarProvider } from "@/app/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { Chat } from "@/app/components/chat";
import { apiClient } from '@/app/components/base/api-client';
import { Message } from '@/app/components/base/chat-api';
import { type User } from '@/app/auth/user';

export default function ThreadPage() {
  const { id } = useParams() as { id: string };
  const [user, setUser] = useState<User>({ id: '', email: '' });
  const [initialMessages, setInitialMessages] = useState<Message[] | null>(null);

  useEffect(() => {
    async function loadMessages() {
      if (!id) return;
      try {
        const response = await apiClient.post(`/api/threads/`, {
          thread_id: id,
        });
        if (response.status === 401) {
          throw new Error('Failed to view thread');
        }
        setInitialMessages(response.data.messages);
      } catch (error) {
        console.error('Failed to fetch thread messages:', error);
        setInitialMessages([]);
      }
    }
    loadMessages();
  }, [id]);

  if (initialMessages === null) {
    return <div>Loading…</div>;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar user={user} />
        <Chat id={id} initialMessages={initialMessages} />
      </div>
    </SidebarProvider>
  );
}
