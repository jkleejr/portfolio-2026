// ---------------------------------------------------------------------------
// The homepage with one study open: johnkleejr.com/loot-check.
//
// Opening a study on the list writes its slug into the address (see
// ProjectList in project-study.tsx), and this is what makes that address
// real — a visit to it, from a shared link or a reload, serves the same page
// the list is and the list reads the slug back off the address and opens the
// study. One route for every study in case-studies.ts, prerendered from
// generateStaticParams; anything else at the top level is a 404.
//
// The studies also have pages of their own at /projects/[slug], without the
// list around them.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { site } from "@/data/site";
import { DesignOne } from "../design-one";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) return {};
  return {
    // The project first, then the name, as on the study's own page.
    title: `${study.title} - ${site.titleName}`,
    description: study.tagline,
  };
}

export default async function OpenProjectPage({ params }: Params) {
  const { slug } = await params;
  if (!caseStudies[slug]) notFound();
  return (
    <>
      {/* This page starts at the study's row — see the first-paint scroll in
          ProjectSection. On a reload the browser wants to put the page back
          where it was scrolled to, and it does that at its own moment around
          load, sometimes after the row has been scrolled to and sometimes
          before, so the page landed on the row one time and mid-study the
          next. Told not to, here, inline and before anything else runs,
          because by the time a component's effect could say it the browser
          may already have done it. Only on this route: the homepage at "/"
          keeps the browser's restoration, and so do the studies' own pages. */}
      <script
        dangerouslySetInnerHTML={{
          __html: 'history.scrollRestoration="manual"',
        }}
      />
      <DesignOne />
    </>
  );
}
