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
    // 70px, not a step on the scale, because it is a subtraction rather than a
    // choice: the homepage drops its name 136px from the top, and the title
    // here lands on that same line once the breadcrumb's 26px line and the
    // 40px under it are taken off the front. The breadcrumb goes above it.
    //
    // A phone keeps the small padding it had. There is no room to lift a title
    // 66px there, and the breadcrumb is level with the corner buttons at that
    // width, which is where the homepage puts its name too.
    <main className="pb-8 pt-6 sm:pb-28 sm:pt-[70px]">
      {/* The same column the homepage is set in, so a study reads as another
          page of the same site rather than a document dropped into it. */}
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        {/* Where this page sits, and the way back. It sits above the line the
            name holds on the homepage, leaving that line to the title of the
            study — so the first heading of either page is at the same height,
            and the way back is the one thing above it. */}
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
