// ---------------------------------------------------------------------------
// Design one — the original layout.
//
// Moved here unchanged when the design switcher landed. The switcher renders
// this and DesignTwo side by side and shows one at a time, so edits to the
// alternative never touch this file.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { caseStudies, type CaseStudy } from "@/data/case-studies";
import { StudyBody, StudyFact, studyFacts } from "./case-study";
import { ProjectList, ProjectRow, ProjectSection } from "./project-study";
import { ProjectThumbnail } from "./project-thumbnail";
import { ProjectTitle } from "./project-title";

/**
 * When a project was made, what the role was, and how far it went.
 *
 * Out in the margin at the left of the band the page is laid out in — see
 * --page in globals.css — on the line the intro at the top of the page holds,
 * so everything the page says about itself in the margin is ranged off one
 * edge. Nothing else leaves the column. These are notes
 * about the project rather than part of it, and the study under the row, when
 * it is opened, does not have to carry them.
 *
 * They are here whether that study is open or not: a reader deciding which
 * project to open wants to know when it was and what it was before pressing
 * anything.
 *
 * Only where there is a margin to put them in. Under 1000px the window has
 * nothing to spare, and rather than fold them into the column — where they
 * turn every row from a picture and a line into a stack of five — they are
 * not shown at all. They are the smallest thing the page has to say, and the
 * narrower the window the truer that is; the study itself still carries them
 * on its own page. --margin-note is the room out there, --margin-note-x is
 * where it starts; both are in globals.css.
 */
