import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.bio,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${quicksand.variable} antialiased`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
