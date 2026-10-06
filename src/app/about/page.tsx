// ---------------------------------------------------------------------------
// The About page: the ways to get in touch — LinkedIn and email.
//
// Set out in the column a study's own page uses (see projects/[slug]/page.tsx),
// with the title on the line the homepage's name starts on. The way back is
// where an open study puts its own (see project-study.tsx): top left, at the
// page's --edge, level with the apple in the opposite corner. Reached from
// the "About" link in the top-right corner of the homepage — see corner.tsx.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/data/site";
import { CopyEmail } from "../copy-email";

export const metadata: Metadata = {
  title: `About - ${site.titleName}`,
  alternates: { canonical: "/about" },
};

const link = "transition-colors duration-200 ease-out hover:text-accent";

export default function AboutPage() {
  return (
    // On a phone the text starts 32px under the corner row the way back
    // shares with the apple: 44px tall, 1.5rem down. From sm up the text, the
    // photo and the links are centred in the window as one block, held at
    // least that same 32px clear of the row — at --frame-top — above, and as
    // much again below so the middle stays the middle.
    <main className="relative pb-8 pt-[100px] sm:flex sm:min-h-svh sm:flex-col sm:justify-center sm:py-[calc(var(--frame-top)+76px)]">
      {/* Placed exactly as the open study's "Home > Loot Check" is, so the
          way back is in the same spot on every page that has one. */}
      <nav
        aria-label="Breadcrumb"
        className="absolute left-[var(--edge)] top-6 z-30 flex h-11 items-center text-lg font-medium leading-relaxed sm:top-[var(--frame-top)]"
      >
        <Link
          href="/"
          className="text-muted transition-colors duration-200 ease-out hover:text-accent"
        >
          Home
        </Link>
        <span aria-hidden className="px-2 text-muted">
          &gt;
        </span>
        <span aria-current="page">About</span>
      </nav>
      {/* 120px wider than the column a study is set in, 60px out each side,
          and centred, so the white either side of it matches. */}
      <div className="mx-auto w-[calc(var(--column)+120px)] max-w-[calc(100%-3rem)] sm:relative">
        {/* No heading on show: the page opens straight into its body text.
            The h1 is for a screen reader, which uses it to say where it is. */}
        <h1 className="sr-only">About</h1>
        {/* The text, and his photo on the right of it, the paragraph centred
            on the photo's height. On a phone there is no room beside it, so
            the photo leads, centred over the text. Moved
            there by order rather than in the markup, so the text still comes
            first to a screen reader. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-10">
          <div className="min-w-0 flex-1">
            <p className="text-lg leading-relaxed text-foreground">
              I’m a designer building AI-native products from 0 to 1. My background in cognitive science and music production allows me to approach problems through both UI/UX design thinking and the intuition of an artist. I’m driven by curiosity and entrepreneurship, so I spent time exploring my interests by building apps, producing music, and trading/investing, which developed my skills as a creative problem solver. 
            </p>

            {site.intro.some(Boolean) && (
              <div className="mt-6 space-y-3">
                {site.intro.filter(Boolean).map((line) => (
                  <p key={line} className="text-lg leading-relaxed text-foreground">
                    {line}
                  </p>
                ))}
              </div>
            )}
            {site.closing && (
              <p className="mt-6 text-lg leading-relaxed text-foreground">
                {site.closing}
              </p>
            )}
          </div>
          <Image
            src="/about/portrait.jpg"
            alt={`${site.titleName} by the Chicago River`}
            width={900}
            height={1200}
            sizes="300px"
            quality={90}
            loading="eager"
            className="order-first h-auto w-[300px] shrink-0 self-center rounded-lg sm:order-none sm:self-center"
          />
        </div>

        {/* The other places to find him, then the way to write to him, at
            the size the homepage's About link has at full width, and held
            there at every window width rather than scaling. Set flush
            with the right edge of the column on a phone; from sm up flush
            with its left edge, under the start of the text, and set down at
            the foot of the photo beside it, the bottom of the letters on the
            photo's bottom edge: out of flow at
            the bottom of the row, whose height is the photo's, with the
            leading taken off and the font's descent below the baseline let
            hang past it, so the bottom of the letters is what lines up.
            Moved by its offset rather than a transform: a transform here
            would become what the pinned links resolve position: fixed
            against when gravity is on. The
            arrow after LinkedIn says it opens in a new tab: a no-break space
            so it never starts a line of its own, and hidden from a screen
            reader, which would read it out as a direction. */}
        <nav
          aria-label="Contact"
          className="mt-8 flex flex-wrap justify-end gap-x-6 gap-y-2 font-medium text-foreground text-[calc(20*var(--u-full))] sm:absolute sm:-bottom-[0.16em] sm:left-0 sm:mt-0 sm:justify-start sm:leading-none"
        >
          {site.links.map(
            (l) =>
              l.href && (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={link}>
                  {l.label}
                  <span aria-hidden className="text-[0.75em]">{" "}↗</span>
                </a>
              ),
          )}
          {/* From sm up, "Email" copies the address — see copy-email.tsx.
              On a phone it opens a mail app instead. */}
          <a href={`mailto:${site.email}`} className={`${link} sm:hidden`}>
            Email
          </a>
          <CopyEmail email={site.email} className={`${link} hidden sm:inline`}>
            Email
          </CopyEmail>
        </nav>
      </div>
    </main>
  );
}
