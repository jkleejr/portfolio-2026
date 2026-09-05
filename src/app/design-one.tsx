// ---------------------------------------------------------------------------
// Design one — the original layout.
//
// Moved here unchanged when the design switcher landed. The switcher renders
// this and DesignTwo side by side and shows one at a time, so edits to the
// alternative never touch this file.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { caseStudies } from "@/data/case-studies";
import { StudyBody } from "./case-study";
import { ProjectList, ProjectSection, StudyFacts } from "./project-study";
import { ProjectThumbnail } from "./project-thumbnail";
import { AppStoreBadge, SiteBadge } from "./title-badge";

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen. That
  // is not only spacing: a page that overflows by even a few dozen pixels hands
  // every upward swipe to the browser as a scroll, and the ribbons lose the
  // gesture — see "Touch behaviour" in globals.css.
  //
  // The top padding drops the name to where the intro under it used to start —
  // 1.5rem plus the 112px the name, the role and the gap below them took up
  // back when all three were in flow — and the whole page follows it down. It
  // also clears the row pinned across the top, the role and the buttons, which
  // 8.5rem does comfortably. Only from sm up: a phone keeps the small padding,
  // and the name clears that row with a margin of its own instead.
  return (
    <main data-home className="relative pb-8 pt-6 sm:pb-28 sm:pt-34">
      {/* The name, set in the blackletter — see .fraktur in globals.css, which
          carries the face and pins the weight. It is the one thing on the page
          that is not in the column: it runs the width of the window and is
          centred in that, rather than lining up with the covers below it.

          The top margin is what keeps it under the row pinned across the top
          of the page — the role at the left, the buttons at the right. That
          row is the fixed thing; the name is what moves. From sm up main's own
          8.5rem of padding already clears it and the margin comes off, but a
          phone keeps main's padding small, so the name takes --top-row plus a
          gap of its own. Reading the row's height from the variable rather
          than writing 44px here means the two cannot fall out of step.

          One row at every width, which is why whitespace-nowrap carries no
          breakpoint. It is also why the name is out here rather than in the
          column: "JOHN LEE" is far wider than the column's 628px at any
          display size worth using, so in there it always broke in two.

          Which makes the window what the size has to fit, and the whole
          string, not its longest word. There is no give to spare: nowrap
          cannot break, so going over does not wrap, it scrolls the page
          sideways.

          4.71em of text against the window less the padding is the whole sum,
          which makes the padding worth as much as the size. px-4 on a phone
          rather than px-6 buys 1rem of width, and that rem is what lets the
          size be 18.5vw and still hold down to a 250px window — at px-6 the
          same 18.5vw would give out at 375px, inside phone territory. From sm
          up the padding goes back to px-6, where the extra rem buys nothing:
          the size is capped at 18rem long before the window gets tight.

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

          data-gravity="letters" is for when the apple is pressed: the name
          comes apart a character at a time rather than as "JOHN" and "LEE",
          so each letter waits for its own hover. It is the only thing on the
          page marked that way, and the reason is the size — at 18rem a word
          is a slab, and two of them falling barely reads as the page coming
          apart. Everywhere else the text is small enough that whole words are
          the finer-grained answer, not the coarser one. */}
      <h1
        data-gravity="letters"
        className="fraktur mb-16 mt-[calc(var(--top-row)+1.5rem)] whitespace-nowrap px-4 text-center text-[length:var(--name-size)] leading-none sm:mb-24 sm:mt-0 sm:px-6"
      >
        {site.name}
      </h1>

      {/* Everything the page says is one column — a cover, and the writing
          beside it — and the column sits in the middle of the window rather
          than against its left edge. The maximum is what keeps a margin on a
          phone, where the column is wider than the screen. */}
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        {/* The writing at the top of the page. The name is no longer in here
            — it is above, spanning the window — and the role is pinned to the
            page's top left corner from sm up, opposite the buttons. What is
            left in flow is the intro.

            No measure of its own: the header runs the width of the whole
            column, so the intro breaks where the last word of a project's
            line does, out at the right edge of the page's writing.

            The buttons are in the corner opposite at every width now, so the
            header no longer reserves the height a row of them used to sit in
            — see "The page on a phone" in globals.css. */}
        <header>
          {/* The role holds the page's top left corner at every width, and
              the buttons in layout.tsx the top right — one row across the top,
              which is the layout's fixed point. Nothing here moves with the
              window; it is the name below that gets out of the way, by taking
              a top margin on a phone. See the note on it above.

              h-11 is that row's height, the apple's box, and the role is
              centred in it so its text sits on the buttons' middle rather
              than at the top of them. Only on a phone, where the row is tight
              enough for the difference to show — from sm up the role is a
              plain block in its corner, which is what it was. */}
          <p className="absolute left-6 top-6 z-20 flex h-11 items-center text-lg font-medium text-foreground sm:block sm:h-auto">
            {site.role}
          </p>
          {/* Who that is. A paragraph per line of site.intro, so a sentence that
              should start fresh does, rather than being wrapped into the one
              above it. Set exactly as the role above it — same size, same
              weight, same colour — so the two read as one block under the
              name, and only the name leads.

              One margin at every width, now that nothing is pinned between
              the role and this. */}
          {site.intro.length > 0 && (
            <div className="mt-8 space-y-3">
              {site.intro.map((line) => (
                <p key={line} className="text-lg font-medium leading-relaxed text-foreground">
                  {line}
                </p>
              ))}
            </div>
          )}
        </header>

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
                <article className="flex items-center gap-[var(--cover-gap)]">
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
                      pushes the row off the side of the screen. */}
                  <div className="min-w-0 flex-1 sm:w-[var(--text-width)] sm:flex-none sm:shrink-0">
                    <h2 className="text-xl font-semibold leading-snug">
                      {entry.title}
                      {entry.appStore !== undefined && (
                        <AppStoreBadge href={entry.appStore} label={entry.title} />
                      )}
                      {entry.titleHref && (
                        <SiteBadge href={entry.titleHref} label={entry.title} />
                      )}
                    </h2>
                    {entry.blurb && (
                      <p className="mt-3 text-base leading-relaxed">
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
                    {/* Only while the study under this row is open — the closed
                        list says what a project is in one line and stops. */}
                    <StudyFacts
                      date={study?.date}
                      status={study?.status}
                      role={study?.role}
                      scope={study?.scope}
                    />
                  </div>
                </article>
              </ProjectSection>
            );
          })}
        </ProjectList>

        {/* What the work was leading to, and the way to answer it. From sm up
            these are not in the column at all: they sit in the page's two
            bottom corners, closing it the way the role and the buttons open it
            at the top.

            They are pinned to main rather than to the initial containing
            block, which is why main is relative. An absolute box with no
            positioned ancestor resolves bottom against the first viewport, so
            on a page this long it would land somewhere up in the projects
            instead of at the end of them. main's box is the whole document,
            and bottom-6 sits inside its pb-28.

            Still in flow below sm, where pb-8 is not deep enough to hold a
            pinned line clear of the last project row. The wrapper keeps that
            phone layout and does nothing else — with both children out of
            flow from sm up it has no height, so its margin goes too. */}
        <div className="mt-16 flex flex-col gap-4 sm:mt-0 sm:block">
          {site.closing && (
            <p className="text-lg font-medium leading-relaxed text-foreground sm:absolute sm:bottom-6 sm:left-6">
              {site.closing}
            </p>
          )}
          <a
            href={`mailto:${site.email}`}
            className="self-end text-lg font-medium text-foreground transition-opacity duration-200 ease-out hover:opacity-70 sm:absolute sm:bottom-6 sm:right-6"
          >
            Contact
          </a>
        </div>
      </div>
    </main>
  );
}
