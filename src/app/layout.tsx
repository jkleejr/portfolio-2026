import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import { DesignToggle } from "./design-toggle";
import { Gravity } from "./gravity";
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
    <html lang="en" data-theme="dark" data-design="one" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            // Applies the stored theme and design before first paint, and
            // seeds theme-color so the iOS status bar / toolbar strips start on
            // the right colour. Hex values mirror --background in globals.css.
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t);var d=localStorage.getItem("design");if(d)document.documentElement.setAttribute("data-design",d);var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}m.setAttribute("content",t==="light"?"#ffffff":"#000000")}catch(e){}})()`,
          }}
        />
      </head>
      <body className={`${quicksand.variable} antialiased`}>
        <DesignToggle />
        <ThemeToggle />
        <Gravity />
        {children}
      </body>
    </html>
  );
}
