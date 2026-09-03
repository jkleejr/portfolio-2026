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
        className={`${satoshi.variable} antialiased`}
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
