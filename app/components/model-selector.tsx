'use client';

import { startTransition, useMemo, useState, useEffect } from 'react';

import { Button } from '@/app/components/shadcn/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/app/components/shadcn/ui/dropdown-menu';
import { cn } from '@/app/components/base/utils/utils';
import { CheckCirclFillIcon, ChevronDownIcon } from './icons';
import { apiClient } from '@/app/components/base/api-client';
import { ModelOptions } from './chat';

export function ModelSelector({
  setSelectedModelOptions,
  className,
  ...buttonProps
}: {
  setSelectedModelOptions: (options: ModelOptions) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState<Array<any>>([]);
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  // Determine the selected model; fallback to first option if none selected.
  const selectedModel = useMemo(() => {
    if (selectedModelId) {
      return models.find((m) => m.id === selectedModelId);
    }
    return models[0];
  }, [models, selectedModelId]);

  useEffect(() => {
    async function fetchModels() {
      try {
        const response = await apiClient.post(`/api/models`, {});
        if (response.status !== 200) {
          throw new Error('Failed to fetch models');
        }
        const fetchedModels = response.data.models;
        setModels(fetchedModels);

        // If no model is yet selected (or you want to force selection),
        // set the parent to the first model
        if (fetchedModels.length > 0 && !selectedModelId) {
          setSelectedModelId(fetchedModels[0].id);
          setSelectedModelOptions({
            modelId: fetchedModels[0].id,
            suggestedMessages: fetchedModels[0].suggested_messages,
            overviewHtml: fetchedModels[0].overview_html
          });
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchModels();
  }, []);

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
      <DropdownMenuContent align="start" className="min-w-[300px] bg-white">
        {models.map((model) => {
          const isActive = model.id === selectedModelId;
          return (
            <DropdownMenuItem
              key={model.id}
              onSelect={() => {
                setOpen(false);
                startTransition(() => {
                  setSelectedModelId(model.id);
                  setSelectedModelOptions({
                    modelId: model.id,
                    suggestedMessages: model.suggested_messages,
                    overviewHtml: model.overview_html
                  });
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