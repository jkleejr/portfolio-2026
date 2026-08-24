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

      {/* One row per project: the name and the one line that says what the
          thing is, and the cover to the right of them. Nothing here is a press
          target any more — the writing for a project is on the page beside it
          rather than behind it.

          The text column is the intro's measure, and the gallery starts at the
          same left margin as the header, so every line on the page begins and
          breaks at the same two points however far down it sits. Which is also
          why the first row needs room above it: in one column with the intro,
          a small gap reads as the next paragraph of it rather than the start
          of the work. The same room as between one project and the next, so
          the column keeps one rhythm the whole way down. A width
          rather than a maximum: the covers line up in a column of their own
          only if the text beside them always takes the same room, whatever it
          says.

          Beside from sm up, stacked on a phone: 30ch of text and a 220px cover
          do not fit side by side on a narrow screen. items-start does two jobs
          — it starts the cover level with the project's name rather than
          centring it against the block, and it keeps a row from stretching to
          the width of the container. */}
      <div className="ml-6 mt-20 flex flex-col items-start gap-20">
        {entries.map((entry) => (
          <article
            key={entry.slug}
            className="flex flex-col items-start gap-4 sm:flex-row sm:gap-12"
          >
            <div className="w-[30ch] max-w-full shrink-0">
              <h2 className="text-xl font-semibold leading-snug">
                {entry.title}
              </h2>
              {entry.blurb && (
                <p className="mt-3 text-base leading-relaxed">{entry.blurb}</p>
              )}
            </div>
            {(entry.images ?? []).map((image, i) => (
              <ProjectThumbnail
                key={`${entry.slug}-${i}`}
                image={image}
                slug={entry.slug}
                href={entry.srcHref}
              />
            ))}
          </article>
        ))}
      </div>
    </main>
  );
}
