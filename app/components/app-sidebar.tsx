'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type User } from '@/app/auth/user';

import { PlusIcon } from '@/app/components/icons';
import { SidebarHistory } from '@/app/components/sidebar-history';
import { SidebarUserNav } from '@/app/components/sidebar-user-nav';
import { Button } from '@/app/components/shadcn/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/app/components/shadcn/ui/sidebar';
import { BetterTooltip } from '@/app/components/shadcn/ui/tooltip';
import { AppConfig } from '@/agent-app/configs';

export function AppSidebar({ user }: {user: User}) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu className="bg-neutral-50">
          <div className="flex flex-row justify-between items-center">
            <div
              onClick={() => {
                setOpenMobile(false);
                router.push('/');
                router.refresh();
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                {AppConfig.APP_NAME}
              </span>
            </div>
            <BetterTooltip content="New Chat" align="start">
              <Button
                variant="ghost"
                className="p-2 h-fit border-none"
                onClick={() => {
                  setOpenMobile(false);
                  router.push('/');
                  router.refresh();
                  window.location.href = '/';
                }}
              >
                <PlusIcon />
              </Button>
            </BetterTooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHistory user={user} />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-0">
        {user && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarUserNav user={user} />
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
