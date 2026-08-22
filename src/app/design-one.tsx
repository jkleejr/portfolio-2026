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

      {/* One gallery, not a block per project: every screenshot flows in the
          same row and wraps to the next line when the width runs out. Each
          one still carries its own project, so it opens that case study (or
          the live site, for entries with a srcHref).

          A phone is too narrow for the thumbnails to keep their fixed size
          and still fit two across, so there it becomes a two-column grid and
          they take whatever half the width comes to. From sm up there is room
          for the fixed size, and the flow that wraps them goes back to being
          the one that decides how many fit — along with the right padding
          that keeps that first row clear of the buttons. */}
      <div className="mx-auto mt-16 grid max-w-[760px] grid-cols-2 gap-2 px-6 sm:flex sm:flex-wrap sm:pr-20 lg:pr-6">
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
