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
  return (
    <main className="mx-auto max-w-[760px] px-6 pb-28 pt-20 pr-20 md:pr-6 md:pt-28">
      {/* Intro */}
      <h1 className="text-2xl font-bold">{site.name}</h1>
      <p className="mt-1 text-lg font-medium text-foreground">{site.role}</p>

      <p className="mt-8 text-lg leading-relaxed text-foreground">
        {site.bio}
      </p>

      {/* Currently working on */}
      <h2 className="mt-16 text-lg font-bold">{site.sectionHeading}</h2>

      {/* One gallery, not a block per project: every screenshot flows in the
          same row and wraps to the next line when the width runs out. Each
          one still carries its own project, so it opens that case study (or
          the live site, for entries with a srcHref). */}
      <div className="mt-12 flex flex-wrap gap-2">
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
