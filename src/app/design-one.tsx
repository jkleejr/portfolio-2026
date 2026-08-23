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
      </header>

      {/* One gallery, not a block per project: a single column, one cover to a
          row, at the same size on every screen. Each one carries its own
          project, so it opens that case study (or the live site, for entries
          with a srcHref).

          items-start is what keeps a row from being the whole width: without
          it the flex column stretches each link to the container, and the
          press target would run right across the page beside a cover sitting
          at the left of it. Nothing here has to clear the corner stack any
          more — one column never reaches it. */}
      <div className="mx-auto mt-16 flex max-w-[760px] flex-col items-start gap-2 px-6">
        {entries.flatMap((entry) =>
          (entry.images ?? []).map((image, i) => (
            <ProjectThumbnail
              key={`${entry.slug}-${i}`}
              image={image}
              slug={entry.slug}
              href={entry.srcHref}
            />
          )),
        )}
      </div>
    </main>
  );
}
