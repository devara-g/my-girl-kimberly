import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "For You — We Fell in Love in October",
  description: "A cinematic, scroll-driven romantic storytelling experience inspired by Girl in Red.",
  openGraph: {
    title: "For You — We Fell in Love in October",
    description: "A cinematic, scroll-driven romantic storytelling experience inspired by Girl in Red.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Poppins:wght@300;400;500&family=Sacramento&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#0a060e" />
      </head>
      <body>
        <div className="grain-overlay" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
