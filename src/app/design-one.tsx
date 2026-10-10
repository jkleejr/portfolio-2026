// ---------------------------------------------------------------------------
// The homepage: the intro and the projects. The ways to get in
// touch are on the About page — see about/page.tsx. The same page is served at / and, with one study open, at
// /[slug] — see [slug]/page.tsx.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { caseStudies, type CaseStudy } from "@/data/case-studies";
import { StudyBody, StudyFact, poster, studyFacts } from "./case-study";
import { mediaSize } from "./media-size";
import { MobileList, ProjectList, ProjectSection } from "./project-study";
import { ProjectTitle } from "./project-title";
import { ProjectThumbnail } from "./project-thumbnail";

/**
 * What an open study says about itself: the project's name, the line saying
 * what it is, and the facts — where it lives, the role, the year. Set on the
 * left of the grown cover when a study is open — see ProjectList.
 */
function StudyIntro({ study, blurb }: { study: CaseStudy; blurb?: string }) {
  return (
    <header>
      <h2 className="text-2xl font-bold tracking-[-0.02em]">{study.title}</h2>
      {blurb && <p className="mt-2 text-lg leading-relaxed text-foreground">{blurb}</p>}
      <div className="mt-6 text-lg font-bold">
        {studyFacts(study).map((line, i) => (
          <p key={i} className={`leading-relaxed ${i ? "mt-1" : ""}`}>
            <StudyFact {...line} />
          </p>
        ))}
      </div>
    </header>
  );
}

export function DesignOne() {
  // The name's row and the intro: the top of the homepage at every width.
  const header = (
    <>
      {/* The name, for a screen reader: on show it is on the About page now —
          see about/page.tsx. The row it stood on in the top left corner is
          kept empty, the corner's height — --top-row on a phone, 44 of --u
          from sm up — so the About link still has its row to itself and the
          covers start where they did. --frame-h in globals.css counts the
          row. Its bottom margin folds into the strip's own from sm up. */}
      <h1 className="sr-only">{site.name}</h1>
      <div
        aria-hidden
        className="mb-8 h-[var(--top-row)] sm:mb-[calc(56*var(--u))] sm:h-[calc(44*var(--u))]"
      />

      {/* The writing at the top of the page, which is the intro. It is set from
          the page's left edge, under the name and on the line the name's ink
          starts on, rather than in the column with the projects: the name
          holds that corner, and a line about whose name it is reads as part of
          it there, where out in the middle it read as the first of the
          projects. --edge is the page's margin — the same the notes in
          the margin further down start at.

          Not held to the column's measure: the sentence runs on toward the
          right margin rather than breaking early, and only wraps where the
          page itself runs out.

          The apple button is in the opposite corner at every width, so the
          header doesn't need to leave room for it — see "The page on a
          phone" in globals.css. */}
      <header className="px-[var(--edge)]">
        {/* Who that is. A paragraph per line of site.intro, so a sentence that
            should start fresh does, rather than being wrapped into the one
            above it. A step up from the page's other lines — still far
            short of the name, so only the name leads.

            One margin at every width. */}
        {site.intro.some(Boolean) && (
          <div className="mt-8 space-y-3 sm:mt-[calc(32*var(--u))]">
            {site.intro.map((line) => (
              <p key={line} className="text-[30px] font-black leading-relaxed text-foreground sm:text-[calc(30*var(--u))]">
                {line}
              </p>
            ))}
          </div>
        )}
      </header>
    </>
  );

  // On a phone, 1.5rem of air at the top and a little at the foot. From sm
  // up the frame in ProjectList holds its own air, measured in --u, and is
  // centred in the window — so main adds none.
  return (
    <main className="relative pb-8 pt-6 sm:pb-0 sm:pt-0">
      {/* Every project's cover, side by side in one row that scrolls sideways
          when it runs past the window, and under it, when one is pressed,
          that project's study — see ProjectList and CoverStrip. Pressing a
          cover opens its study; pressing it again closes it.

          A cover is the project's demo video, or its first picture where it
          has no video. The study leaves that one out when it opens here, as
          the cover above it is already showing it. The studies are rendered
          here, on the server, and handed to the list as markup: what is in
          the browser's bundle is the switch, not the writing. See
          project-study.tsx. */}
      <div className="max-sm:hidden">
      <ProjectList
        header={header}
        intros={Object.fromEntries(
          entries.flatMap((entry) => {
            const study = caseStudies[entry.slug];
            return study
              ? [[entry.slug, <StudyIntro key={entry.slug} study={study} blurb={entry.blurb} />]]
              : [];
          }),
        )}
        studies={Object.fromEntries(
          entries.flatMap((entry) => {
            const study = caseStudies[entry.slug];
            return study
              ? [[entry.slug, <StudyBody key={entry.slug} study={study} inline cover={entry.media} />]]
              : [];
          }),
        )}
      >
        {entries.map((entry) => (
          <ProjectSection
            key={entry.slug}
            slug={entry.slug}
            hasStudy={!!caseStudies[entry.slug]}
          >
            {entry.media ? (
              <ProjectThumbnail
                slug={entry.slug}
                media={{
                  src: entry.media,
                  poster: poster(entry.media),
                  scale: entry.mediaScale,
                  ...mediaSize(entry.media),
                }}
              />
            ) : (
              (entry.images ?? []).slice(0, 1).map((image) => (
                <ProjectThumbnail key={entry.slug} image={image} slug={entry.slug} />
              ))
            )}
          </ProjectSection>
        ))}
      </ProjectList>
      </div>

      {/* On a phone, the homepage as it was before the strip: the name, and a
          list of rows — a square cover, and the name and line beside it —
          each opening its study under it. See MobileList. */}
      <div className="sm:hidden">
        {header}
        <MobileList
          rows={entries.map((entry) => ({
            slug: entry.slug,
            row: (
              <>
                {(entry.images ?? []).slice(0, 1).map((image) => (
                  <ProjectThumbnail key={entry.slug} image={image} slug={entry.slug} />
                ))}
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-semibold leading-snug tracking-[-0.02em]">
                    <ProjectTitle slug={entry.slug}>{entry.title}</ProjectTitle>
                  </h2>
                  {entry.blurb && (
                    <p className="mt-3 text-base leading-relaxed text-foreground">{entry.blurb}</p>
                  )}
                </div>
              </>
            ),
          }))}
          studies={Object.fromEntries(
            entries.flatMap((entry) => {
              const study = caseStudies[entry.slug];
              return study
                ? [[entry.slug, <StudyBody key={entry.slug} study={study} inline />]]
                : [];
            }),
          )}
        />
      </div>

    </main>
  );
}
