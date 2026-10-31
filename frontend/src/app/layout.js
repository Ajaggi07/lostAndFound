import { Suspense } from "react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./globals.css";

export const metadata = {
  title: "CampusFind | Campus Lost & Found",
  description:
    "A campus lost and found platform that helps students reconnect with their belongings.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-slate-50">
        <Suspense
          fallback={
            <div className="h-16 w-full bg-white" />
          }
        >
          <Navbar />
        </Suspense>

        <main className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}