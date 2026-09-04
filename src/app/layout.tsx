import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import { PhotoGalleryButton, PhotoGalleryProvider } from "./photo-gallery";
import { AppleButton } from "./apple-button";
import "./globals.css";

// The variable cut, so one file covers every weight in the range. The licence
// sits next to the files in src/app/fonts/.
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

// Fette Fraktur, on the name in the header and nothing else — see .fraktur
// in globals.css. Satoshi carries the rest of the page: this is a single-cut
// blackletter with no italic, so anywhere the page asks for bold or a slant
// the browser fakes it, and a blackletter has no upright to slant from.
//
// This is Fette UNZ Fraktur, the 2012 OFL release, converted to woff2 and
// otherwise untouched. It is deliberately not the fontspace download that was
// tried first: that one is a 1990s ALLTYPE conversion whose glyf and hmtx
// tables both run past the length their headers declare, which Chrome's font
// sanitiser rejects outright and silently — the page just fell through to the
// metric-matched Arial that next/font generates as every face's fallback,
// with nothing in the console to say so. Rebuilding those tables did not save
// it. Prefer a clean source over a repaired one here; if this face is ever
// swapped, check the replacement parses without warnings first.
//
// Licence is SIL OFL, beside the file — unlike the fontspace copy, which was
// freeware/non-commercial and wrong for a portfolio that advertises for work.
const fetteFraktur = localFont({
  variable: "--font-fette-fraktur",
  display: "swap",
  src: [
    {
      path: "./fonts/FetteFraktur-Regular.woff2",
      weight: "400",
      style: "normal",
    },
  ],
});

// Old English Five: loaded and ready, but not applied to anything yet. To try
// it, swap --font-fette-fraktur for --font-old-english in the .fraktur rule in
// globals.css — that one line is the whole switch.
//
// Shipped as the .ttf it came as, where Fette Fraktur above is a woff2. That
// is the licence, not an oversight: 1001fonts' FFC terms are free for
// commercial use but clause 3 forbids modifying the files, and re-compressing
// a font to woff2 rewrites them. The cost is about 26KB over what a woff2
// would weigh, and it only loads at all once something asks for the face.
const oldEnglish = localFont({
  variable: "--font-old-english",
  display: "swap",
  src: [
    {
      path: "./fonts/OldEnglishFive-Regular.ttf",
      weight: "400",
      style: "normal",
    },
  ],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  // Just the name in the tab. The role still carries the description, which
  // is what a search result or a link preview shows.
  title: site.name,
  description: site.intro[0],
  // What a relative image URL below is resolved against. Open Graph readers
  // are other people's servers fetching the card off the internet, so the
  // absolute address has to be spelled out — a path alone means nothing to
  // them. This has to be the production domain or the card comes up blank.
  metadataBase: new URL("https://johnkleejr.com"),
  // The card itself: what Slack, iMessage, LinkedIn and the rest draw when
  // the link is pasted. The name alone is enough in a browser tab, which sits
  // beside a dozen others and is read as a label; a card is read as an
  // introduction, so it carries the role too.
  openGraph: {
    title: `${site.name} — ${site.role}`,
    description: site.intro[0],
    url: "https://johnkleejr.com",
    siteName: site.name,
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${satoshi.variable} ${fetteFraktur.variable} ${oldEnglish.variable} antialiased`}
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
              gallery's is 40, and a flex row leaves boxes of different sizes
              standing on the same top edge — which put the apple's icon two
              pixels below its neighbour's in a row, and four pixels to its
              right in a column. Centred, the icons line up whatever their
              boxes measure. */}
          <div
            data-gravity="atom"
            className="corner-stack absolute right-6 top-6 z-20 flex flex-row items-center gap-2 sm:flex-col"
          >
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
