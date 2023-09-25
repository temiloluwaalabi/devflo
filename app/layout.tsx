import "./globals.css";
<<<<<<< Updated upstream
import type { Metadata } from "next";
import { Inter } from "next/font/google";
=======
>>>>>>> Stashed changes
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";

export const metadata: Metadata = {
  title: "DevFlow",
  description:
    "A community dricen platform for asking programming questions. Get help, share knowledge, and collaborate with developers from around the world. Explore topics in web development, mobile app development. alogorithms, data structures, and more",
  icons: {
    icon: "/assets/images/site-logo.svg",
  },
};

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
<<<<<<< Updated upstream
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
=======
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:primary-500",
        },
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
>>>>>>> Stashed changes
  );
}
