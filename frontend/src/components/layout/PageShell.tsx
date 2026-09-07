import React from "react";
import { TopBar } from "./TopBar";

export const PageShell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink font-sans">
      <TopBar />
      <main
        className={`flex-1 w-full px-4 sm:px-6 lg:px-10 xl:px-12 py-8 ${className}`}
      >
        {children}
      </main>
    </div>
  );
};
