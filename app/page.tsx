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

Amplify.configure(outputs);

const client = generateClient<Schema>();

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    axios.get(`${baseUrl}/auth/is-authenticated/`, { withCredentials: true })
    .then((response) => {
      console.log(response);
      if (response.data.is_authenticated === true) {
        listTodos();
      } else {
        window.location.href = `${baseUrl}/auth/login`;
      }
    })
    .catch(() => {
      window.location.href = `${baseUrl}/auth/login`;
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
      </main>
    </SidebarProvider>
  );
}
