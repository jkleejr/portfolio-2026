// ---------------------------------------------------------------------------
// Design one — the original layout.
//
// Moved here unchanged when the design switcher landed. The switcher renders
// this and DesignTwo side by side and shows one at a time, so edits to the
// alternative never touch this file.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { ProjectThumbnail } from "./case-study";

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen. That
  // is not only spacing: a page that overflows by even a few dozen pixels hands
  // every upward swipe to the browser as a scroll, and the ribbons lose the
  // gesture — see "Touch behaviour" in globals.css.
  return (
    <main className="pb-8 pt-6 sm:pb-28">
      {/* Name and role hold the top-left corner of the page. In flow rather
          than absolute, so the gallery below always clears them. The right
          margin keeps the text off the button stack in the opposite corner.

          On a phone the buttons are a row under this text rather than a
          column beside it, so the right margin that keeps the two apart is
          only wanted from sm up. The reserved height is what the row sits in
          — see .home-header in globals.css. */}
      <header className="home-header ml-6 max-w-[42ch] sm:mr-20">
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="mt-1 text-lg font-medium text-foreground">{site.role}</p>
        {/* Who that is. A paragraph per line of site.intro, so a sentence that
            should start fresh does, rather than being wrapped into the one
            above it. Set at body size, so the name and the role above it lead
            on weight and size rather than on colour.

            A measure of its own, narrower than the header's: the gallery below
            is centred, so a line that ran the full 42ch would reach past the
            left edge of the covers on a wide screen. 30ch keeps the paragraph
            a block in the left margin, wrapping well before it gets there.

            The top margin is also the phone case: the apple is a row under
            the header there rather than a corner stack, pinned at 6.5rem and
            out of flow, so text that simply followed the role would run under
            it. 6rem clears the row with a gap to spare; from sm up the stack
            is off in the corner and only the gap is wanted. */}
        {site.intro.length > 0 && (
          <div className="mt-24 max-w-[30ch] space-y-3 sm:mt-12">
            {site.intro.map((line) => (
              <p key={line} className="text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>
        )}
      </header>

      {/* One row per project: its cover, and beside that the name and the one
          line that says what the thing is. Nothing here is a press target any
          more — the writing for a project is going on the page beside it
          rather than behind it.

          Beside from sm up, stacked under on a phone: a 220px cover leaves
          about 80px of a narrow screen, which is no width to set a sentence
          in. items-start keeps a row from stretching to the container, so the
          press target ends at the cover rather than running across the page
          beside it. */}
      <div className="mx-auto mt-2 flex max-w-[760px] flex-col items-start gap-12 px-6">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-7"
          >
            {(entry.images ?? []).map((image, i) => (
              <ProjectThumbnail
                key={`${entry.slug}-${i}`}
                image={image}
                slug={entry.slug}
                href={entry.srcHref}
              />
            ))}
            <div className="max-w-[42ch]">
              <h2 className="text-xl font-semibold leading-snug">
                {entry.title}
              </h2>
              {entry.blurb && (
                <p className="mt-2 text-base leading-relaxed">{entry.blurb}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
