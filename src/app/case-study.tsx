// ---------------------------------------------------------------------------
// The written half of a case study: the title, whatever facts and links the
// study carries, and its blocks in order.
//
// Set the way the homepage is set. The title is the size and weight the name
// at the top of the homepage is, a paragraph is the size and colour an intro
// line is, and nothing here carries a measure of its own — the column the page
// puts it in is the same one every line on the homepage breaks at, so a study
// reads as another page of the site and not a document dropped into it.
//
// Rendered by the page at /projects/[slug] and nothing else. It is plain
// markup with no state of its own, so it stays on the server — the client
// bundle carries none of it.
// ---------------------------------------------------------------------------

import { type CaseStudy, type CaseStudyBlock } from "@/data/case-studies";
import { SiteLink } from "./site-link";
import { AppStoreBadge, AppStoreMark } from "./title-badge";
export function StudyBody({ study }: { study: CaseStudy }) {
  return (
    // No margins of its own: the page around it puts it in the same column the
    // homepage sets everything else in, and starts it at the height the name
    // starts at there.
    <article className="pb-20">
      <header>
        {/* The title is the way to the live site when there is one — a link
            mark after it says so. A button under the title said the same
            thing at more cost. With no site but a listing on the App Store,
            the title goes there instead, and the App Store mark rides inside
            the same link so the two light up as one. */}
        <h1 className="text-2xl font-bold">
          {study.href ? (
            <SiteLink href={study.href}>{study.title}</SiteLink>
          ) : study.appStore ? (
            <SiteLink
              href={study.appStore}
              // Sat on the middle of the title's caps rather than the middle
              // of its line box, the way the chain is.
              mark={<AppStoreMark className="shrink-0 translate-y-[0.06em]" />}
            >
              {study.title}
            </SiteLink>
          ) : (
            study.title
          )}
          {/* Its own link after the title's when the two go to different
              places, or a plain mark when there is no listing to go to yet.
              A title that already opens the listing carries the mark itself. */}
          {study.appStore !== undefined && (study.href || !study.appStore) && (
            <AppStoreBadge href={study.appStore} label={study.title} />
          )}
        </h1>
        {study.tagline && (
          <p className="mt-1 text-lg font-medium">{study.tagline}</p>
        )}
        {study.date && (
          <p className="mt-2 text-base leading-relaxed">{study.date}</p>
        )}
        {/* Where the project stands, on the line under the date it belongs to
            — so the two read as one small block of facts about the work. */}
        {study.status && (
          <p className="mt-1 text-base leading-relaxed">{study.status}</p>
        )}

        {study.links && study.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {study.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-foreground/15 bg-foreground/[0.04] px-4 py-2 text-base font-semibold text-foreground transition duration-200 ease-out hover:scale-105 hover:opacity-80"
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {study.facts && study.facts.length > 0 && (
          <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-foreground/10 py-5">
            {study.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="text-base font-semibold">{fact.label}</dt>
                <dd className="mt-1 text-base leading-relaxed">{fact.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </header>

      {study.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={study.cover.src}
          alt={study.cover.alt}
          className="mt-10 h-[220px] w-full rounded-xl border border-foreground/10 object-cover"
          style={
            study.cover.crop ? { objectPosition: study.cover.crop } : undefined
          }
        />
      )}

      <div className="mt-8 space-y-4">
        {study.blocks.map((block, i) => (
          <Block key={i} block={block} after={study.blocks[i - 1]?.type} />
        ))}
      </div>
    </article>
  );
}

function Caption({
  text,
  center,
  hang,
}: {
  text?: string;
  center?: boolean;
  /** Hung under the picture, out of the flow, so it adds nothing to its height. */
  hang?: boolean;
}) {
  if (!text) return null;
  return (
    <figcaption
      className={`mt-3 text-base italic leading-relaxed ${center ? "text-center" : ""} ${
        hang ? "absolute inset-x-0 top-full" : ""
      }`}
    >
      {text}
    </figcaption>
  );
}

/** Blocks a heading needs less room after — see the heading case below. */
const PICTURES = new Set(["image", "images", "video"]);

function Block({
  block,
  after,
}: {
  block: CaseStudyBlock;
  // What the block above this one was, or nothing for the first.
  after?: CaseStudyBlock["type"];
}) {
  switch (block.type) {
    case "heading":
      // A heading opens a section, so it takes its space from what came before
      // rather than sharing the 16px the block list puts between everything —
      // 32px of air above, and 8px under, holding it to the writing it
      // introduces.
      //
      // Less after a picture. A paragraph ends at a baseline with a few pixels
      // of leading hanging under the letters, so some of that 32px is already
      // there before the padding starts; a shot or a recording ends at a hard
      // edge with nothing under it, and the same number reads as a hole. The
      // homepage settles the same argument the same way — see the gap above
      // its first project row.
      return (
        <h2
          className={`${
            after && PICTURES.has(after) ? "pt-2" : "pt-4"
          } mb-2 text-xl font-bold leading-snug`}
        >
          {block.text}
        </h2>
      );

    case "text":
      return <p className="text-base leading-relaxed">{block.text}</p>;

    case "list": {
      // Same list either way — the tag is the only thing that changes, so a
      // numbered one gets read as an ordered list and not as prose that
      // happens to start with a digit.
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className="space-y-3 pl-5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className={`text-base leading-relaxed marker:text-muted ${
                block.ordered ? "list-decimal" : "list-disc"
              }`}
            >
              {item}
            </li>
          ))}
        </List>
      );
    }

    case "quote":
      return (
        <blockquote className="border-l-2 border-foreground/25 pl-6">
          <p className="text-lg font-medium leading-relaxed">{block.text}</p>
          {block.attribution && (
            <cite className="mt-3 block text-base not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    case "image":
      return (
        <figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.src}
            alt={block.alt}
            className="mx-auto w-full max-w-full rounded-xl border border-foreground/10"
            style={{
              ...(block.width ? { width: block.width } : null),
              ...(block.crop ? { objectPosition: block.crop } : null),
            }}
          />
          <Caption text={block.caption} />
        </figure>
      );

    case "images":
      return (
        <figure>
          {/* A wrapping row with each shot sized to a column of the grid it
              would have been: a plain row shares its width between whatever is
              on it, so a last shot left on its own would blow up to the width
              of the column while the ones above it stayed small. Widths are
              set from the same two and three across the grid used, so a shot
              is the same size however many are beside it, and a row that does
              not fill sits in the middle of the column rather than hanging off
              its left edge. Aligned to the top rather than stretched: a row of
              shots that are not all the same shape would otherwise pull the
              short ones to the height of the tallest and squash what is in
              them. */}
          <div className="flex flex-wrap items-start justify-center gap-4">
            {block.items.map((item, i) => (
              // Each shot in a figure of its own that carries the width, so a
              // caption under one shot sits under that shot and not the row.
              <figure
                key={i}
                // fullOnPhone takes the column on a phone and gives the row
                // back from sm up, for a crop that half a column leaves too
                // small to read. It is written after the base width so it wins
                // inside its own media query; an inline `width` still beats
                // both, which is why the two are alternatives.
                //
                // A scaled shot keeps the slot and is centred in it: stretched
                // to the height of its line so it sits level with the shot
                // beside it rather than at the top, and its picture and
                // caption held in the middle.
                className={`w-[calc((100%_-_1rem)/2)] ${
                  block.columns === 2 ? "" : "sm:w-[calc((100%_-_2rem)/3)]"
                } ${item.fullOnPhone ? "max-sm:w-full" : ""} ${
                  item.scale
                    ? "flex flex-col items-center justify-center self-stretch"
                    : ""
                }`}
                style={item.width ? { width: item.width } : undefined}
              >
                {item.scale ? (
                  // The picture alone is what is centred on the shot beside
                  // it: the caption hangs under it out of the flow, since in
                  // the flow it made the pair as tall as the neighbour and
                  // left the picture pinned to the top.
                  <div className="relative" style={{ width: `${item.scale * 100}%` }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full rounded-xl border border-foreground/10"
                    />
                    <Caption text={item.caption} center hang />
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      className="w-full rounded-xl border border-foreground/10"
                    />
                    {/* Centred under the shot, which is itself centred in the row. */}
                    <Caption text={item.caption} center />
                  </>
                )}
              </figure>
            ))}
          </div>
          <Caption text={block.caption} />
        </figure>
      );

    case "video":
      return (
        // Centred in the column rather than filling it: the recordings are
        // shot on a phone, so a full-width one would stand a screen and a half
        // tall. Capped at a phone's width and put in the middle of the page.
        //
        // Three columns rather than a caption set out of the flow: the middle
        // one is the video's width, so the two beside it are equal and the
        // video keeps the middle of the page to itself, while the last one
        // runs from the video's right edge to the right edge of the column the
        // page sets everything else in. The caption is an ordinary line in
        // that space — it breaks where a paragraph breaks, so its right edge
        // is the one every other line on the page ends at.
        <figure className="sm:grid sm:grid-cols-[1fr_280px_1fr] sm:items-center">
          <video
            src={block.src}
            autoPlay
            muted
            loop
            playsInline
            controls={block.controls}
            // Play, scrub and volume are the whole point of the controls; the
            // rest of what the browser puts there is not.
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            className="mx-auto w-full max-w-[280px] rounded-xl border border-foreground/10 sm:col-start-2"
          />
          {/* A little above the middle of the video, and under it below sm,
              where there is no room beside it. */}
          {block.caption && (
            <figcaption
              className={`mt-3 text-base italic leading-relaxed sm:col-start-3 sm:mt-0 sm:pl-5 ${
                block.captionAlign === "high"
                  ? "sm:-translate-y-24"
                  : "sm:-translate-y-14"
              }`}
            >
              {block.caption}
            </figcaption>
          )}
          {/* The column on the other side of the video. Set flush right so it
              ends at the video's left edge, the way the first one starts at
              its right. */}
          {block.captionLeft && (
            <figcaption className="mt-3 space-y-3 text-base italic leading-relaxed sm:col-start-1 sm:row-start-1 sm:mt-0 sm:-translate-y-8 sm:pr-5 sm:text-right">
              {(Array.isArray(block.captionLeft)
                ? block.captionLeft
                : [block.captionLeft]
              ).map((line, i) => (
                // The lines are set apart from where they would fall by
                // translates, which leaves the ones under them where they are.
                <p
                  key={line}
                  className={i === 0 ? "sm:-translate-y-10" : "sm:translate-y-6"}
                >
                  {line}
                </p>
              ))}
            </figcaption>
          )}
        </figure>
      );

    case "divider":
      return (
        <div className="py-6">
          <hr className="border-foreground/10" />
        </div>
      );
  }
}
