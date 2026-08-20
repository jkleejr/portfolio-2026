"use client";

// ---------------------------------------------------------------------------
// The case study overlay.
//
// Thumbnails on the homepage open the matching case study as a panel floating
// over the page. The homepage stays visible down both sides — clicking there
// (or pressing Escape) closes the panel and returns you to it.
//
// Nothing here changes the URL: opening a study is not a navigation, so the
// homepage never unmounts and never loses its scroll position.
// ---------------------------------------------------------------------------

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { caseStudies, type CaseStudy, type CaseStudyBlock } from "@/data/case-studies";
import type { EntryImage } from "@/data/projects";

const EXIT_MS = 200; // must match .cs-closing animation duration in globals.css

const CaseStudyContext = createContext<(slug: string) => void>(() => {});

export function CaseStudyProvider({ children }: { children: React.ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // The thumbnail that opened the panel, so focus can go back to it on close.
  const triggerRef = useRef<HTMLElement | null>(null);

  const open = useCallback((next: string) => {
    if (!caseStudies[next]) return;
    if (exitTimer.current) clearTimeout(exitTimer.current);
    triggerRef.current = document.activeElement as HTMLElement | null;
    setClosing(false);
    setSlug(next);
  }, []);

  const close = useCallback(() => setClosing(true), []);

  // Unmount only after the exit animation has played out.
  useEffect(() => {
    if (!closing) return;
    exitTimer.current = setTimeout(() => {
      setSlug(null);
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

  const study = slug ? caseStudies[slug] : null;

  return (
    <CaseStudyContext.Provider value={open}>
      {children}
      {study && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center ${
            closing ? "cs-closing" : ""
          }`}
        >
          {/* The gutters. Clicking anywhere off the panel closes it, and the
              homepage stays legible underneath. */}
          <button
            type="button"
            aria-label="Close case study and return to the homepage"
            onClick={close}
            className="cs-backdrop absolute inset-0 cursor-default bg-background/70 backdrop-blur-[2px]"
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${study.title} case study`}
            tabIndex={-1}
            className="cs-panel relative flex h-[92vh] w-[calc(100%-1.5rem)] max-w-[900px] flex-col overflow-hidden rounded-2xl border border-foreground/15 bg-background shadow-2xl outline-none"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close case study"
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
              <StudyBody study={study} />
            </div>
          </div>
        </div>
      )}
    </CaseStudyContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Homepage thumbnail. Every image of a project opens that project's case
// study — images never link off-site. The live product is linked from the
// project title and from inside the study itself.
// ---------------------------------------------------------------------------

export function ProjectThumbnail({
  image,
  slug,
}: {
  image: EntryImage;
  slug: string;
}) {
  const open = useContext(CaseStudyContext);
  const study = caseStudies[slug];

  const box = "h-[120px] w-[120px] rounded-lg border border-foreground/10";

  const inner = image.src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.src}
      alt={image.alt}
      className={`${box} object-cover`}
      style={image.crop ? { objectPosition: image.crop } : undefined}
    />
  ) : (
    // A project with no screenshot yet still needs a way into its study.
    <div className={`${box} bg-foreground/[0.02]`} aria-label={image.alt} />
  );

  // Only reachable if a slug has no study — kept so a missing entry degrades
  // to a plain image rather than a button that does nothing.
  if (!study) return inner;

  return (
    <button
      type="button"
      onClick={() => open(slug)}
      aria-label={`Read the ${study.title} case study`}
      className="block cursor-pointer rounded-lg transition-transform duration-200 ease-out hover:scale-105"
    >
      {inner}
    </button>
  );
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
          className="mt-10 h-[320px] w-full rounded-xl border border-foreground/10 object-cover"
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
                className="min-w-[180px] flex-1 rounded-xl border border-foreground/10 object-cover"
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
