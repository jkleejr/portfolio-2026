// ---------------------------------------------------------------------------
// The homepage: the name, the intro, and the projects. The ways to get in
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
  // The name and the intro: the top of the homepage at every width.
  const header = (
    <>
      {/* The name, set in the blackletter — see .fraktur in globals.css, which
          carries the face and pins the weight. It is the one thing on the page
          that is not in the column: it holds the page's top left corner and
          runs most of the width of the window from there, rather than lining
          up with the covers below it. It is the only thing up there on the
          left — the role that used to be pinned in that corner is the first
          words of the intro now.

          From sm up it starts at the very top, on the same line as the About
          link and the apple in the opposite corner. Everything up there is
          measured in --u, a fraction of the band, so the room between the
          name and the corner is the same share of the page at every width
          and never closes. On a phone the corner keeps its fixed size and
          there is not that room, so the name takes --top-row plus a gap as a
          top margin and sits under the apple instead. Reading the row's
          height from the variable rather than writing 44px here means the
          two cannot fall out of step.

          The left padding is the page's --edge and 0.0375em more, because
          that is how far the J's swash hangs out to the left of where the
          face says the letter starts — measured, off the ink. With it the
          swash stops on the same line the intro and the notes in the margin
          start on, where set flush the name stood 10px out into the margin
          at full size. In em, so it holds at every size the name is set at.

          One row at every width, which is why whitespace-nowrap carries no
          breakpoint. It is also why the name is out here rather than in the
          column: "JOHN LEE" is far wider than the column's 628px at any
          display size worth using, so in there it always broke in two.

          Which makes the window what the size has to fit, and the whole
          string, not its longest word. There is no give to spare: nowrap
          cannot break, so going over does not wrap, it scrolls the page
          sideways.

          4.71em of text against the window less the padding is the whole sum,
          which makes the padding worth as much as the size. There is none on
          the right for that reason: set from the left, the name needs only
          its own left margin, and with nothing reserved at the other end
          12.5% holds down to a 200px window. What is left over at the right
          is a margin all the same — about 1.5rem of it on a 390px phone.

          12.5% of --page, the band the page is laid out in, rather than of
          the window: the two are the same up to 1333px, and past that
          the band stops growing and is centred, so the name holds at 14rem
          and the whole page goes with it as one block. That is where the
          ceiling comes from — it is the band's cap in globals.css, not a
          number here.

          The other cost is worth naming. Letting the name break gave the
          phone a much larger one — only "JOHN" at 2.62em had to fit, which
          allowed 28vw, so a 375px screen ran 105px where one row runs 69px.
          One row is the ask; this is what it takes.

          These numbers are cut to Old London and do not carry over to another
          face. Two measurements move them: "JOHN LEE" is 4.71em wide in it,
          which sets the vw, and its capitals ink only 0.80em tall inside the
          em, which is why the ceiling is as high as 18rem — a face with taller
          capitals reaches the same apparent size at a smaller number. Measure
          both before swapping the face; neither is guessable from the look of
          it.

          leading-none because a single row of capitals has nothing to collide
          with, and this face inks only 0.80em inside a 1em box.

          The bottom margin is the room between the name and the intro under
          it — the intro's own margin collapses into this one, so this is the
          whole of it. Measured from the ink again: the capitals stop ~16px
          short of the box's bottom at full size and the intro's ink starts
          ~8px into its line, so 3.5rem is ~80px of black. On a phone it is
          37px — the name sits 2px higher than --top-row puts it, and the 2px
          are given back here so the rows below stay put — which with the ~14px the face leaves under its capitals puts
          the first row about 49px below the name's ink on a 390px phone — a
          touch more than the 41px between the About link and the name above.

          data-gravity="letters" is for when the apple is pressed: the name
          comes apart a character at a time rather than as "JOHN" and "LEE",
          so each letter waits for its own hover. It is the only thing on the
          page marked that way, and the reason is the size — at 18rem a word
          is a slab, and two of them falling barely reads as the page coming
          apart. Everywhere else the text is small enough that whole words are
          the finer-grained answer, not the coarser one. */}
      <h1
        data-gravity="letters"
        className="fraktur mb-12 mt-[calc(var(--top-row)+1.5rem)] whitespace-nowrap pl-[calc(var(--edge)+0.0375em)] max-sm:mb-[37px] max-sm:mt-[calc(var(--top-row)+1.5rem-2px)] max-sm:pl-0 max-sm:text-center text-[length:var(--name-size)] leading-none sm:mb-[calc(56*var(--u))] sm:mt-0"
      >
        {site.name}
      </h1>

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
            // A picture is drawn shorter than the films, and sits on their
            // bottom line — see --cover-picture-film in globals.css.
            bottom={!!entry.media && !/\.mp4$/i.test(entry.media)}
          >
            {entry.media ? (
              <ProjectThumbnail
                slug={entry.slug}
                media={{
                  src: entry.media,
                  poster: poster(entry.media),
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
