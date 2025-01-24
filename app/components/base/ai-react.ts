import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { Message, CreateMessage } from '@/app/components/base/chat-api';

import { apiClient, baseUrl, getCookie } from '@/app/components/base/api-client';

interface UseChatOptions {
  initialMessages?: Message[];
  body?: Record<string, any>;
  onFinish?: () => void;
  chatId: string;
  modelId: string;
}

export const createThread = async (): Promise<string> => {
  try {
    const response = await apiClient.post('/api/threads/create');
    if (response.status !== 201) {
      throw new Error('Failed to create thread');
    }
    return response.data.thread_id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw new Error('Failed to create thread');
  }
};


export function useChat({ initialMessages = [], body = {}, onFinish, modelId }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingData, setStreamingData] = useState<any>(null);
  const [currentThreadId, setCurrentThreadId] = useState('');

  // Initialize thread on component mount if there are initial messages
  useEffect(() => {
    const initializeThread = async () => {
      if (initialMessages.length > 0 && !currentThreadId) {
        const newThreadId = await createThread();
        setCurrentThreadId(newThreadId);
      }
    };
    
    initializeThread();
  }, [initialMessages.length, currentThreadId]);

  const append = useCallback(async (message: CreateMessage) => {
    try {
      setIsLoading(true);

      let threadId = currentThreadId;
      if (!threadId) {
        threadId = await createThread();
        setCurrentThreadId(threadId);
      }

      // Add user message
      setMessages(prevMessages => [...prevMessages, { 
        ...message, 
        id: Date.now().toString(),
        role: message.role || 'user'
      }]);

      const response = await fetch(baseUrl + "/api/threads/runs", {
        method: "POST",
        credentials: "include",
        headers: new Headers({
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || ""
        }),
        body: JSON.stringify({
          message: message.content,
          thread_id: threadId,
          content: message.content,
          chat_id: body.id,
          model_id: modelId,
          attachments: message.attachments
        })
      });

      // Format assistant message
      const newAssistantMessageId = Date.now().toString();
      const assistantMessage: Message = {
        id: newAssistantMessageId,
        role: 'assistant',
        content: ''
      };

      // Set an initial empty assistant response
      setMessages(prevMessages => [...prevMessages, assistantMessage]);

      // Read the streaming response using a ReadableStream reader
      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      let done = false;

      while (!done) {
        const result = await reader?.read();
        const { value, done: readerDone } = result || {};
        done = readerDone ?? true;
        if (value) {
          // Decode the current chunk
          const chunkValue = decoder.decode(value, { stream: true });
          // Append it to the existing text
          setMessages(prevMessages =>
            prevMessages.map(message =>
              message.id === newAssistantMessageId
                ? { ...message, content: message.content + chunkValue }
                : message
            )
          );
        }
      }
      
      // setStreamingData(response.data.streamingData);
      onFinish?.();
      return assistantMessage.id;

    } catch (error) {
      console.error('Chat API error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [body.id, messages, onFinish]);

  const handleSubmit = useCallback(
    (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.();
      if (!input.trim() || isLoading) return;
  
      const userMessage = {
        id: Date.now().toString(),
        role: 'user' as const,
        content: input
      };
  
      setInput('');
      return append(userMessage);
    },
    [input, isLoading, append, setInput]
  );



  const stop = useCallback(() => {
    // Implement cancel logic here if needed
    setIsLoading(false);
  }, []);

  return {
    messages,
    setMessages,
    input,
    setInput,
    handleSubmit,
    append,
    isLoading,
    stop,
    data: streamingData,
    currentThreadId,
    setCurrentThreadId
  };
}

export function Chat({
  id,
  initialMessages,
  selectedModelId,
}: {
  id: string;
  initialMessages: Array<Message>;
  selectedModelId: string;
}) {
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
    chatId: id,
    modelId: selectedModelId,
    body: { id, modelId: selectedModelId },
    initialMessages
  });
}