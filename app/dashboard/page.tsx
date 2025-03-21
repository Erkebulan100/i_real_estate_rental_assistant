"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthenticator } from "@aws-amplify/ui-react";

export default function Dashboard() {
  const { user, signOut } = useAuthenticator((context) => [context.user, context.signOut]);
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      return;
    }

    // Get the user's role from localStorage
    const userId = user.userId || user.username;
    const savedRole = localStorage.getItem(`user_role_${userId}`);
    
    if (savedRole) {
      setUserRole(savedRole);
    } else {
      // If no role is set, show role selection
      setUserRole(null);
    }
    
    setLoading(false);
  }, [user]);

  const handleRoleSelect = (role: string) => {
    if (!user) return;
    
    // Save role to localStorage
    const userId = user.userId || user.username;
    localStorage.setItem(`user_role_${userId}`, role);
    setUserRole(role);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>Please sign in to access your dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center p-8">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  // Role selection screen
  if (!userRole) {
    return (
      <div className="flex flex-col items-center p-8 gap-4">
        <h2 className="text-2xl font-bold mb-4">Welcome to Real Estate Rental Assistant</h2>
        <p>Please select your role to continue:</p>
        
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleRoleSelect('tenant')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Tenant - I'm looking for properties to rent
          </button>
          <button
            onClick={() => handleRoleSelect('landlord')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Landlord - I have properties to rent out
          </button>
        </div>
        
        <button 
          onClick={signOut}
          className="mt-6 text-blue-500 hover:underline"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Landlord Dashboard
  if (userRole === 'landlord') {
    return (
      <div className="flex flex-col items-center p-8 gap-4">
        <h2 className="text-2xl font-bold mb-4">Landlord Dashboard</h2>
        <p>Welcome, {user.username || 'Landlord'}!</p>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <Link
            href="/profile"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Profile
          </Link>
          <Link
            href="/post-property"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Post a Property
          </Link>
          <Link
            href="/my-properties"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            My Properties
          </Link>
          <Link
            href="/find-tenant"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Find Tenants
          </Link>
        </div>
        
        <button 
          onClick={signOut}
          className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // Tenant Dashboard
  return (
    <div className="flex flex-col items-center p-8 gap-4">
      <h2 className="text-2xl font-bold mb-4">Tenant Dashboard</h2>
      <p>Welcome, {user.username || 'Tenant'}!</p>
      
      <div className="flex flex-wrap gap-4 mt-4">
        <Link
          href="/profile"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Profile
        </Link>
        <Link
          href="/find-property"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Find Properties
        </Link>
        <Link
          href="/saved-properties"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Saved Properties
        </Link>
      </div>
      
      <button 
        onClick={signOut}
        className="mt-8 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}