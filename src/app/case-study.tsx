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
// Rendered in two places, and the same markup in both: the page at
// /projects/[slug], and the homepage, where pressing a cover opens the study
// under the project it belongs to. `inline` is the difference between the two
// — see the prop. It is plain markup with no state of its own, so it stays on
// the server even on the homepage, where a client component decides whether it
// is shown; the client bundle carries none of the writing.
// ---------------------------------------------------------------------------

import { type CaseStudy, type CaseStudyBlock } from "@/data/case-studies";
import { RegionDemo } from "./region-demo";
import { ShotStack } from "./shot-stack";
import { SiteLink } from "./site-link";
import { AppStoreBadge, AppStoreMark } from "./title-badge";
import { LinkGlyph } from "./link-glyph";
import { mediaSize } from "./media-size";

// ---------------------------------------------------------------------------
// The facts about a project: where it stands, who did what, and when.
//
//   Live on the App Store ↗
//   Design, iOS dev, Solo
//   Jun–Sep 2026
//
// Where it stands comes first because it is the one a reader acts on — and
// when the project is up somewhere that line is the way there, with a mark
// after it to say it leaves the page. The listing on the App Store if there is
// one, under the App Store's own mark; the project's own site if not, under
// the chain. Either says where the line goes better than an arrow can, and on
// the homepage the arrow is spoken for — it follows the project's name and
// opens the study. The date is last: it is the one that matters least to
// someone deciding whether to read on.
//
// One list for both places the facts are set — the margin beside a project on
// the homepage, and under the title of its study — so the two cannot come to
// say different things.
// ---------------------------------------------------------------------------

/**
 * On every picture in a study: fetched when it is near the window rather than
 * when the study is put on the page, and decoded off the thread that draws.
 *
 * A study is ten or so full-size phone screens, 12MB apiece once decoded, and
 * all of them used to start at the press that opened it — so the decoding and
 * the drawing of them landed in the same third of a second as the study
 * coming up into place, and the frames that dropped were that motion's. Now
 * the press costs the first screen of pictures and the rest arrive ahead of
 * the reader as they scroll. Safe only because each has its size in the
 * markup (media-size.ts): a picture that loads late without one pushes the
 * page down as it lands.
 */
const LATER = { loading: "lazy", decoding: "async" } as const;

/** A size in case-studies.ts, in pixels at full size, as a length that
 *  shrinks with the film on a short window — see --shot in globals.css. */
const shot = (px: number) => `calc(${px} * var(--shot))`;

/** A film's first frame, if one has been saved beside it. */
function poster(src: string): string | undefined {
  const still = src.replace(/\.[a-z0-9]+$/i, "-poster.jpg");
  return mediaSize(still) ? still : undefined;
}

type Fact = { text: string; href?: string; appStore?: boolean };

export function studyFacts(study: CaseStudy): Fact[] {
  const there = study.appStore || study.href || undefined;
  return [
    study.scope && {
      text: study.scope,
      href: there,
      appStore: Boolean(study.appStore),
    },
    study.status && { text: study.status },
    study.role && { text: study.role },
    study.date && { text: study.date },
  ].filter(Boolean) as Fact[];
}

