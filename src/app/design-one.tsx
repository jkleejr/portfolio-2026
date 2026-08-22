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
import { stackBottom } from "./corner-stack";

export function DesignOne() {
  return (
    <main className="pb-28 pt-6">
      {/* Name and role hold the top-left corner of the page. In flow rather
          than absolute, so the gallery below always clears them. The right
          margin keeps the text off the button stack in the opposite corner.

          On a phone the gallery runs the full width rather than squeezing
          into the column beside the buttons, so it has to start below them.
          Reserving height here is what pushes it down — the sum is in
          globals.css, off the stack's own measurement rather than a number
          that would go stale the next time a button joins it. Wide enough for
          the two to sit side by side and the reserve goes away. */}
      <header
        className="home-header ml-6 mr-20 max-w-[42ch]"
        style={{ "--stack-bottom": stackBottom } as React.CSSProperties}
      >
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
