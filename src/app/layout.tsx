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

// Old London, currently the face on the name — see .fraktur in globals.css.
//
// The 2003 .ttf from the download, shipped as it came rather than converted:
// the copyright reads "All rights reserved", and the only statement of terms
// anywhere near it is a "have fun and enjoy" in the sibling .otf's name table,
// pointing at steffmann.de. That is thin ground for a site that advertises for
// work, and it is worth pinning the actual terms down before this ships. The
// download also carries Old London Alternate, a second cut not added here.
const oldLondon = localFont({
  variable: "--font-old-london",
  display: "swap",
  src: [
    {
      path: "./fonts/OldLondon-Regular.ttf",
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
  title: site.titleName,
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
    title: `${site.titleName} — ${site.role}`,
    description: site.intro[0],
    url: "https://johnkleejr.com",
    siteName: site.titleName,
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
    // suppressHydrationWarning is for the style attribute the script at the
    // foot of the body writes here: it runs before React hydrates, so by then
    // the html element carries a --scrollbar the server never rendered, and
    // React reports the difference. It is the one element that is written to
    // outside React, and the warning is suppressed one level deep — nothing
    // inside the page is covered by it.
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body
        className={`${satoshi.variable} ${oldLondon.variable} antialiased`}
      >
        {/* Wraps the lot because the gallery switch reaches past its own
            button: it decides whether the ribbons or the photos are the thing
            following the cursor. */}
        <PhotoGalleryProvider>
          {/* One container places every button, so their spacing is a gap
              rather than a sum each of them has to know. The top-right corner,
              as a row, at every width — no breakpoint, so the pair reads the
              same on a laptop as on a phone. The apple is last, which puts it
              hard against the right edge with the gallery on its left.

              items-center is not decoration: the apple's box is 44px where the
              gallery's is 40, and a flex row leaves boxes of different sizes
              standing on the same top edge, which put the apple's icon two
              pixels below its neighbour's. Centred, the icons line up whatever
              their boxes measure. It is also what --top-row on the homepage
              measures against: the row is the apple's height, and the name is
              dropped under it on a phone. */}
          <div
            data-gravity="atom"
            className="corner-stack absolute right-6 top-6 z-20 flex flex-row items-center gap-2"
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
        {/* The scrollbar's width onto :root, for the measures in globals.css
            that start from 100vw — read the note on --scrollbar there for why
            they need it.

            At the foot of the body rather than the head on purpose: the
            difference it is measuring only exists once there is enough page
            to scroll, and at the top of the body there is none yet, so an
            early reading is always 0. Here the markup above it has been
            parsed, which is late enough to be right and still before the
            first paint.

            innerWidth counts the scrollbar and the documentElement's
            clientWidth does not, so the gap between them is the scrollbar —
            0 on a platform drawing an overlay one, which is the answer that
            leaves every measure exactly as it was. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var m=function(){var w=window.innerWidth-document.documentElement.clientWidth;document.documentElement.style.setProperty('--scrollbar',(w>0?w:0)+'px')};m();addEventListener('resize',m)})();",
          }}
        />
      </body>
    </html>
  );
}
