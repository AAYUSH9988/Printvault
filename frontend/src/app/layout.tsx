import type { Metadata } from "next";
import { Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Printvault - Free Print Resources Library",
    template: "%s | Printvault",
  },
  description:
    "Free print resources library by Jalaram Cards. Download high-quality Bhagwan artworks, frames, couple initials, and card templates in PDF and CDR formats.",
  keywords: [
    "print resources",
    "wedding card design",
    "bhagwan artwork",
    "ganesh design",
    "wedding card frames",
    "couple initials",
    "free download",
    "PDF",
    "CDR",
    "CorelDRAW",
    "Jalaram Cards",
  ],
  authors: [{ name: "Jalaram Cards, Vadodara" }],
  creator: "Jalaram Cards",
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Printvault",
    title: "Printvault - Free Print Resources Library",
    description:
      "Free print resources library by Jalaram Cards. Download high-quality designs in PDF and CDR formats.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
