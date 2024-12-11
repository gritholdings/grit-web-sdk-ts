'use client';

import { SidebarProvider, SidebarTrigger } from "@/app/components/shadcn/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar";
import { useState } from "react";

interface ProfileFormData {
  fullName: string;
  displayName: string;
  workFunction: string;
  showPromptSuggestions: boolean;
  enableArtifacts: boolean;
  enableChatSuggestions: boolean;
}

export default function SettingsPage() {
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    displayName: '',
    workFunction: '',
    showPromptSuggestions: false,
    enableArtifacts: false,
    enableChatSuggestions: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleChange = (name: keyof ProfileFormData) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        {/* <AppSidebar items={[
          { title: "Profile", url: "/settings/profile" },
          { title: "Billing", url: "/settings/billing" }
        ]} /> */}

        {/* Main Content */}
        <div className="flex-1">
          {/* Top Bar with Trigger */}
          <div className="border-b border-gray-700 bg-gray-900 px-4 py-3">
            <SidebarTrigger />
          </div>
          
          {/* Settings Content */}
          <div className="p-8">
            <div className="max-w-2xl space-y-6">
              {/* Name Settings */}
              <div className="rounded-lg bg-gray-800 p-6">
                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium">Full name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">What should we call you?</label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleInputChange}
                      className="w-full rounded bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="rounded bg-orange-700 px-4 py-2 hover:bg-orange-600"
                    >
                      Update Name
                    </button>
                  </div>
                </div>
              </div>

              {/* Work and Preferences */}
              <div className="rounded-lg bg-gray-800 p-6 space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium">What best describes your work?</label>
                  <select
                    name="workFunction"
                    value={formData.workFunction}
                    onChange={handleInputChange}
                    className="w-full rounded bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select your work function</option>
                    <option value="developer">Developer</option>
                    <option value="designer">Designer</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                {/* Toggle Switches */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Show prompt suggestions</h4>
                      <p className="text-sm text-gray-400">
                        We'll show examples of starter prompts you can use based on your role
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleChange('showPromptSuggestions')}
                      className={`relative h-7 w-14 rounded-full p-1 transition-colors duration-200 ease-in-out ${
                        formData.showPromptSuggestions ? 'bg-orange-600' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ease-in-out ${
                          formData.showPromptSuggestions ? 'translate-x-7' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}