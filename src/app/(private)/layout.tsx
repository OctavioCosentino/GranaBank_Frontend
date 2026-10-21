import React from "react";
import { BottomBar } from "@/components/bottom-bar";

// Layout para páginas privadas con barra de navegación inferior persistente
export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
      <BottomBar />
    </div>
  );
}
