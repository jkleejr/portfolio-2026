// ---------------------------------------------------------------------------
// A project's case study, at a page of its own.
//
// One route for every study in case-studies.ts, prerendered at build time from
// generateStaticParams — the writing is in the repository, so there is nothing
// to look up at request time. A slug with no study behind it is a 404 rather
// than an empty page.
//
// `params` is a promise in this version of Next, hence the await.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { caseStudies } from "@/data/case-studies";
import { site } from "@/data/site";
import Link from "next/link";
import { StudyBody } from "../../case-study";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(caseStudies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) return {};
  return {
    // Name first, then the project, joined by a plain hyphen.
    title: `${site.name} - ${study.title}`,
    description: study.tagline,
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const study = caseStudies[slug];
  if (!study) notFound();

  return (
    <main className="pb-8 pt-6 sm:pb-28 sm:pt-34">
      {/* The same column the homepage is set in, so a study reads as another
          page of the same site rather than a document dropped into it. */}
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        {/* Where this page sits, and the way back. It holds the line the name
            holds on the homepage, so both pages start at the same height. */}
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
          {study.title}
        </nav>
        <div className="mt-10">
          <StudyBody study={study} />
        </div>
      </div>
    </main>
  );
}
