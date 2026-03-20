import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Goy Speak",
  description: "Fake translations for high-priority national situations.",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
