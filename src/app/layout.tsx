import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { ThemeToggle } from "./theme-toggle";
import { PhotoGalleryButton, PhotoGalleryProvider } from "./photo-gallery";
import { AppleButton } from "./apple-button";
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
  // Just the name in the tab. The role still carries the description, which
  // is what a search result or a link preview shows.
  title: site.name,
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
        <script
          dangerouslySetInnerHTML={{
            // Applies the stored theme before first paint, and seeds
            // theme-color so the iOS status bar / toolbar strips start on the
            // right colour. Hex values mirror --background in globals.css.
            //
            // Dark is what the markup carries and what someone who has never
            // touched the toggle gets, so anything other than a stored
            // "light" resolves to it — an empty store included.
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t);var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}m.setAttribute("content",t==="light"?"#ffffff":"#000000")}catch(e){}})()`,
          }}
        />
        {/* The homepage writes its lines out a character at a time, which
            means the visible copy of each one is drawn by script. With
            scripting off there is nothing to draw it, so the copy underneath —
            the one TypedLine holds at zero opacity to reserve the space — is
            brought back instead, and the page reads as it always did. */}
        <noscript>
          <style>{`[data-typed-fallback]{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body
        className={`${quicksand.variable} ${satoshi.variable} ${outfit.variable} antialiased`}
      >
        {/* Wraps the lot because the gallery switch reaches past its own
            button: it decides whether the ribbons or the photos are the thing
            following the cursor. */}
        <PhotoGalleryProvider>
          {/* One container places every button, so their spacing is a gap
              rather than a sum each of them has to know. The top-right corner
              at every width: a column on a laptop, and a row on a phone, where
              a column would run down the side of the writing. The row clears
              the name and the role, which are short enough to sit beside it.

              items-center is not decoration: the apple's box is 44px where the
              other two are 40, and a flex row leaves boxes of different sizes
              standing on the same top edge — which put the apple's icon two
              pixels below its neighbours' in a row, and four pixels to their
              right in a column. Centred, the icons line up whatever their
              boxes measure. */}
          <div
            data-gravity="atom"
            className="corner-stack absolute right-6 top-6 z-20 flex flex-row items-center gap-2 sm:flex-col"
          >
            <ThemeToggle />
            <PhotoGalleryButton />
            <AppleButton />
          </div>
          {/* The drawn cursor is switched off for now — uncomment to bring it
              back. */}
          {/* <SiteCursor /> */}
          {/* Cursor ribbons are switched off for now. The effect is still
              here — re-enable it by uncommenting this line. */}
          {/* <CursorRibbons /> */}
          {children}
        </PhotoGalleryProvider>
      </body>
    </html>
  );
}
