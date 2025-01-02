import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "../components/Navigation";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProjectHub - Project Management",
  description: "Manage your projects and requirements efficiently",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-full">
          <Navigation />
          <div className="py-10">
            <main className="max-w-7xl mx-auto sm:px-6 lg:px-8">
              <div className="px-4 py-6 sm:px-0">
                {children}
              </div>
            </main>
          </div>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  );
}