function StudyFacts({ study }: { study?: CaseStudy }) {
  if (!study) return null;
  const lines = studyFacts(study);
  if (!lines.length) return null;

  return (
    // In the row, since that is what it is set beside, but not part of the
    // switch the row is: data-own-hover keeps the row from lighting under a
    // pointer out here and from opening the study at a click, and the cursor
    // goes back to the arrow to say so. See row-hover in globals.css.
    // Centred on the row by stretching to its height and centring what is
    // inside, and not by top-1/2 and a translate of its own height back up:
    // a transform makes this box what anything fixed inside it is placed
    // against, and the link in it is pinned as fixed when the apple is
    // pressed — see gravity.tsx — so it was pinned half a page from where it
    // stood.
    <div
      data-own-hover
      className="absolute inset-y-0 left-[var(--margin-note-x)] hidden w-[var(--margin-note)] cursor-auto flex-col justify-center min-[1000px]:flex"
    >
      {lines.map((line, i) => (
        <p key={i} className={`text-base leading-relaxed ${i ? "mt-1" : ""}`}>
          <StudyFact {...line} />
        </p>
      ))}
    </div>
  );
}

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen. That
  // is not only spacing: a page that overflows by even a few dozen pixels hands
  // every upward swipe to the browser as a scroll, and the ribbons lose the
  // gesture — see "Touch behaviour" in globals.css.
  //
  // The top padding is the same 1.5rem at every width, the air the page keeps
  // at all of its edges. The name is the first thing under it and nothing is
  // pinned above the name any more, so there is no row for the padding to
  // clear — where the name has to get under the buttons it does so with a
  // margin of its own, see the h1.
  return (
    <main data-home className="relative pb-8 pt-6 sm:pb-28">
      {/* The name, set in the blackletter — see .fraktur in globals.css, which
          carries the face and pins the weight. It is the one thing on the page
          that is not in the column: it holds the page's top left corner and
          runs most of the width of the window from there, rather than lining
          up with the covers below it. It is the only thing up there on the
          left — the role that used to be pinned in that corner is the first
          words of the intro now.

          From 900px it starts at the very top, on the line the buttons in the
          opposite corner are on. There is room for both: the name is 87% of
          the band and the buttons are in the last 70px of it, so at 900px
          some 40px is left between the last E and the apple, and more above
          that. Under 900px there is not, so the name takes --top-row plus a
          gap as a top margin and sits under the buttons instead. Reading the
          row's height from the variable rather than writing 44px here means
          the two cannot fall out of step.

          The left padding is the page's 1.5rem and 0.0375em more, because
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
          18.5% holds down to a 200px window. What is left over at the right
          is a margin all the same — about 1.5rem of it on a 390px phone.

          18.5% of --page, the band the page is laid out in, rather than of
          the window: the two are the same up to about 1557px, and past that
          the band stops growing and is centred, so the name holds at 18rem
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
          ~8px into its line, so 3.5rem is ~80px of black. A phone shows less,
          in step with its smaller name.

          data-gravity="letters" is for when the apple is pressed: the name
          comes apart a character at a time rather than as "JOHN" and "LEE",
          so each letter waits for its own hover. It is the only thing on the
          page marked that way, and the reason is the size — at 18rem a word
          is a slab, and two of them falling barely reads as the page coming
          apart. Everywhere else the text is small enough that whole words are
          the finer-grained answer, not the coarser one. */}
      <h1
        data-gravity="letters"
        className="fraktur mb-12 mt-[calc(var(--top-row)+1.5rem)] whitespace-nowrap pl-[calc(1.5rem+0.0375em)] text-[length:var(--name-size)] leading-none sm:mb-14 min-[900px]:mt-0"
      >
        {site.name}
      </h1>

      {/* The writing at the top of the page, which is the intro. It is set from
          the page's left edge, under the name and on the line the name's ink
          starts on, rather than in the column with the projects: the name
          holds that corner, and a line about whose name it is reads as part of
          it there, where out in the middle it read as the first of the
          projects. px-6 is the page's margin — the same 1.5rem the notes in
          the margin further down start at.

          Held to the column's measure all the same, so a longer intro breaks
          at a width it can be read at rather than running across the window.

          The buttons are in the corner opposite at every width now, so the
          header no longer reserves the height a row of them used to sit in
          — see "The page on a phone" in globals.css. */}
      <header className="px-6">
        {/* Who that is. A paragraph per line of site.intro, so a sentence that
            should start fresh does, rather than being wrapped into the one
            above it. Set plainly — the size and weight of the page's other
            lines — so only the name leads.

            One margin at every width. */}
        {site.intro.length > 0 && (
          <div className="mt-8 max-w-[var(--column)] space-y-3">
            {site.intro.map((line) => (
              <p key={line} className="text-lg font-medium leading-relaxed text-foreground">
                {line}
              </p>
            ))}
          </div>
        )}
      </header>

      {/* Everything else the page says is one column — a cover, and the writing
          beside it — and the column sits in the middle of the band rather
          than against its left edge. The maximum is what keeps a margin on a
          phone, where the column is wider than the screen. */}
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        {/* One row per project: its cover, and beside that the name and the one
            line that says what the thing is. Nothing here is a press target any
            more — the writing for a project is on the page beside it rather than
            behind it.

            The covers hold the left of the column and the writing the right of
            it, on the same two lines the header above them keeps.

            One number for the room above the first row and the room between
            every row after it. The two are not measured from the same kind of
            edge — the gap under the intro starts at the bottom of a line of
            text, which carries a few pixels of leading below the letters,
            where the gaps between projects start at the hard bottom edge of a
            cover — so the first will read as a touch the larger of the two.
            Held equal on purpose all the same.

            Beside at every width, and centred on the cover rather than hung
            from its top edge — a title and a line under it are shorter than
            the picture beside them, and hung from the top they leave the row
            bottom-heavy. A phone fits the row by shrinking the cover and the
            gap rather than by stacking the two; see "The page on a phone" in
            globals.css. */}
        {/* Each project is its row and, folded under it, everything written
            about it. Pressing the cover unfolds that study in place; reading
            to the end of it folds the row back to the picture and the line it
            was, with the rest of the list under it again. The studies still
            have their own pages at /projects/[slug] — that is the permalink
            for one, and where a cover goes from anywhere but this list.

            The study is rendered here, on the server, and handed to the list
            as markup: what is in the browser's bundle is the switch, not the
            writing. See project-study.tsx. */}
        <ProjectList>
          {entries.map((entry) => {
            const study = caseStudies[entry.slug];
            return (
              <ProjectSection
                key={entry.slug}
                slug={entry.slug}
                study={study ? <StudyBody study={study} inline /> : undefined}
              >
                {/* The row is the switch that opens the study — see ProjectRow.
                    relative so the facts about the project can be set out in
                    the margin beside the cover — see StudyFacts. */}
                <ProjectRow className="relative flex items-center gap-[var(--cover-gap)]">
                  {(entry.images ?? []).map((image, i) => (
                    <ProjectThumbnail
                      key={`${entry.slug}-${i}`}
                      image={image}
                      slug={entry.slug}
                      href={entry.srcHref}
                    />
                  ))}
                  {/* The writing takes whatever the cover leaves on a phone, and
                      its own measure from sm up, where there is room for it.
                      min-w-0 is what lets it be narrower than its longest line —
                      without it a flex item refuses to shrink past its content and
                      pushes the row off the side of the screen.

                      The measure is where it starts from sm up and not a width
                      it is held to: the cover, the gap and the measure come to
                      a little more than a window just over sm has once its
                      margins are off, and held there the row ran 26px off the
                      side. It gives that up and no more, and never grows. */}
                  <div className="min-w-0 flex-1 sm:flex-[0_1_var(--text-width)]">
                    {/* The name is the same switch the cover is — see
                        project-title.tsx.

                        Every project with a study written about it carries an
                        arrow after its name, and the arrow is part of the
                        name: it opens the study, as the name does, and lights
                        with it. It is what says the name can be pressed. The
                        way out to a listing or a site of the project's own is
                        in the margin, on the line that says the project is
                        live there, under the App Store's mark or the chain —
                        see studyFacts in case-study.tsx. */}
                    <h2 className="text-xl font-semibold leading-snug tracking-[-0.02em]">
                      <ProjectTitle slug={entry.slug}>
                        {entry.title}
                        {study && (
                          // A no-break space, so the arrow never starts a line
                          // of its own; hidden from a screen reader, which
                          // would read it out as a direction.
                          <span aria-hidden>{"\u00a0"}↗</span>
                        )}
                      </ProjectTitle>
                    </h2>
                    {/* One line where the window has the room for it, running
                        off the end of the column into the space at the right
                        rather than breaking at the measure. The measure
                        belongs to the study under it, which is a page of
                        writing and needs a line length it can be read at; a
                        blurb is one line about one project, and reads better
                        as one line.

                        It is wider than its box to do that, and how much wider
                        is measured off the window and not off the blurb: it
                        runs to where an open study's right edge is, and breaks
                        there if it has not finished — balanced, so what is
                        left over is a second line and not two words under a
                        full one. It was nowrap once, safe
                        only while the longest blurb was shorter than the room
                        at 1000px — and then a longer one was written, ran off
                        the side of the window and took the page with it.

                        Only from 1000px, the width the facts in the margin
                        appear at. Under that it breaks at the measure, as it
                        always did. */}
                    {entry.blurb && (
                      <p className="mt-3 text-base leading-relaxed text-muted min-[1000px]:w-[calc(var(--study-width)-var(--text-start))] min-[1000px]:text-balance">
                        {entry.blurb}
                      </p>
                    )}
                    {entry.date && (
                      <p className="mt-2 text-base leading-relaxed">
                        Date: {entry.date}
                      </p>
                    )}
                    {entry.tools && (
                      <p className="mt-1 text-base leading-relaxed">
                        Tools: {entry.tools}
                      </p>
                    )}
                    <StudyFacts study={study} />
                  </div>
                </ProjectRow>
              </ProjectSection>
            );
          })}
        </ProjectList>

        {/* What the work was leading to, and the way to answer it. From sm up
            these are not in the column at all: they sit in the band's two
            bottom corners, closing it the way the intro and the buttons open
            it at the top.

            They are pinned to main rather than to the initial containing
            block, which is why main is relative. An absolute box with no
            positioned ancestor resolves bottom against the first viewport, so
            on a page this long it would land somewhere up in the projects
            instead of at the end of them. main's box is the whole document
            at the band's width, and bottom-6 sits inside its pb-28.

            Still in flow below sm, where pb-8 is not deep enough to hold a
            pinned line clear of the last project row. The wrapper keeps that
            phone layout and does nothing else — with both children out of
            flow from sm up it has no height, so its margin goes too.

            The closing line stops short of the right-hand corner by the width
            of the links and a gap, so on a narrow window it wraps upward
            rather than running under them. */}
        <div className="mt-16 flex flex-col gap-4 sm:mt-0 sm:block">
          {site.closing && (
            <p className="text-lg font-medium leading-relaxed text-foreground sm:absolute sm:bottom-6 sm:left-6 sm:right-100">
              {site.closing}
            </p>
          )}
          {/* The other places to find him, his resume, then the way to write
              to him. One line, so it is the line that is pinned and not each
              link. */}
          <nav className="flex gap-6 self-end text-lg font-medium text-foreground sm:absolute sm:bottom-6 sm:right-6">
            {site.links.map(
              (link) =>
                link.href && (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-200 ease-out hover:text-accent"
                  >
                    {link.label}
                  </a>
                ),
            )}
            {/* The download attribute is what makes the click save the file
                rather than open it in the tab. */}
            <a
              href={site.resume.href}
              download={site.resume.filename}
              className="transition-colors duration-200 ease-out hover:text-accent"
            >
              {site.resume.label}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="transition-colors duration-200 ease-out hover:text-accent"
            >
              Email
            </a>
          </nav>
        </div>
      </div>
    </main>
  );
}
