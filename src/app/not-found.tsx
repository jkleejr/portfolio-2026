// ---------------------------------------------------------------------------
// The page for an address the site does not have: a typo, an old link, a link
// cut short in a message. Not reached from anything on the site itself.
//
// Set out the way the About page is (see about/page.tsx): the way back top
// left at the page's --edge, level with the corner opposite, and a few lines
// of body text in the column under it — so a visitor who lands here is
// still plainly on the site, with one obvious way on to the work.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `Page not found - ${site.titleName}`,
};

const link = "transition-colors duration-200 ease-out hover:text-accent";

export default function NotFound() {
  return (
    // The same air as the About page: the text starts 32px under the corner
    // row, 1.5rem down on a phone and at --frame-top from sm up.
    <main className="relative pb-8 pt-[100px] sm:pb-28 sm:pt-[calc(var(--frame-top)+76px)]">
      <nav
        aria-label="Breadcrumb"
        className="absolute left-[var(--edge)] top-6 z-30 flex h-11 items-center text-base leading-relaxed sm:top-[var(--frame-top)]"
      >
        <Link href="/" className={`text-muted ${link}`}>
          Home
        </Link>
        <span aria-hidden className="px-2 text-muted">
          &gt;
        </span>
        <span aria-current="page">Not found</span>
      </nav>
      <div className="mx-auto w-[calc(var(--column)+120px)] max-w-[calc(100%-3rem)]">
        <h1 className="text-2xl font-bold tracking-[-0.02em]">
          This page doesn’t exist
        </h1>
        <p className="mt-2 text-lg leading-relaxed text-foreground">
          The link may be old, or cut short somewhere along the way.
        </p>
        {/* The way on, at the size the About page's contact links have. */}
        <p className="mt-8 font-medium text-foreground text-[calc(20*var(--u-full))]">
          <Link href="/" className={link}>
            See the work{" "}
            <span aria-hidden className="text-[0.75em]">
              →
            </span>
          </Link>
        </p>
      </div>
    </main>
  );
}
