"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { client } from "@/lib/amplify";

export default function PostProperty() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    image: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert("You must be signed in to post a property");
      return;
    }

    try {
      setLoading(true);
      
      // Create property in the database
      await client.models.Property.create({
        ...formData
      });
      
      alert("Property posted successfully!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error posting property:", error);
      alert("Failed to post property. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>Please sign in to post a property.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-2xl font-bold mb-6">Post a New Property</h2>
      
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Spacious 2-Bedroom Apartment"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., $1,200 per month"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Downtown, Seattle"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., https://example.com/image.jpg"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your property..."
          />
        </div>
        
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {loading ? "Posting..." : "Post Property"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}