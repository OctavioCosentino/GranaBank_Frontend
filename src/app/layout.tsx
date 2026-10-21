import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "GranaBank",
  description: "Plataforma de banca digital",
  icons: {
    icon: "/GranaBank_Logo.png",
    shortcut: "/GranaBank_Logo.png",
    apple: "/GranaBank_Logo.png",
  },
};

// Layout raíz con fuente Poppins, QueryProvider y Toaster
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${poppins.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans">
        <QueryProvider>
          {children}
          <Toaster
            position="bottom-right"
            closeButton
            toastOptions={{
              style: {
                background: "#E4D2D5",
                backgroundColor: "#E4D2D5",
                border: "1px solid #000000",
                color: "#1A202C",
              },
            }}
          />
        </QueryProvider>
      </body>
    </html>
  );
}
