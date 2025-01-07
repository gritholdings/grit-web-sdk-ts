'use client';

import { startTransition, useMemo, useState } from 'react';

import { models, saveModelId } from '@/app/components/base/models';
import { Button } from '@/app/components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/shadcn/ui/dropdown-menu';
import { cn } from '@/app/components/base/utils/utils';

import { CheckCirclFillIcon, ChevronDownIcon } from './icons';

export function ModelSelector({
  selectedModelId,
  onModelSelect,
  className,
  ...buttonProps
}: {
  selectedModelId: string;
  onModelSelect: (modelId: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  // which model is currently "selected" according to the parent
  const selectedModel = useMemo(
    () => models.find((m) => m.id === selectedModelId),
    [selectedModelId]
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className
        )}
      >
        <Button variant="outline" className="md:px-2 md:h-[34px] flex items-center gap-1" {...buttonProps}>
          {selectedModel?.label ?? 'Choose Model'}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {models.map((model) => {
          const isActive = model.id === selectedModelId;
          return (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => {
                setOpen(false);
                startTransition(() => {
                  // Let the parent update the "selectedModelId"
                  onModelSelect(model.id);
                  // Optionally persist anywhere you like
                  saveModelId(model.id);
                });
              }}
              className="gap-4 flex flex-row justify-between items-center"
              data-active={isActive}
            >
              <div className="flex flex-col gap-1 items-start">
                {model.label}
                {model.description && (
                  <div className="text-xs text-muted-foreground">
                    {model.description}
                  </div>
                )}
              </div>
              {isActive && (
                <div className="text-primary dark:text-primary-foreground">
                  <CheckCirclFillIcon />
                </div>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}