"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import axios from "axios";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { SidebarProvider, SidebarTrigger } from "@/app/components/shadcn/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar";

import { Send } from "lucide-react";

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  // Add message state
  const [message, setMessage] = useState('');
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    axios.get(`${baseUrl}/auth/is-authenticated/`, { withCredentials: true })
    .then((response) => {
      console.log(response);
      if (response.data.is_authenticated === true) {
      } else {
        window.location.href = `${baseUrl}/auth/login`;
      }
    })
    .catch(() => {
      window.location.href = `${baseUrl}/auth/login`;
    });
  }, []);

  // Add handleSubmit function
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      client.models.Todo.create({
        content: message,
      });
      setMessage('');
    }
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

          {/* Spacer to push input to bottom */}
          <div className="flex-1"></div>

          {/* Input Area */}
          <div className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="flex items-center bg-zinc-800 rounded-lg p-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
}