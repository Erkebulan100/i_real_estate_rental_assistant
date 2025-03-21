"use client"

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

export default function PropertyDetails() {
  const [property, setProperty] = useState<Schema["Property"]["type"] | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthenticator((context) => [context.user]);
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  useEffect(() => {
    // Ensure user is authenticated
    if (!user) {
      return;
    }

    async function fetchProperty() {
      try {
        const propertyData = await client.models.Property.get({
          id: propertyId
        });
        setProperty(propertyData.data);
      } catch (error) {
        console.error("Error fetching property:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProperty();
  }, [propertyId, user]);

  const handleGoBack = () => {
    router.back();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>Please sign in to view property details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>Loading property details...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>Property not found.</p>
        <button 
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h2 className="text-2xl font-bold mb-4">Property Details</h2>
      
      <div className="w-full max-w-2xl border border-gray-300 p-6 rounded">
        <h3 className="text-xl font-bold mb-2">{property.title}</h3>
        
        {property.image && (
          <div className="mb-4">
            <img 
              src={property.image} 
              alt={property.title || "Property image"}
              className="w-full h-64 object-cover rounded"
            />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="font-semibold">Price</h4>
            <p>{property.price || "Price not specified"}</p>
          </div>
          <div>
            <h4 className="font-semibold">Location</h4>
            <p>{property.location || "Location not specified"}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold">Description</h4>
          <p>{property.description || "No description available"}</p>
        </div>
        
        <button 
          onClick={handleGoBack}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}