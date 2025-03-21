// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-8">Welcome to Real Estate Rental Assistant</h1>
      <div className="flex gap-4">
        <Link 
          href="/find-property"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search for a House/Flat for Rent
        </Link>
        <Link 
          href="/find-tenant"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Find an Appropriate Tenant
        </Link>
      </div>
    </main>
  );
}