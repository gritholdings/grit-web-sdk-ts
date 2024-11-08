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
        
        {/* Right Column: Chat Interface */}
        <div className="flex-1 flex flex-col bg-zinc-900 min-h-screen">
          {/* Chat Header */}
          <div className="p-8">
            <h1 className="text-white text-2xl">
              What can I help with?
            </h1>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4">
            <div className="space-y-4">
              {chatMessages.map((msg, index) => (
                <div key={index} className="bg-zinc-800 rounded-lg p-4">
                  <p className="text-white">{msg.content}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    {msg.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center bg-zinc-800 rounded-lg p-2">
                <input
                  type="text"
                  value={message}
                  onChange={handleMessageChange}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none px-2"
                />
                <button
                  type="submit"
                  className="p-2 hover:bg-zinc-700 rounded-full transition-colors"
                >
                  <Send className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default App;