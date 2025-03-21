import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

// Log Amplify outputs for debugging (remove sensitive info in production)
console.log("Amplify outputs available:", !!outputs);
if (outputs) {
  console.log("Outputs structure:", Object.keys(outputs));
}

// Configure Amplify with backend outputs
if (typeof window !== "undefined") {
  try {
    console.log("Configuring Amplify...");
    Amplify.configure(outputs);
    console.log("Amplify configured successfully");
  } catch (error) {
    console.error("Error configuring Amplify:", error);
  }
}

// Create a single instance of the client
let client: ReturnType<typeof generateClient<Schema>> | null = null;

// Export a function to get the client
export function getDataClient() {
  if (!client && typeof window !== "undefined") {
    try {
      console.log("Generating Amplify client...");
      client = generateClient<Schema>();
      
      // Check if the client has the expected models
      console.log("Client models available:", client?.models ? Object.keys(client.models) : "none");
      console.log("Property model available:", !!client?.models?.Property);
      
      return client;
    } catch (error) {
      console.error("Error generating Amplify client:", error);
      return null;
    }
  }
  return client;
}

// Helper function to get user role
export const getUserRole = (userId: string): string | null => {
  if (typeof window === "undefined") return null;
  
  return localStorage.getItem(`user_role_${userId}`);
};

// Helper function to set user role
export const setUserRole = (userId: string, role: string): void => {
  if (typeof window === "undefined") return;
  
  localStorage.setItem(`user_role_${userId}`, role);
};