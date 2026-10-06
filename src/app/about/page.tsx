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
    // The title starts 32px under the corner row the way back shares with the
    // apple: 44px tall, 1.5rem down on a phone and at --frame-top from sm up.
    // Tied to the row rather than set in pixels, since --frame-top drops on a
    // tall window and the title has to go down with it.
    <main className="relative pb-8 pt-[100px] sm:pb-28 sm:pt-[calc(var(--frame-top)+76px)]">
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

        {/* The other places to find him, then the way to write to him, at
            the size the homepage's About link has at full width, and held
            there at every window width rather than scaling. Set flush
            with the right edge of the column the text above runs in. The
            arrow after LinkedIn says it opens in a new tab: a no-break space
            so it never starts a line of its own, and hidden from a screen
            reader, which would read it out as a direction. */}
        <nav
          aria-label="Contact"
          className="mt-8 flex flex-wrap justify-end gap-x-6 gap-y-2 font-medium text-foreground text-[calc(20*var(--u-full))]"
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