export function StudyFact({ text, href, appStore }: Fact) {
  if (!href) return <>{text}</>;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="transition-colors duration-200 ease-out hover:text-accent"
    >
      {text}
      {/* A no-break space, so the mark is never alone on a line of its own. */}
      {"\u00a0"}
      {/* Both marks are cut to the arrow that follows a project's name on the
          homepage, so the three read as one size of mark: that arrow inks
          14.5px square, at the name's 20px. The measure is the ink and not
          the box, since each mark fills its box differently.

          And both are centred on the capitals beside them. Stood on the
          baseline first — said outright, because Tailwind's reset sets every
          img and svg to vertical-align: middle, which is the middle of the
          lowercase and hangs a mark this size under the line — and then
          lowered by half of what the mark stands taller than Satoshi's
          0.716em capitals by, plus the clear sliver under its ink. */}
      {appStore ? (
        // The exception to the 14.5px, at 17px. Cut to the arrow its tile
        // measured the same and read as smaller: on a dark page the blue tile
        // falls back and what the eye sizes is the white A inside it, which is
        // two thirds of the tile. At 17px — 1.0625em of this line's 16 — the A
        // is 13px across, and it is the A that sits with the arrow and the
        // chain. Important, since the mark sets a height of its own and the
        // two would otherwise be settled by the order the stylesheet happens
        // to come out in.
        <AppStoreMark className="h-[1.0625em]! translate-y-[0.18em] align-baseline" />
      ) : (
        // Drawn from 2 to 22 of its 24 units under a stroke of 2, so a 1em
        // box is 14.6px of chain.
        //
        // A pixel lower than the capitals' middle, which is 0.14em. The line
        // it follows is lowercase but for its first letter — "Live on the
        // web" — and what the eye takes for the middle of that is nearer the
        // middle of the lowercase, 2px further down. Measured dead centre on
        // the capitals it read as riding high; this splits the two.
        <LinkGlyph className="inline-block h-[1em] w-[1em] translate-y-[0.2em] align-baseline" />
      )}
    </a>
  );
}
export function StudyBody({
  study,
  inline,
}: {
  study: CaseStudy;
  /**
   * Set when the study has been opened on the homepage, under the row for its
   * project. There the row is the header: it carries the title, the line
   * saying what the thing is, and — beside the cover, where they belong with
   * the title rather than stranded under it — the date, the role and the
   * scope, which StudyFacts prints while the study is open. So the study
   * starts at its first block, and what is left here is the writing itself.
   *
   * The space at the foot goes too. It belongs to /projects/[slug], where the
   * study is the last thing on the page; on the homepage the gap to the next
   * project sets that distance.
   */
  inline?: boolean;
}) {
  return (
    // No margins of its own: the page around it puts it in the same column the
    // homepage sets everything else in, and starts it at the height the name
    // starts at there.
    <article className={inline ? undefined : "pb-20"}>
      {!inline && (
        <header>
          {/* The title is the way to the live site when there is one — a link
              mark after it says so. A button under the title said the same
              thing at more cost. With no site but a listing on the App Store,
              the title goes there instead, and the App Store mark rides inside
              the same link so the two light up as one. */}
          <h1 className="text-2xl font-bold tracking-[-0.02em]">
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
          {/* The facts, in the order and the words the homepage sets them in
              its margin — see studyFacts. Printed with no labels, so the lines
              read as one small block of facts rather than a form. */}
          {studyFacts(study).map((line, i) => (
            <p
              key={i}
              className={`${i ? "mt-1" : "mt-2"} text-base leading-relaxed`}
            >
              <StudyFact {...line} />
            </p>
          ))}

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
      )}

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

      <div className={`${inline ? "" : "mt-8 "}space-y-4`}>
        {study.blocks.map((block, i) => (
          <Block key={i} block={block} after={study.blocks[i - 1]?.type} />
        ))}
      </div>
    </article>
  );
}

// ---------------------------------------------------------------------------
// A link inside a sentence.
//
// The writing is plain strings, and nearly all of it should stay that way. But
// a sentence sometimes names a place the reader can go — "live on the App
// Store" — and the name should take them there. So a text block or a list
// item may carry a link written the way Markdown writes one, [label](url),
// and this turns each into an anchor, underlined so it reads as a link inside
// the prose, and opening in a tab of its own so the study is still there to
// come back to. A caption under a picture takes one the same way. Everything
// else in the string passes through untouched.
// ---------------------------------------------------------------------------

const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_LINK)) {
    const [whole, label, href] = match;
    const at = match.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    parts.push(
      <a
        key={at}
        href={href}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-foreground/40 underline-offset-4 transition-colors duration-200 ease-out hover:text-accent hover:decoration-accent"
      >
        {label}
      </a>,
    );
    last = at + whole.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
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
      <Inline text={text} />
    </figcaption>
  );
}

