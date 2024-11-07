'use client';

import { SidebarProvider, SidebarTrigger } from "@/app/components/shadcn/ui/sidebar"
import { AppSidebar } from "@/app/components/app-sidebar";
import { useState } from "react";
import { Input } from "@/app/components/shadcn/ui/input";
import { Label } from "@/app/components/shadcn/ui/label";
import { CreditCard, Calendar, Lock } from 'lucide-react';

interface BillingFormData {
    planType: string;
    billingCycle: 'monthly' | 'yearly';
    cardNumber: string;
    expiryDate: string;
    cvc: string;
    cardholderName: string;
  }
  
  export default function BillingPage() {
    const [billingData, setBillingData] = useState<BillingFormData>({
      planType: '',
      billingCycle: 'monthly',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
      cardholderName: ''
    });
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setBillingData(prev => ({
        ...prev,
        [name]: value
      }));
    };
  
    return (
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar items={[
            { title: "Profile", url: "/settings/profile" },
            { title: "Billing", url: "/settings/billing" }
          ]} />
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar with Trigger */}
            <div className="border-b border-gray-700 bg-gray-900 px-4 py-3">
              <SidebarTrigger />
            </div>
            
            {/* Settings Content */}
            <div className="p-8">
              <div className="max-w-2xl space-y-6">
                {/* Billing Information */}
                <div className="rounded-lg bg-gray-800 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Billing Information</h2>
                  <div className="space-y-4">
                    {/* Plan Selection */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">Plan Type</label>
                      <select
                        name="planType"
                        value={billingData.planType}
                        onChange={handleInputChange}
                        className="w-full rounded bg-gray-700 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        <option value="">Select a plan</option>
                        <option value="basic">Basic Plan</option>
                        <option value="pro">Pro Plan</option>
                        <option value="enterprise">Enterprise Plan</option>
                      </select>
                    </div>
  
                    {/* Billing Cycle */}
                    <div>
                      <label className="mb-2 block text-sm font-medium">Billing Cycle</label>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => setBillingData(prev => ({ ...prev, billingCycle: 'monthly' }))}
                          className={`rounded px-4 py-2 ${
                            billingData.billingCycle === 'monthly' 
                              ? 'bg-orange-600' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingData(prev => ({ ...prev, billingCycle: 'yearly' }))}
                          className={`rounded px-4 py-2 ${
                            billingData.billingCycle === 'yearly' 
                              ? 'bg-orange-600' 
                              : 'bg-gray-700 hover:bg-gray-600'
                          }`}
                        >
                          Yearly
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* Payment Method Form */}
                <div className="rounded-lg bg-gray-800 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <div className="relative">
                        <Input 
                          id="cardNumber"
                          name="cardNumber"
                          value={billingData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          className="pl-10 bg-gray-700 border-gray-600 focus:ring-orange-500"
                        />
                        <CreditCard className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <div className="relative">
                          <Input 
                            id="expiryDate"
                            name="expiryDate"
                            value={billingData.expiryDate}
                            onChange={handleInputChange}
                            placeholder="MM/YY"
                            className="pl-10 bg-gray-700 border-gray-600 focus:ring-orange-500"
                          />
                          <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <div className="relative">
                          <Input 
                            id="cvc"
                            name="cvc"
                            value={billingData.cvc}
                            onChange={handleInputChange}
                            placeholder="123"
                            className="pl-10 bg-gray-700 border-gray-600 focus:ring-orange-500"
                          />
                          <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
  
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input 
                        id="cardholderName"
                        name="cardholderName"
                        value={billingData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="Name on card"
                        className="bg-gray-700 border-gray-600 focus:ring-orange-500"
                      />
                    </div>
  
                    <button className="w-full rounded bg-orange-600 px-4 py-2 font-medium hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                      Save Payment Method
                    </button>
                  </div>
                </div>
  
                {/* Current Plan */}
                <div className="rounded-lg bg-gray-800 p-6">
                  <h2 className="mb-4 text-xl font-semibold">Current Plan</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">Pro Plan</h3>
                        <p className="text-sm text-gray-400">Billed Monthly</p>
                      </div>
                      <button className="rounded bg-orange-700 px-4 py-2 hover:bg-orange-600">
                        Upgrade Plan
                      </button>
                    </div>
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="mb-2 font-medium">Plan Features:</h4>
                      <ul className="space-y-2 text-gray-300">
                        <li>• Feature 1</li>
                        <li>• Feature 2</li>
                        <li>• Feature 3</li>
                      </ul>
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