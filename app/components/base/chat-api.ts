import axios, { AxiosResponse } from 'axios';

import { apiClient } from '@/app/components/base/api-client';

// Type definitions
interface Attachment {
  url: string;
  name: string;
  type: string;
  content: string;
  contentType: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt?: Date;
  attachments?: Attachment[];
  experimental_attachments?: Attachment[];
}

interface CreateMessage {
  id?: string;
  content: string;
  role?: 'user' | 'assistant';
  createdAt?: Date;
  attachments?: Attachment[];
}

interface ChatRequestOptions {
  headers?: Record<string, string>;
  body?: any;
  signal?: AbortSignal;
  experimental_attachments?: Attachment[];
}

// API client function
const sendMessage = async (
  message: CreateMessage,
  options?: ChatRequestOptions
): Promise<Message> => {
  // unused
  try {
    const response = await apiClient.post(`/agent/api/threads/runs`, {
      message: message.content,
      content: message.content,
      chat_id: message.id, // Use id from message object which contains chatId
      attachments: message.attachments
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
      } else if (error.request) {
        throw new Error('Network Error: No response received from server');
      }
    }
    throw new Error('An unexpected error occurred');
  }
};

// Usage example with React hooks
const useChatApi = () => {
  const sendChatMessage = async (
    content: string,
    attachments?: Attachment[],
    options?: ChatRequestOptions
  ) => {
    const message: CreateMessage = {
      id: crypto.randomUUID(),
      content,
      role: 'user',
      createdAt: new Date(),
      attachments,
    };

    return await sendMessage(message, options);
  };

  return { sendChatMessage };
};

export { sendMessage, useChatApi };
export type { Attachment, Message, CreateMessage, ChatRequestOptions };