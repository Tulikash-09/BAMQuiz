import type { Metadata } from "next";
import { Patrick_Hand, Nunito, Courier_Prime } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const patrickHand = Patrick_Hand({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

const nunito = Nunito({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const courierPrime = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BAM! Quiz — Practice Statistics & Machine Learning",
  description:
    "Free interactive quiz for Josh Starmer's StatQuest playlists. Practice statistics fundamentals and machine learning with 12,600+ questions across 50 topics.",
  keywords: "statistics quiz, machine learning quiz, StatQuest, Josh Starmer, hypothesis testing, p-values, regression, neural networks, random forests",
  openGraph: {
    title: "BAM! Quiz",
    description: "Practice Statistics & Machine Learning based on Josh Starmer's StatQuest playlists. 12,600+ questions, free forever.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${patrickHand.variable} ${nunito.variable} ${courierPrime.variable}`}>
      <head>
        <meta name="theme-color" content="#FAFAF7" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23FAFAF7'/><text y='72' x='5' font-size='70' font-family='cursive' font-weight='bold' fill='%23E8272A'>B!</text></svg>" />
      </head>
      <body className="bg-paper text-ink font-body antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
