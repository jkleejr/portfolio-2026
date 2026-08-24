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
export function StudyBody({ study }: { study: CaseStudy }) {
  return (
    // No margins of its own: the page around it puts it in the same column the
    // homepage sets everything else in, and starts it at the height the name
    // starts at there.
    <article className="pb-20">
      <header>
        <h1 className="text-2xl font-bold">{study.title}</h1>
        {study.tagline && (
          <p className="mt-1 text-lg font-medium">{study.tagline}</p>
        )}
        {study.date && (
          <p className="mt-2 text-base leading-relaxed">{study.date}</p>
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
    <figcaption className="mt-3 text-base leading-relaxed">{text}</figcaption>
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

    case "list":
      return (
        <ul className="space-y-3 pl-5">
          {block.items.map((item, i) => (
            <li
              key={i}
              className="list-disc text-base leading-relaxed marker:text-muted"
            >
              {item}
            </li>
          ))}
        </ul>
      );

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
          <div className="flex flex-wrap gap-4">
            {block.items.map((item, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={item.src}
                alt={item.alt}
                className="min-w-[140px] flex-1 rounded-xl border border-foreground/10 object-cover"
                style={item.crop ? { objectPosition: item.crop } : undefined}
              />
            ))}
          </div>
          <Caption text={block.caption} />
        </figure>
      );

    case "video":
      return (
        <figure>
          <video
            src={block.src}
            autoPlay
            muted
            loop
            playsInline
            className="w-full rounded-xl border border-foreground/10"
          />
          <Caption text={block.caption} />
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
