"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function FindProperty() {
  const [properties, setProperties] = useState<Array<Schema["Property"]["type"]>>([]);
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all properties
    client.models.Property.observeQuery().subscribe({
      next: (data) => setProperties([...data.items]),
    });
  }, []);

  const handleMoreInfo = (propertyId: string) => {
    if (user) {
      router.push(`/property-details/${propertyId}`);
    } else {
      alert("Please sign in to view more details.");
      // In Next.js, we don't need to navigate to sign-in as the Authenticator will handle this
    }
  };

  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h2 className="text-2xl font-bold mb-4">Properties for Rent</h2>
      
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