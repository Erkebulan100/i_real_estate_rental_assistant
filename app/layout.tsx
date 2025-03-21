"use client"

import React from "react";
import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

// Import global styles
import "./globals.css";

// Configure Amplify with your backend outputs
Amplify.configure(outputs);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Authenticator>
          {children}
        </Authenticator>
      </body>
    </html>
  );
}