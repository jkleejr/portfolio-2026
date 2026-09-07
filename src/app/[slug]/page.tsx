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
    title: `${site.titleName} - ${study.title}`,
    description: study.tagline,
  };
}

export default async function OpenProjectPage({ params }: Params) {
  const { slug } = await params;
  if (!caseStudies[slug]) notFound();
  return <DesignOne />;
}
