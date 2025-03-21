import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import type { Schema } from "@/amplify/data/resource";

// Configure Amplify with backend outputs
if (typeof window !== "undefined") {
  Amplify.configure(outputs);
}

// Generate the data client
export const client = generateClient<Schema>();

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