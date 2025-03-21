"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "@/amplify/data/resource";
import { getDataClient } from "@/lib/amplify";

export default function FindProperty() {
  const [properties, setProperties] = useState<Array<Schema["Property"]["type"]>>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  
  useEffect(() => {
    console.log("FindProperty component mounted");
    
    // Initialize client outside the subscription to handle errors
    const client = getDataClient();
    
    // Check if client is available (only in browser)
    if (!client) {
      console.error("Amplify client is not available");
      setError("Amplify client is not available. Please check your configuration.");
      return;
    }
    
    console.log("Client obtained:", !!client);
    console.log("Client.models:", client.models ? Object.keys(client.models) : "undefined");
    
    // Create a subscription to clean up later
    try {
      console.log("Setting up subscription...");
      
      // Check if Property model exists
      if (!client.models.Property) {
        console.error("Property model is not available in the client");
        setError("Property model is not available. Please check your Amplify configuration.");
        return;
      }
      
      const subscription = client.models.Property.observeQuery().subscribe({
        next: (data) => {
          console.log("Received property data:", data);
          setProperties([...data.items]);
        },
        error: (err) => {
          console.error("Error in subscription:", err);
          setError(`Error fetching properties: ${err.message}`);
        }
      });
      
      console.log("Subscription set up successfully");
      
      // Clean up the subscription when component unmounts
      return () => {
        console.log("Cleaning up subscription");
        subscription.unsubscribe();
      };
    } catch (err: any) {
      console.error("Error setting up subscription:", err);
      setError(`Error setting up subscription: ${err.message}`);
    }
  }, []);

  const handleMoreInfo = (propertyId: string) => {
    if (user) {
      router.push(`/property-details/${propertyId}`);
    } else {
      alert("Please sign in to view more details.");
    }
  };

  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h2 className="text-2xl font-bold mb-4">Properties for Rent</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Make sure you have run <code>npx ampx sandbox</code> to set up your local backend.
          </p>
        </div>
      )}
      
      <div className="flex flex-col gap-4 w-full max-w-2xl">
        {properties.length === 0 ? (
          <p>No properties available at the moment.</p>
        ) : (
          properties.map((property) => (
            <div
              key={property.id}
              className="border border-gray-300 p-4 rounded flex flex-col gap-2"
            >
              <h3 className="font-bold">{property.title}</h3>
              <p>{property.description}</p>
              <p className="font-semibold">Price: {property.price}</p>
              <p>Location: {property.location}</p>
              <button
                onClick={() => handleMoreInfo(property.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 self-start"
              >
                More Info
              </button>
            </div>
          ))
        )}
      </div>
      
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Back to Home
      </Link>
    </div>
  );
}