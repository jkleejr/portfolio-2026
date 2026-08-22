import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import { DesignToggle } from "./design-toggle";
import { SocialLinks } from "./social-links";
import { PhotoGalleryButton, PhotoGalleryProvider } from "./photo-gallery";
import { GlobeButton } from "./globe-button";
import { CursorRibbons } from "./cursor-ribbons";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

// Both are the variable cuts, so one file covers every weight in the range.
// Licences sit next to the files in src/app/fonts/.
const satoshi = localFont({
  variable: "--font-satoshi",
  display: "swap",
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      weight: "300 900",
      style: "normal",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      weight: "300 900",
      style: "italic",
    },
  ],
});

const outfit = localFont({
  variable: "--font-outfit",
  display: "swap",
  src: [
    {
      path: "./fonts/Outfit-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: `${site.name} — ${site.role}`,
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
      <body
        className={`${quicksand.variable} ${satoshi.variable} ${outfit.variable} antialiased`}
      >
        {/* Wraps the lot because the gallery switch reaches past its own
            button: it decides whether the ribbons or the photos are the thing
            following the cursor. */}
        <PhotoGalleryProvider>
          <DesignToggle />
          <ThemeToggle />
          <SocialLinks />
          <PhotoGalleryButton />
          <GlobeButton />
          <CursorRibbons />
          {children}
        </PhotoGalleryProvider>
      </body>
    </html>
  );
}
