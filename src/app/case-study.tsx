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
import { AppStoreBadge } from "./title-badge";
export function StudyBody({ study }: { study: CaseStudy }) {
  return (
    // No margins of its own: the page around it puts it in the same column the
    // homepage sets everything else in, and starts it at the height the name
    // starts at there.
    <article className="pb-20">
      <header>
        {/* The title is the way to the live site when there is one — a link
            mark after it says so. A button under the title said the same
            thing at more cost. */}
        <h1 className="text-2xl font-bold">
          {study.href ? (
            <SiteLink href={study.href}>{study.title}</SiteLink>
          ) : (
            study.title
          )}
          {/* Outside the title's own link, so the two go to different places
              without one being nested in the other. */}
          {study.appStore !== undefined && (
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
          <Block key={i} block={block} />
        ))}
      </div>
    </article>
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <figcaption className="mt-3 text-base italic leading-relaxed">{text}</figcaption>
  );
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "heading":
      return (
        <h2 className="pt-6 text-xl font-semibold leading-snug">
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
            className="w-full rounded-xl border border-foreground/10"
            style={block.crop ? { objectPosition: block.crop } : undefined}
          />
          <Caption text={block.caption} />
        </figure>
      );

    case "images":
      return (
        <figure>
          {/* A grid rather than a wrapping row: a row shares its width between
              whatever is on it, so a last shot left on its own would blow up
              to the width of the column while the ones above it stayed small.
              Columns hold their size however many shots there are. Two across
              on a phone, three from sm up. */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {block.items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={item.src}
                alt={item.alt}
                className="w-full rounded-xl border border-foreground/10"
              />
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
            className="mx-auto w-full max-w-[280px] rounded-xl border border-foreground/10 sm:col-start-2"
          />
          {/* A little above the middle of the video, and under it below sm,
              where there is no room beside it. */}
          {block.caption && (
            <figcaption className="mt-3 text-base italic leading-relaxed sm:col-start-3 sm:mt-0 sm:-translate-y-14 sm:pl-5">
              {block.caption}
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
