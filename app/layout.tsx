import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk, Syncopate } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const syncopate = Syncopate({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-syncopate",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shashank Gupta — Vibe Coder & Creative Developer",
  description: "Vibe Coder specialized in building the best websites with interaction design and raw aesthetics. Currently open for freelancing and global job opportunities.",
  keywords: ["Shashank Gupta", "Vibe Coder", "Creative Developer", "Next.JS Portfolio", "Web Design", "Freelancer"],
  icons: {
    icon: "https://ik.imagekit.io/DEMOPROJECT/0e7bfec2-c25d-4cef-a895-df18857a856c.png",
    apple: "https://ik.imagekit.io/DEMOPROJECT/0e7bfec2-c25d-4cef-a895-df18857a856c.png",
  },
  openGraph: {
    title: "Shashank Gupta — Vibe Coder",
    description: "Building the best websites that defy gravity. Currently open for freelancing and jobs.",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "https://ik.imagekit.io/DEMOPROJECT/0e7bfec2-c25d-4cef-a895-df18857a856c.png",
        width: 1200,
        height: 630,
        alt: "Shashank Gupta Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shashank Gupta — Vibe Coder",
    description: "Building the best websites that defy gravity.",
    images: ["https://ik.imagekit.io/DEMOPROJECT/0e7bfec2-c25d-4cef-a895-df18857a856c.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable} ${syncopate.variable} antialiased selection:bg-accent selection:text-primary`}>
        <LenisProvider>
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
