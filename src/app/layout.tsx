import type { Metadata } from "next";
import { Comfortaa, Space_Grotesk } from "next/font/google";
import "./globals.css";

// Define fonts
const comfortaa = Comfortaa({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-comfortaa",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Appointment Scheduler",
  description: "Schedule appointments and manage business resources",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${comfortaa.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
