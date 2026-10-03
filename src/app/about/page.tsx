// ---------------------------------------------------------------------------
// The About page: the ways to get in touch — LinkedIn, the resume, and email.
//
// Set out the way a study's own page is (see projects/[slug]/page.tsx): the
// same column, the same way back above the title, and the title on the line
// the homepage's name starts on. Reached from the "About" link beside the
// apple in the top-right corner — see layout.tsx.
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
    // The same padding a study's page has — see the note on it there.
    <main className="pb-8 pt-6 sm:pb-28 sm:pt-[102px]">
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        <nav aria-label="Breadcrumb" className="text-base leading-relaxed">
          <Link
            href="/"
            className="text-muted transition-colors duration-200 ease-out hover:text-foreground"
          >
            Home
          </Link>
          <span aria-hidden className="px-2 text-muted">
            &gt;
          </span>
          About
        </nav>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.02em]">About</h1>

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

        {/* The other places to find him, his resume, then the way to write
            to him. The arrow after LinkedIn and Resume says they open in a
            new tab: a no-break space so it never starts a line of its own,
            and hidden from a screen reader, which would read it out as a
            direction. */}
        <nav
          aria-label="Contact"
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-lg font-medium text-foreground sm:text-xl"
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
          {/* Opens the PDF in a new tab, where the browser shows it, rather
              than saving it to the computer. */}
          <a href={site.resume.href} target="_blank" rel="noreferrer" className={link}>
            {site.resume.label}
            <span aria-hidden className="text-[0.75em]">{" "}↗</span>
          </a>
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
