import axios, { AxiosResponse } from 'axios';

import apiClient from '@/app/components/base/api-client';

// Type definitions
interface Attachment {
  name: string;
  type: string;
  content: string;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt?: Date;
  attachments?: Attachment[];
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
}

// API client function
const sendMessage = async (
  message: CreateMessage,
  options?: ChatRequestOptions
): Promise<Message> => {
  try {
    console.log('a');
    // const response: AxiosResponse<Message> = await axios.post(
    //   '/api/chat', // Replace with your API endpoint
    //   message,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       ...options?.headers,
    //     },
    //     signal: options?.signal,
    //   }
    // );
    const response = await apiClient.post(`/api/threads/runs`, {
      messages: [{
        role: 'user',
        content: message.content,
      }],
      content: message.content,
      chat_id: body.id, // Use id from body object which contains chatId
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