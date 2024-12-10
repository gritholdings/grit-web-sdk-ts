import { ComponentProps } from 'react';

import { SidebarTrigger, useSidebar } from '@/app/components/shadcn/ui/sidebar';
import { BetterTooltip } from '@/app/components/shadcn/ui/tooltip';
import { cn } from '@/app/components/shadcn/lib/utils';

import { SidebarLeftIcon } from './icons';
import { Button } from '@/app/components/shadcn/ui/button';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar } = useSidebar();

  return (
    <BetterTooltip content="Toggle Sidebar" align="start">
      <Button
        onClick={toggleSidebar}
        variant="outline"
        className="md:px-2 md:h-fit"
      >
        <SidebarLeftIcon size={16} />
      </Button>
    </BetterTooltip>
  );
}
