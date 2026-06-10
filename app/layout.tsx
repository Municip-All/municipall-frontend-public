import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: `${site.name} — Plateforme citoyenne pour les communes`,
  description: site.description,
  keywords: [
    "mairie",
    "commune",
    "application citoyenne",
    "signalement",
    "smart city",
    "marque blanche",
  ],
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "fr_FR",
  },
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    apple: [{ url: "/favicon.png", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
