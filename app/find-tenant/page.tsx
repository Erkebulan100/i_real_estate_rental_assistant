"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function FindTenant() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  // Sample tenant data (in a real app, this would come from your backend)
  const sampleTenants = [
    { id: "1", name: "Tenant Group 1", info: "Family of 4, looking for a 3-bedroom apartment" },
    { id: "2", name: "Tenant Group 2", info: "Professional couple, looking for a modern flat" },
  ];

  const handleMoreInfo = (tenantId: string) => {
    if (user) {
      router.push(`/tenant-details/${tenantId}`);
    } else {
      alert("Please sign in to view more details.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h2 className="text-2xl font-bold mb-4">Appropriate Tenants</h2>
      
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {sampleTenants.map((tenant) => (
          <div 
            key={tenant.id} 
            className="border border-gray-300 p-4 rounded flex flex-col gap-2"
          >
            <h3 className="font-bold">{tenant.name}</h3>
            <p>{tenant.info}</p>
            <button 
              onClick={() => handleMoreInfo(tenant.id)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-start"
            >
              More Info
            </button>
          </div>
        ))}
      </div>

      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}