// ---------------------------------------------------------------------------
// Design one — the original layout.
//
// Moved here unchanged when the design switcher landed. The switcher renders
// this and DesignTwo side by side and shows one at a time, so edits to the
// alternative never touch this file.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { ProjectThumbnail } from "./project-thumbnail";

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen. That
  // is not only spacing: a page that overflows by even a few dozen pixels hands
  // every upward swipe to the browser as a scroll, and the ribbons lose the
  // gesture — see "Touch behaviour" in globals.css.
  //
  // The top padding drops the name to where the intro under it used to start —
  // 1.5rem plus the 112px the name, the role and the gap below them take up —
  // and the whole page follows it down. Only from sm up: on a phone the apple
  // is a row pinned at 6.5rem, and the name would land underneath it.
  return (
    <main className="pb-8 pt-6 sm:pb-28 sm:pt-34">
      {/* Everything the page says is one column — a cover, and the writing
          beside it — and the column sits in the middle of the window rather
          than against its left edge. The maximum is what keeps a margin on a
          phone, where the column is wider than the screen. */}
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        {/* Name and role hold the top of the page, at the left edge of the
            column — the line the covers below them are stacked on. In flow
            rather than absolute, so the gallery always clears them.

            No measure of its own: the header runs the width of the whole
            column, so the intro breaks where the last word of a project's
            line does, out at the right edge of the page's writing.

            The reserved height is what the phone's button row sits in — see
            .home-header in globals.css. */}
        <header className="home-header">
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="mt-1 text-lg font-medium text-foreground">
            {site.role}
          </p>
          {/* Who that is. A paragraph per line of site.intro, so a sentence that
              should start fresh does, rather than being wrapped into the one
              above it. Set exactly as the role above it — same size, same
              weight, same colour — so the two read as one block under the
              name, and only the name leads.

              The top margin is also the phone case: the apple is a row under
              the header there rather than a corner stack, pinned at 6.5rem and
              out of flow, so text that simply followed the role would run under
              it. 5rem clears the row with a gap to spare; from sm up the stack
              is off in the corner and only the gap is wanted. */}
          {site.intro.length > 0 && (
            <div className="mt-20 space-y-3 sm:mt-8">
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

            The first row needs the room between projects above it: any less and
            it reads as more of the intro rather than the start of the work. A
            hair under it, in fact — this gap starts at the bottom of a line of
            text, which carries a few pixels of leading below the letters,
            where the gaps between projects start at the hard bottom edge of a
            cover. Equal numbers would not look equal.

            Beside from sm up, stacked on a phone: a cover and the writing do
            not fit side by side on a narrow screen. The writing sits on the
            middle of its cover rather than at the top of it — a title and a
            line under it are shorter than the picture beside them, and hung
            from the top edge they leave the row bottom-heavy. On a phone
            items-start is what keeps a row from stretching to the width of
            the container. */}
        <div className="mt-17 flex flex-col items-start gap-18">
          {entries.map((entry) => (
            <article
              key={entry.slug}
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-[var(--cover-gap)]"
            >
              {(entry.images ?? []).map((image, i) => (
                <ProjectThumbnail
                  key={`${entry.slug}-${i}`}
                  image={image}
                  slug={entry.slug}
                  href={entry.srcHref}
                />
              ))}
              <div className="w-[var(--text-width)] max-w-full shrink-0">
                <h2 className="text-xl font-semibold leading-snug">
                  {entry.title}
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
