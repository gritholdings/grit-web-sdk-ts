"use client";

import React from 'react';
import { useState, useEffect, useRef } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import axios from "axios";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { SidebarProvider } from "@/app/components/shadcn/ui/sidebar";
import { AppSidebar } from "@/app/components/app-sidebar";
import { Send } from "lucide-react";
import { Chat } from "@/app/components/chat";

// Configure Amplify once
Amplify.configure(outputs);
const amplifyClient = generateClient<Schema>();

interface ChatMessage {
  content: string;
  timestamp: Date;
}

interface AuthResponse {
  is_authenticated: boolean;
}

interface AppProps {}

const App: React.FC<AppProps> = () => {
  const [message, setMessage] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const baseUrl: string = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const checkAuthentication = async (): Promise<void> => {
      try {
        const response = await axios.get<AuthResponse>(
          `${baseUrl}/auth/is-authenticated/`,
          { withCredentials: true }
        );
        
        console.log(response);
        if (response.data.is_authenticated) {
          console.log('User authenticated');
        } else {
          window.location.href = `${baseUrl}/auth/login`;
        }
      } catch (error) {
        window.location.href = `${baseUrl}/auth/login`;
      }
    };

    checkAuthentication();
  }, [baseUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (message.trim()) {
      // Log the message to console
      console.log(message);

      // Add message to chat history
      const newMessage: ChatMessage = {
        content: message,
        timestamp: new Date()
      };
      setChatMessages((prevMessages) => [...prevMessages, newMessage]);

      try {
        // Save to Todo model
        await amplifyClient.models.Todo.create({
          content: message,
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }

      setMessage('');
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setMessage(e.target.value);
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-zinc-900 w-full">
        {/* Sidebar */}
        <AppSidebar />
        <Chat id={''} initialMessages={[]} selectedModelId={''} />
      </div>
    </SidebarProvider>
  );
};

export default App;