'use client';

import { Dispatch, SetStateAction } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/app/components/model-selector';
import { SidebarToggle } from '@/app/components/sidebar-toggle';
import { Button } from '@/app/components/shadcn/ui/button';
import { BetterTooltip } from '@/app/components/shadcn/ui/tooltip';

import { PlusIcon, VercelIcon } from './icons';
import { useSidebar } from '@/app/components/shadcn/ui/sidebar';
import { ModelOptions } from './chat';

export function ChatHeader({
    setSelectedModelOptions
  }: {
    setSelectedModelOptions: Dispatch<SetStateAction<ModelOptions>>;
  }) {
  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  return (
    <header className="flex sticky top-0 bg-background py-1.5 items-center px-2 md:px-2 gap-2">
      <SidebarToggle />
      {(!open || windowWidth < 768) && (
        <BetterTooltip content="New Chat">
          <Button
            variant="outline"
            className="order-2 md:order-1 md:px-2 px-2 md:h-fit ml-auto md:ml-0"
            onClick={() => {
              router.push('/');
              router.refresh();
              window.location.href = '/';
            }}
          >
            <PlusIcon />
            <span className="md:sr-only">New Chat</span>
          </Button>
        </BetterTooltip>
      )}
      <ModelSelector
        setSelectedModelOptions={setSelectedModelOptions}
        className="order-1 md:order-2"
      />
    </header>
  );
}
