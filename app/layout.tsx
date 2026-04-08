import type { Metadata } from "next";
import { Inter, Manrope, Space_Grotesk, Syncopate, Satisfy, Kalam, Playfair_Display, Unbounded, DM_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";

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

const signature = Satisfy({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

const hindi = Kalam({
  weight: ["400", "700"],
  subsets: ["devanagari"],
  variable: "--font-hindi",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-unbounded",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://shashankguptaportal.vercel.app'),
  title: "Shashank Gupta — Vibe Coder & Creative Developer",
  description: "Vibe Coder specialized in building the best websites with interaction design and raw aesthetics. Currently open for freelancing and global job opportunities.",
  keywords: ["Shashank Gupta", "Vibe Coder", "Creative Developer", "Next.JS Portfolio", "Web Design", "Freelancer"],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "https://ik.imagekit.io/DEMOPROJECT/0e7bfec2-c25d-4cef-a895-df18857a856c.png",
    apple: "https://ik.imagekit.io/DEMOPROJECT/0e7bfec2-c25d-4cef-a895-df18857a856c.png",
  },
  openGraph: {
    title: "Shashank Gupta — Vibe Coder",
    description: "Building the best websites that defy gravity. Currently open for freelancing and jobs.",
    url: 'https://shashankguptaportal.vercel.app',
    siteName: 'Shashank Gupta Portfolio',
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
      <body suppressHydrationWarning className={`${inter.variable} ${manrope.variable} ${spaceGrotesk.variable} ${syncopate.variable} ${signature.variable} ${hindi.variable} ${playfair.variable} ${unbounded.variable} ${dmMono.variable} antialiased selection:bg-accent selection:text-primary`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Shashank Gupta",
              "url": "https://shashankguptaportal.vercel.app",
              "jobTitle": "Vibe Coder & Creative Developer",
              "knowsAbout": ["Full Stack Development", "Interaction Design", "UI/UX", "Next.js", "GSAP"],
              "sameAs": [
                "https://github.com/shashankguptadot",
                "https://linkedin.com/in/shashankgupta"
              ]
            })
          }}
        />
        <LenisProvider>
          <Preloader />
          <CustomCursor />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
