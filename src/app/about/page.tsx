// ---------------------------------------------------------------------------
// The About page: the ways to get in touch — LinkedIn and email.
//
// Set out in the column a study's own page uses (see projects/[slug]/page.tsx),
// under the name in blackletter at the top middle of the page. The way back is
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
    // On a phone the text starts 32px under the name's row, which is 1rem
    // under the corner row the way back shares with the apple: 44px tall,
    // 1.5rem down. From sm up the block is centred in the window — see
    // .about-page in globals.css.
    <main className="about-page relative pb-8 pt-[160px]">
      {/* The name, set in the blackletter — see .fraktur in globals.css. At
          the top middle of the page: from sm up on the corner row, between
          the way back and the apple, and on a phone on a row of its own under
          it, where the three would not fit across. The line-height is the
          row's height, so it sits level with the corner without being
          measured against it. Centred by spanning the page and centring the
          text rather than by a transform, which would become what gravity's
          pinned letters resolve position: fixed against. Before the way back
          in the markup, and under it, so the stretch of it over the way back
          does not take that link's presses.

          data-gravity="letters" is for when the apple is pressed: the name
          comes apart a character at a time rather than as "JOHN" and "LEE". */}
      <p
        data-gravity="letters"
        className="fraktur absolute inset-x-0 top-[calc(1.5rem+var(--top-row)+1rem)] whitespace-nowrap text-center text-[length:var(--name-size)] leading-[var(--top-row)] sm:top-[var(--frame-top)] sm:leading-[calc(44*var(--u))]"
      >
        {site.name}
      </p>
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
      <div className="mx-auto w-[calc(var(--column)+120px)] max-w-[calc(100%-3rem)]">
        {/* No heading on show: the page opens straight into its body text.
            The h1 is for a screen reader, which uses it to say where it is. */}
        <h1 className="sr-only">About</h1>
        {/* The text and the links, and his photo on the right of them, 36px
            apart — the most that leaves "0 to 1." on the first line, which
            is held together by no-break spaces at any width. On a
            phone there is no room beside it, so the photo leads, centred over
            the text — moved there by order rather than in the markup, so the
            text still comes first to a screen reader. */}
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-9">
          {/* From sm up, as tall as the photo, in three rows: the text in the
              middle, with two equal rows either side of it, so the text is
              centred on the photo, and the links set down at the foot of the
              last. Once the window is narrow enough that the text runs taller
              than the photo, the rows have nothing left to share and the
              links simply follow the text, below it, rather than staying at
              the photo's foot and running over its last lines. */}
          <div className="min-w-0 flex-1 sm:grid sm:grid-rows-[1fr_auto_1fr]">
            <div className="sm:row-start-2">
              <p className="text-lg leading-relaxed text-foreground">
                I’m a designer building AI-native products from 0&nbsp;to&nbsp;1. My background in cognitive science and music production allows me to approach problems through both UI/UX design thinking and the intuition of an artist. I’m driven by curiosity and entrepreneurship, so I spent time exploring my interests by building apps, producing music, and trading/investing, which developed my skills as a creative problem solver. 
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

            {/* The other places to find him, then the way to write to him,
                at the size the homepage's About link has at full width, and
                held there at every window width rather than scaling. Flush
                with the right edge of the column on a phone. From sm up flush
                with its left edge, under the start of the text, at the
                bottom of the last row, with the bottom of the letters on the
                photo's bottom edge: the leading taken off, and the font's
                descent below the baseline let hang past the row by a negative
                margin. A margin rather than a transform, which would become
                what the pinned links resolve position: fixed against when
                gravity is on. The arrow after LinkedIn says it opens in a new
                tab: a no-break space so it never starts a line of its own,
                and hidden from a screen reader, which would read it out as a
                direction. */}
            <nav
              aria-label="Contact"
              className="mt-8 flex flex-wrap justify-end gap-x-6 gap-y-2 font-medium text-foreground text-[calc(20*var(--u-full))] sm:row-start-3 sm:-mb-[0.16em] sm:mt-0 sm:justify-start sm:self-end sm:pt-6 sm:leading-none"
            >
              {site.links.map(
                (l) =>
                  l.href && (
                    <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className={link}>
                      {l.label}
                      <span aria-hidden className="text-[0.75em]">{" "}↗</span>
                    </a>
                  ),
              )}
              {/* From sm up, "Email" copies the address — see
                  copy-email.tsx. On a phone it opens a mail app instead. */}
              <a href={`mailto:${site.email}`} className={`${link} sm:hidden`}>
                Email
              </a>
              <CopyEmail email={site.email} className={`${link} hidden sm:inline`}>
                Email
              </CopyEmail>
            </nav>
          </div>
          <Image
            src="/about/portrait.jpg"
            alt={`${site.titleName} by the Chicago River`}
            width={900}
            height={1200}
            sizes="300px"
            quality={90}
            loading="eager"
            className="order-first h-auto w-[300px] shrink-0 self-center rounded-lg sm:order-none"
          />
        </div>
      </div>
    </main>
  );
}
