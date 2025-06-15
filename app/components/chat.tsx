'use client';

import { Attachment, Message } from '@/app/components/base/chat-api';
import { useChat } from '@/app/components/base/ai-react';
import { AnimatePresence } from 'framer-motion';
import { Dispatch, useState, SetStateAction, useRef, useEffect } from 'react';
import { useWindowSize } from 'usehooks-ts';

import { ChatHeader } from './chat-header';
import { PreviewMessage, ThinkingMessage } from './message';
import { useScrollToBottom } from './use-scroll-to-bottom';
import { fetcher } from '@/app/components/shadcn/lib/utils';

import { Block, UIBlock } from './block';
// import { BlockStreamHandler } from './block-stream-handler';
import { MultimodalInput } from './multimodal-input';
import { Overview } from './overview';

import { apiClient } from '@/app/components/base/api-client';

export interface ModelOptions {
  modelId: string;
  suggestedMessages: Array<string>;
  overviewHtml: string;
}

export function Chat({
  id,
  initialMessages,
}: {
  id: string;
  initialMessages: Array<Message>;
}) {
  // Initialize threadIdRef with the passed-in id prop
  const threadIdRef = useRef<string>(id);

  // Update threadIdRef whenever the id prop changes
  useEffect(() => {
    threadIdRef.current = id;
  }, [id]);

  const createThread = async (): Promise<string> => {
    try {
      const response = await apiClient.post('/agent/api/threads/create');
      if (response.status !== 201) {
        throw new Error('Failed to create thread');
      }
      return response.data.thread_id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create thread');
    }
  };

  const ensureThreadExists = async () => {
    // If no threadId is available, create one
    if (!threadIdRef.current) {
      const newThreadId = await createThread();
      threadIdRef.current = newThreadId;
    }
    return threadIdRef.current;
  };

  const { width: windowWidth = 1920, height: windowHeight = 1080 } =
    useWindowSize();

  const [block, setBlock] = useState<UIBlock>({
    documentId: 'init',
    content: '',
    title: '',
    status: 'idle',
    isVisible: false,
    boundingBox: {
      top: windowHeight / 4,
      left: windowWidth / 4,
      width: 250,
      height: 50,
    },
  });

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [attachments, setAttachments] = useState<Array<Attachment>>([]);
  const [selectedModelOptions, setSelectedModelOptions] = useState<ModelOptions>({
    modelId: '',
    suggestedMessages: [],
    overviewHtml: '',
  });

  const {
    messages,
    setMessages,
    handleSubmit,
    input,
    setInput,
    append,
    isLoading,
    stop,
    data: streamingData,
  } = useChat({
    modelId: selectedModelOptions.modelId,
    initialMessages,
    onFinish: () => {
      // mutate('/api/history');
    },
    ensureThreadExists
  });

  return (
    <>
      <div className="flex flex-col min-w-0 h-dvh bg-background w-full">
        <ChatHeader
          setSelectedModelOptions={setSelectedModelOptions}
        />
        <div
          ref={messagesContainerRef}
          className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
        >
          {messages.length === 0 &&
            <Overview
              overviewHtml={selectedModelOptions.overviewHtml}
            />
          }

          {messages.map((message, index) => (
            <PreviewMessage
              key={message.id}
              chatId={id}
              message={message}
              block={block}
              setBlock={setBlock}
              isLoading={isLoading && messages.length - 1 === index}
            />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1].role === 'user' && (
              <ThinkingMessage />
            )}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>
        <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
          <MultimodalInput
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            messages={messages}
            setMessages={setMessages}
            append={append}
            suggestedMessages={selectedModelOptions.suggestedMessages}
            ensureThreadExists={ensureThreadExists}
          />
        </form>
      </div>

      <AnimatePresence>
        {block && block.isVisible && (
          <Block
            chatId={id}
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={stop}
            attachments={attachments}
            setAttachments={setAttachments}
            append={append}
            block={block}
            setBlock={setBlock}
            messages={messages}
            setMessages={setMessages}
            suggestedMessages={selectedModelOptions.suggestedMessages}
            ensureThreadExists={ensureThreadExists}
          />
        )}
      </AnimatePresence>
    </>
  );
}