/** Blocks a heading needs less room after — see the heading case below. */
const PICTURES = new Set(["image", "images", "video", "region-demo"]);

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
      {
        const lead = after && PICTURES.has(after) ? "pt-2" : "pt-4";
        return (
          <h2
            className={`${lead} relative mb-2 text-xl font-bold leading-snug tracking-[-0.02em]`}
          >
            {/* A line about the section, out in the margin at the left of the
                band rather than in the column — the same margin the project
                above it puts its dates in, so the whole left edge of the page
                is one voice talking about what is beside it.

                Level with the heading, which means level with the words and
                not with the box around them: the padding that opens the
                section sits above the text, so the note starts where the
                heading's own line does. Hence the same number twice.

                Only from 1000px, the width at which there is a margin at all
                — see the note on --margin-note in globals.css. Under that the
                heading stands on its own. */}
            {block.note && (
              <span
                className={`absolute ${lead.replace("pt-", "top-")} left-[var(--margin-note-x)] hidden w-[var(--margin-note)] text-base font-bold leading-relaxed min-[1000px]:block`}
              >
                {block.note}
              </span>
            )}
            {block.text}
          </h2>
        );
      }

    case "text":
      return (
        <p className="text-base leading-relaxed text-body">
          <Inline text={block.text} />
        </p>
      );

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
              <Inline text={item} />
            </li>
          ))}
        </List>
      );
    }

    case "quote":
      return (
        <blockquote className="border-l-2 border-foreground/25 pl-6">
          <p className="text-lg font-medium leading-relaxed text-body">{block.text}</p>
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
            // The file's own width and height, so the room it takes is held
            // before it loads — see media-size.ts. The classes still set how
            // wide it is drawn; these only give it a shape.
            {...mediaSize(block.src)}
            {...LATER}
            className={`mx-auto w-full max-w-full rounded-xl border border-foreground/10 ${
              block.shift ? "sm:translate-x-(--shift)" : ""
            }`}
            // Every size in pixels goes through shot(), so the picture
            // shrinks with the film on a short window rather than holding
            // its size beside a film that has given way.
            style={{
              ...(block.shift
                ? ({ "--shift": shot(block.shift) } as React.CSSProperties)
                : null),
              ...(block.width ? { width: shot(block.width) } : null),
              ...(block.max ? { maxWidth: shot(block.max) } : null),
              ...(block.crop ? { objectPosition: block.crop } : null),
              // With a max, the height is the height at that width and the
              // shot keeps the proportion below it: a phone's column is
              // narrower than the max, and a fixed height there would zoom
              // the shot to fill it and crop the sides away. The proportion
              // is a ratio of two sizes, so it needs no scaling of its own.
              ...(block.height
                ? block.max
                  ? { aspectRatio: `${block.max} / ${block.height}`, objectFit: "cover" }
                  : { height: shot(block.height), objectFit: "cover" }
                : null),
              ...(block.radius ? { borderRadius: shot(block.radius) } : null),
            }}
          />
          <Caption text={block.caption} center={block.captionCenter} />
        </figure>
      );

    case "region-demo":
      // Placed the way an image with the same settings is, above: the
      // column's width up to max, and nudged by shift from sm up. The card
      // draws itself at whatever width that comes to.
      return (
        <figure
          className={`mx-auto w-full overflow-hidden rounded-xl border border-foreground/10 ${
            block.shift ? "sm:translate-x-(--shift)" : ""
          }`}
          style={{
            ...(block.shift
              ? ({ "--shift": shot(block.shift) } as React.CSSProperties)
              : null),
            ...(block.max ? { maxWidth: shot(block.max) } : null),
            ...(block.radius ? { borderRadius: shot(block.radius) } : null),
          }}
        >
          <RegionDemo label={block.alt} />
        </figure>
      );

    case "images":
      // A row that is a pile on a phone — see shot-stack.tsx, which sets the
      // same row from sm up and is the one client component in a study.
      if (block.stackOnPhone) {
        return (
          <figure>
            <ShotStack
              // The sizes go with them as data: the stack is a client
              // component and cannot read the disk for itself.
              items={block.items.map(({ src, alt }) => ({
                src,
                alt,
                ...mediaSize(src),
              }))}
              max={block.max ? shot(block.max) : undefined}
              columns={block.columns}
            />
            <Caption text={block.caption} />
          </figure>
        );
      }
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
          <div
            className="mx-auto flex flex-wrap items-start justify-center gap-4"
            style={block.max ? { maxWidth: shot(block.max) } : undefined}
          >
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
                style={item.width ? { width: shot(item.width) } : undefined}
              >
                {item.scale ? (
                  // The picture alone is what is centred on the shot beside
                  // it: the caption hangs under it out of the flow, since in
                  // the flow it made the pair as tall as the neighbour and
                  // left the picture pinned to the top.
                  <div
                    className="relative"
                    style={{
                      width: `${item.scale * 100}%`,
                      ...(item.lift
                        ? { transform: `translateY(calc(-1 * ${shot(item.lift)}))` }
                        : null),
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.src}
                      alt={item.alt}
                      {...mediaSize(item.src)}
                      {...LATER}
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
                      {...mediaSize(item.src)}
                      {...LATER}
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
        // The width is --film in globals.css — 340px, against files that are
        // 498px wide, and less than that on a window too short to show the
        // film whole; see "A recording that fits the window" there. It is
        // read here three times — the middle grid column, the film's own
        // max-width, and every caption set beside it — so the columns beside
        // the film stay equal and the captions stay on the frame they point
        // at, whatever size it is drawn at.
        //
        // Three columns rather than a caption set out of the flow: the middle
        // one is the video's width, so the two beside it are equal and the
        // video keeps the middle of the page to itself, while the last one
        // runs from the video's right edge to the right edge of the column the
        // page sets everything else in. The caption is an ordinary line in
        // that space — it breaks where a paragraph breaks, so its right edge
        // is the one every other line on the page ends at.
        //
        // Nudged a few pixels left of true centre from sm up. The video is
        // centred to the pixel on the shots under it, but the caption hangs
        // off its right edge, so the pair read as sitting right of a shot
        // centred on its own. Shifted as a whole so the captions keep their
        // place against the video's edges.
        <figure className="sm:grid sm:grid-cols-[1fr_var(--film)_1fr] sm:items-center sm:-translate-x-1.5">
          <video
            src={block.src}
            // Its shape, before a byte of it has arrived. Without it a film
            // is 300 by 150 until its header lands, a tenth of a second after
            // the study is on the page, and then 737 tall at the full 340px
            // — with the captions beside it, which are placed off its height,
            // and everything under it jumping to suit. See media-size.ts.
            {...mediaSize(block.src)}
            // And its first frame, as a picture a fiftieth of its weight, so
            // what holds that room while the film loads is the film and not
            // an empty frame. Sits beside the film as <name>-poster.jpg; a
            // film without one goes without.
            poster={poster(block.src)}
            autoPlay
            muted
            loop
            playsInline
            controls={block.controls}
            // Play, scrub and volume are the whole point of the controls; the
            // rest of what the browser puts there is not.
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            className="mx-auto w-full max-w-[var(--film)] rounded-xl border border-foreground/10 sm:col-start-2"
          />
          {/* A little above the middle of the video, and under it below sm,
              where there is no room beside it.

              Every lift here and on the other side is a fraction of --film:
              the pixels it was measured at on the 340px film, over 340. The
              captions are centred on the film by the grid and then lifted, so
              a lift that scales with the film's width scales with its height
              too, and the caption stays on the frame it was set against when
              the film is drawn smaller on a short window. */}
          {block.caption && (
            <figcaption
              className={`mt-3 text-base italic leading-relaxed sm:col-start-3 sm:mt-0 sm:pl-5 ${
                block.captionHiddenOnPhone ? "max-sm:hidden" : ""
              } ${
                block.captionAlign === "highest"
                  ? "sm:-translate-y-[calc(var(--film)*0.862)]"
                  : block.captionAlign === "higher"
                  ? "sm:-translate-y-[calc(var(--film)*0.853)]"
                  : block.captionAlign === "high"
                    ? "sm:-translate-y-[calc(var(--film)*0.282)]"
                    : "sm:-translate-y-[calc(var(--film)*0.165)]"
              }`}
            >
              {block.caption}
            </figcaption>
          )}
          {/* The column on the other side of the video. Set flush right so it
              ends at the video's left edge, the way the first one starts at
              its right.

              Capped well short of the column it sits in, and pushed to the
              far end of it. The column is a 1fr of a grid measured off the
              band, so on a wide screen a line left to fill it starts a long
              way out to the left and reads as a stray remark rather than a
              note on the video. Held to 15rem it breaks into a narrow block
              stacked against the video's edge, which is what the line beside
              it does on the other side. */}
          {block.captionLeft && (
            <figcaption
              className={`mt-3 space-y-3 text-base italic leading-relaxed sm:col-start-1 sm:row-start-1 sm:mt-0 sm:ml-auto sm:max-w-[15rem] sm:-translate-y-[calc(var(--film)*0.094)] sm:pr-5 sm:text-right ${
                block.captionLeftHiddenOnPhone ? "max-sm:hidden" : ""
              }`}
            >
              {(Array.isArray(block.captionLeft)
                ? block.captionLeft
                : [block.captionLeft]
              ).map((line, i) => (
                // The lines are set apart from where they would fall by
                // translates, which leaves the ones under them where they are.
                // Fractions of --film, like the caption on the other side —
                // 24px, 44px and 40px on the 340px film.
                <p
                  key={line}
                  className={
                    i > 0
                      ? "sm:translate-y-[calc(var(--film)*0.071)]"
                      : block.captionLeftAlign === "low"
                        ? "sm:translate-y-[calc(var(--film)*0.129)]"
                        : "sm:-translate-y-[calc(var(--film)*0.118)]"
                  }
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
