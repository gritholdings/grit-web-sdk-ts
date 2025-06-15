'use client';

import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { type User } from '@/app/auth/user';
import { apiClient } from '@/app/components/base/api-client';

import { MoreHorizontalIcon, TrashIcon } from './icons';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/shadcn/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/shadcn/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/app/components/shadcn/ui/sidebar';

export interface Thread {
  id: string;
  sessionId: string;
  role: string;
  content: string | null;
  createdAt: Date;
  title: string;
}

const ThreadItem = ({
  thread,
  isActive,
  onDelete,
  setOpenMobile,
}: {
  thread: Thread;
  isActive: boolean;
  onDelete: (threadId: string) => void;
  setOpenMobile: (open: boolean) => void;
}) => (
  <SidebarMenuItem className="bg-neutral-50 hover:bg-neutral-50">
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={`/threads/${thread.id}`} onClick={() => setOpenMobile(false)}>
        <span>{thread.title}</span>
      </Link>
    </SidebarMenuButton>
    {/* <DropdownMenu modal>
      <DropdownMenuTrigger asChild>
        <SidebarMenuAction
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
          showOnHover={!isActive}
        >
          <MoreHorizontalIcon />
          <span className="sr-only">More</span>
        </SidebarMenuAction>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive"
          onSelect={() => onDelete(thread.id)}
        >
          <TrashIcon />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */}
  </SidebarMenuItem>
);

export function SidebarHistory({ user }: { user: User | undefined }) {
  const { setOpenMobile } = useSidebar();
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // fetch history whenever user or pathname changes
  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        setThreads([]);
        return;
      }
      setIsLoading(true);
      const response = await apiClient.post('/agent/api/threads/list');
      try {
        if (response.status !== 200) {
          setThreads([]);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setThreads([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      const data = response.data;
      const threads = data.memories.map((thread: any) => ({
        id: thread.id,
        title: thread.title,
      }));
      setThreads(threads);
    }
    fetchHistory();
  }, [user, pathname]);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (!deleteId) return;
    const deletePromise = fetch(`/api/chat?id=${deleteId}`, { method: 'DELETE' });

    toast.promise(deletePromise, {
      loading: 'Deleting thread...',
      success: () => {
        // remove from local state
        setThreads((h) => h.filter((c) => c.id !== deleteId));
        // if we're viewing that thread, go home
        if (deleteId === id) router.push('/');
        return 'Chat deleted successfully';
      },
      error: 'Failed to delete chat',
    });

    setShowDeleteDialog(false);
  };

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="text-zinc-500 w-full flex justify-center items-center text-sm">
            Login to save and revisit previous threads.
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="flex flex-col">
            {[44, 32, 28, 64, 52].map((w) => (
              <div key={w} className="rounded-md h-8 flex gap-2 px-2 items-center">
                <div
                  className="h-4 rounded-md flex-1 bg-sidebar-accent-foreground/10"
                  style={{ maxWidth: `${w}%` }}
                />
              </div>
            ))}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  if (threads.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className="text-zinc-500 w-full flex justify-center items-center text-sm">
            Your conversations will appear here once you start chatting.
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
    );
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="bg-neutral-50">
                <div>
                  {threads.map((thread) => (
                    <ThreadItem
                      key={thread.id}
                      thread={thread}
                      isActive={thread.id === id}
                      onDelete={(threadId) => {
                        setDeleteId(threadId);
                        setShowDeleteDialog(true);
                      }}
                      setOpenMobile={setOpenMobile}
                    />
                  ))}
                </div>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your chat.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}