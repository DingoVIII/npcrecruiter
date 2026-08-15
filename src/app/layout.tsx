import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TrafficTracker from "@/components/TrafficTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.npcrecruiter.com"),

  title: "NPC Recruiter – AI NPC Generator for D&D, Pathfinder & Fantasy RPGs",

  description:
    "Recruit memorable NPCs for your tabletop RPG in under two minutes. Generate unique characters, commission professional portraits, and print ready-to-use NPC cards for D&D, Pathfinder, OSR and other fantasy RPGs.",

  alternates: {
    canonical: "/",
  },

  keywords: [
    "D&D NPC Generator",
    "Fantasy NPC Generator",
    "RPG NPC Generator",
    "Pathfinder NPC Generator",
    "Printable NPC Cards",
    "AI NPC Generator",
    "TTRPG NPC Generator",
  ],

  openGraph: {
    title: "NPC Recruiter",
    description:
      "Recruit memorable NPCs in under two minutes. Generate characters, commission portraits, and print ready-to-use NPC cards.",
    url: "https://www.npcrecruiter.com",
    siteName: "NPC Recruiter",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "NPC Recruiter",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "NPC Recruiter",
    description:
      "Recruit memorable NPCs in under two minutes.",
    images: ["/og-image.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
  icon: "/favicon.ico",
  shortcut: "/favicon.ico",
  apple: "/logo/npc-icon.png",
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
  <TrafficTracker />
  {children}
</body>
    </html>
  );
}
