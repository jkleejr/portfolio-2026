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
import { AppStoreBadge, SiteBadge } from "./title-badge";

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen. That
  // is not only spacing: a page that overflows by even a few dozen pixels hands
  // every upward swipe to the browser as a scroll, and the ribbons lose the
  // gesture — see "Touch behaviour" in globals.css.
  //
  // The top padding drops the name to where the intro under it used to start —
  // 1.5rem plus the 112px the name, the role and the gap below them take up —
  // and the whole page follows it down. Only from sm up: on a phone the name
  // holds the top left, level with the buttons in the opposite corner.
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

            The buttons are in the corner opposite at every width now, so the
            header no longer reserves the height a row of them used to sit in
            — see "The page on a phone" in globals.css. */}
        <header>
          <h1 className="text-2xl font-bold">{site.name}</h1>
          <p className="mt-1 text-lg font-medium text-foreground">
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
        <div className="mt-16 flex flex-col items-start gap-16">
          {entries.map((entry) => (
            <article
              key={entry.slug}
              className="flex items-center gap-[var(--cover-gap)]"
            >
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
