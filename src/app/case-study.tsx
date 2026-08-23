"use client";

// ---------------------------------------------------------------------------
// The overlay.
//
// Thumbnails on the homepage open a panel floating over the page. A screenshot
// with a title of its own gets a page of its own — the shot, its title, its
// description — and anything else falls back to the whole case study for the
// project it belongs to. The homepage stays visible down both sides — clicking
// there (or pressing Escape) closes the panel and returns you to it.
//
// Nothing here changes the URL: opening a study is not a navigation, so the
// homepage never unmounts and never loses its scroll position.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { caseStudies, type CaseStudy, type CaseStudyBlock } from "@/data/case-studies";
import type { EntryImage } from "@/data/projects";

const EXIT_MS = 200; // must match .cs-closing animation duration in globals.css

// How far a press may travel and still count as a click, in px. Below a hand's
// natural slip; above it the pointer was going somewhere.
const DRAG_SLOP = 5;

type Opened = { slug: string; image?: EntryImage };

/** A screenshot that carries its own writing, rather than the project's. */
function hasOwnPage(image?: EntryImage): boolean {
  return Boolean(image?.title || image?.description);
}

export const CaseStudyContext = createContext<
  (slug: string, image?: EntryImage) => void
>(() => {});

export function CaseStudyProvider({ children }: { children: React.ReactNode }) {
  const [opened, setOpened] = useState<Opened | null>(null);
  const slug = opened?.slug ?? null;
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The thumbnail that opened the panel, so focus can go back to it on close.
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((next: string, image?: EntryImage) => {
    // Nothing to show if the screenshot has no writing and the project has no
    // study either.
    if (!hasOwnPage(image) && !caseStudies[next]) return;
    if (exitTimer.current) clearTimeout(exitTimer.current);
    triggerRef.current = document.activeElement as HTMLElement | null;
    setClosing(false);
    setOpened({ slug: next, image });
  }, []);

  const close = useCallback(() => setClosing(true), []);

  // Unmount only after the exit animation has played out.
  useEffect(() => {
    if (!closing) return;
    exitTimer.current = setTimeout(() => {
      setOpened(null);
      setClosing(false);
      triggerRef.current?.focus?.();
    }, EXIT_MS);
    return () => {
      if (exitTimer.current) clearTimeout(exitTimer.current);
    };
  }, [closing]);

  // Freeze the page behind the panel. The body keeps its scroll offset, so the
  // homepage shows through the gutters exactly where the reader left it. The
  // padding swap covers the width the scrollbar gives up, avoiding a jump.
  useEffect(() => {
    if (!slug) return;
    const { body } = document;
    const gutter = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [slug, close]);

  // Start every study at the top, including when switching between two.
  useEffect(() => {
    if (!slug) return;
    scrollerRef.current?.scrollTo({ top: 0 });
    panelRef.current?.focus();
  }, [slug]);

  useEffect(() => () => {
    if (exitTimer.current) clearTimeout(exitTimer.current);
  }, []);

  // A screenshot's own page wins over the project's study when it has one.
  const page = hasOwnPage(opened?.image) ? opened!.image! : null;
  const study = !page && slug ? caseStudies[slug] : null;
  const title = page?.title ?? study?.title ?? "";

  return (
    <CaseStudyContext.Provider value={open}>
      {children}
      {(page || study) && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            closing ? "cs-closing" : ""
          }`}
        >
          {/* The gutters. Clicking anywhere off the panel closes it, and the
              homepage stays legible underneath. */}
          <button
            type="button"
            aria-label="Close and return to the homepage"
            onClick={close}
            className="cs-backdrop absolute inset-0 cursor-default bg-background/70 backdrop-blur-[2px]"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={page ? title : `${title} case study`}
            tabIndex={-1}
            className="cs-panel relative flex h-[92vh] w-[calc(100%-1.5rem)] max-w-[900px] flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-background shadow-2xl outline-none"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-background/80 text-foreground backdrop-blur transition duration-200 ease-out hover:scale-110 hover:opacity-80"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <div
              ref={scrollerRef}
              className="cs-scroll flex-1 overflow-y-auto overscroll-contain"
            >
              {page ? <ImageBody image={page} /> : study && <StudyBody study={study} />}
            </div>
          </div>
        </div>
      )}
    </CaseStudyContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// A dot painted over a cover that drifts toward the pointer, so the mark looks
// like it is watching the cursor. It leans in the pointer's direction and stops
// at `travel`, rather than tracking it one-to-one — the movement should read as
// a glance, not a drag.
// ---------------------------------------------------------------------------

function CoverDot({ dot }: { dot: NonNullable<EntryImage["coverDot"]> }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [lean, setLean] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Coalesce to one update a frame: mousemove fires far more often than the
    // screen refreshes, and each update costs a layout read.
    let frame = 0;
    const onMove = (e: MouseEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const dx = e.clientX - (box.left + box.width / 2);
        const dy = e.clientY - (box.top + box.height / 2);
        const distance = Math.hypot(dx, dy);
        if (distance < 1) return setLean({ x: 0, y: 0 });
        setLean({ x: dx / distance, y: dy / distance });
      });
    };

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute rounded-full transition-transform duration-300 ease-out"
      style={{
        left: `${dot.x}%`,
        top: `${dot.y}%`,
        width: `${dot.size}%`,
        aspectRatio: "1",
        background: dot.color,
        // -50% centres it on (x, y); the lean rides on top of that. `travel`
        // is a share of the thumbnail, but a percentage translate is a share
        // of the element being moved, so it is rescaled against the dot's own
        // width here.
        transform: `translate(-50%, -50%) translate(${
          (lean.x * dot.travel * 100) / dot.size
        }%, ${(lean.y * dot.travel * 100) / dot.size}%)`,
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// A single screenshot's page: the shot, its title, its description. Laid out
// like StudyBody's header so the two read as the same kind of page.
// ---------------------------------------------------------------------------

function ImageBody({ image }: { image: EntryImage }) {
  return (
    <article className="px-6 pb-20 pt-14 md:px-14">
      <header className="max-w-[68ch]">
        {image.title && (
          <h2 className="text-3xl font-bold leading-tight">{image.title}</h2>
        )}
        {image.description && (
          <p className="mt-3 text-lg leading-relaxed text-muted">
            {image.description}
          </p>
        )}
      </header>

      {image.src && (
        // Bounded by height rather than width. These are portrait phone
        // screenshots: capping the width still left them taller than the panel,
        // and a wide shot would need the opposite cap anyway. With both maxima
        // and auto sizing, the browser fits the shot inside the box and keeps
        // its aspect ratio, whichever way round it is.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image.src}
          alt={image.alt}
          className="mt-8 h-auto max-h-[68vh] w-auto max-w-full rounded-xl border border-foreground/10"
        />
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// Homepage cover. A picture and nothing more: the writing for a project is
// going on the homepage beside it, so there is no longer anywhere for a press
// to go and the cover does not offer one. The exception is an entry with a
// `srcHref`, which still opens the live site — seeing the real thing is not
// something the page beside it can stand in for.
// ---------------------------------------------------------------------------

export function ProjectThumbnail({
  image,
  slug,
  href,
}: {
  image: EntryImage;
  slug: string;
  href?: string;
}) {
  const label = image.title ?? caseStudies[slug]?.title;

  // A cover brings its own background, so the hairline that frames a
  // screenshot just reads as an outline around it — drop it for covers.
  // One size everywhere, now that the gallery is a single column: there is no
  // width to divide up, and 220px still leaves room beside it on the narrowest
  // phone.
  const size = "h-[220px] w-[220px]";
  const box = image.cover
    ? `${size} rounded-lg`
    : `${size} rounded-lg border border-foreground/10`;

  // A cover stands in for the screenshot on the homepage only — image.src is
  // still the shot itself. `crop` frames that shot, so a cover ignores it.
  const shown = image.cover ?? image.src;

  // The screenshots are ~1200px wide, so letting the browser squeeze one into a
  // 220px box is a ~5x downscale that its cheap filter turns to mush. next/image
  // resamples them properly and ships a 2x variant for retina screens instead.
  const inner = shown ? (
    // Marked for gravity: with no button around it any more, the box is the
    // outermost thing here, and without the marker the image inside would fall
    // out of its own frame and leave the dot painted on it behind.
    <div data-gravity="piece" className={`${box} relative overflow-hidden`}>
      <Image
        src={shown}
        alt={image.alt}
        fill
        sizes="220px"
        quality={90}
        className="object-cover"
        style={
          !image.cover && image.crop ? { objectPosition: image.crop } : undefined
        }
      />
      {image.coverDot && <CoverDot dot={image.coverDot} />}
    </div>
  ) : (
    // A project whose cover has not been taken yet still holds its row.
    <div className={`${box} bg-foreground/[0.02]`} aria-label={image.alt} />
  );

  const lift =
    "block cursor-pointer rounded-lg transition-transform duration-200 ease-out hover:scale-105";

  // A throw is not a click. With gravity on a cover can be grabbed and flung,
  // and the release still lands on the cover the hand was carrying — which the
  // browser reports as a click, and which would leave the page for the live
  // site mid-game. So measure the press: anything that travels further than a
  // slip is a drag and goes nowhere. A press that stays put follows the link,
  // gravity or not.
  //
  // Keyboard activation comes through with no pointerdown before it and so is
  // never a drag.
  const pressedAt = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    pressedAt.current = { x: e.clientX, y: e.clientY };
  };
  const dragged = (e: React.MouseEvent) => {
    const from = pressedAt.current;
    pressedAt.current = null;
    return Boolean(from) && Math.hypot(e.clientX - from!.x, e.clientY - from!.y) > DRAG_SLOP;
  };

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label={`Visit ${label ?? image.alt}`}
        className={lift}
        onPointerDown={onPointerDown}
        onClick={(e) => {
          if (dragged(e)) e.preventDefault();
        }}
      >
        {inner}
      </a>
    );
  }

  return inner;
}

// ---------------------------------------------------------------------------
// Rendering the written content
// ---------------------------------------------------------------------------

function StudyBody({ study }: { study: CaseStudy }) {
  return (
    <article className="px-6 pb-20 pt-14 md:px-14">
      <header className="max-w-[68ch]">
        <h2 className="text-3xl font-bold leading-tight">{study.title}</h2>
        {study.tagline && (
          <p className="mt-3 text-lg leading-relaxed text-muted">{study.tagline}</p>
        )}

        {study.links && study.links.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {study.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-foreground/15 bg-foreground/[0.04] px-4 py-2 text-sm font-semibold text-foreground transition duration-200 ease-out hover:scale-105 hover:opacity-80"
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
                <dt className="text-xs font-semibold uppercase tracking-wider text-muted">
                  {fact.label}
                </dt>
                <dd className="mt-1 text-base font-medium">{fact.value}</dd>
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
          className="mt-10 h-[220px] w-full max-w-[68ch] rounded-xl border border-foreground/10 object-cover"
          style={study.cover.crop ? { objectPosition: study.cover.crop } : undefined}
        />
      )}

      <div className="mt-8 space-y-7">
        {study.blocks.map((block, i) => (
          <Block key={i} block={block} />
        ))}
      </div>
    </article>
  );
}

function Caption({ text }: { text?: string }) {
  if (!text) return null;
  return <figcaption className="mt-3 text-sm leading-relaxed text-muted">{text}</figcaption>;
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.type) {
    case "heading":
      return <h3 className="pt-6 text-xl font-bold">{block.text}</h3>;

    case "text":
      return (
        <p className="max-w-[68ch] text-lg leading-relaxed text-foreground">{block.text}</p>
      );

    case "list":
      return (
        <ul className="max-w-[68ch] space-y-3 pl-5">
          {block.items.map((item, i) => (
            <li key={i} className="list-disc text-lg leading-relaxed marker:text-muted">
              {item}
            </li>
          ))}
        </ul>
      );

    case "quote":
      return (
        <blockquote className="max-w-[62ch] border-l-2 border-foreground/25 pl-6">
          <p className="text-xl font-medium leading-relaxed">{block.text}</p>
          {block.attribution && (
            <cite className="mt-3 block text-sm not-italic text-muted">
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
            className="w-full max-w-[68ch] rounded-xl border border-foreground/10"
            style={block.crop ? { objectPosition: block.crop } : undefined}
          />
          <Caption text={block.caption} />
        </figure>
      );

    case "images":
      return (
        <figure>
          <div className="flex max-w-[68ch] flex-wrap gap-4">
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
