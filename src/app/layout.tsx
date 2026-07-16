import type { Metadata } from "next";
import { Outfit, DM_Sans, Bangers } from "next/font/google";
import "./globals.css";
import ToastWrapper from "@/components/ToastWrapper";
import { Providers } from "@/components/Providers";
import { FFDecorations } from "@/components/FFDecorations";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const bangers = Bangers({
  variable: "--font-bangers",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "CEKUSERFF",
  description: "Cek statistik player Free Fire — cukup paste UID",
  icons: {
    icon: [
      { url: "/favicon.svg?v=3", type: "image/svg+xml" },
    ],
    apple: "/favicon.svg?v=3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${outfit.variable} ${dmSans.variable} ${bangers.variable} dark h-full antialiased`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=3" />
        <link rel="apple-touch-icon" href="/favicon.svg?v=3" />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground font-sans">
        <FFDecorations />
        <Providers>
          {children}
        </Providers>
        <ToastWrapper />
      </body>
    </html>
  );
}
