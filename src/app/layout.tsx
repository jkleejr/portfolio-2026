import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { AppleButton } from "./apple-button";
import { SiteCursor } from "./site-cursor";
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
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* iOS tints the strips outside the page — the status bar at the top
            and the Safari toolbar at the bottom — from this rather than from
            what the page paints. Fixed, now that the theme is. Mirrors
            --background in globals.css. */}
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        className={`${quicksand.variable} ${satoshi.variable} ${outfit.variable} antialiased`}
      >
        {/* One container places every button, so their spacing is a gap
            rather than a sum each of them has to know. A column in the
            top-right corner on a laptop; on a phone a row under the header
            text, left to right, with the covers starting below it. */}
        <div
          data-gravity="atom"
          className="corner-stack absolute left-6 top-[6.5rem] z-20 flex flex-row gap-2 sm:left-auto sm:right-6 sm:top-6 sm:flex-col"
        >
          <AppleButton />
        </div>
        <SiteCursor />
        {/* Cursor ribbons are switched off for now. The effect is still here —
            re-enable it by uncommenting this line. */}
        {/* <CursorRibbons /> */}
        {children}
      </body>
    </html>
  );
}
