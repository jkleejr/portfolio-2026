"use client";

// ---------------------------------------------------------------------------
// Design two — "Shelf".
//
// The thesis: the screens ARE the portfolio. Design one crops every screenshot
// into a 180px square, which throws away the most characteristic artifact of
// the work — the shape of a phone screen. Here each project gets a shelf of
// uncropped screens at the real aspect ratio of the device it runs on, and the
// page is a neutral gallery wall so the screenshots supply all the colour.
//
// The identity sits in a rail that stays put while the work scrolls past it,
// so the bio never scrolls out of a recruiter's reach.
// ---------------------------------------------------------------------------

import { useContext } from "react";
import Image from "next/image";
import { site } from "@/data/site";
import { entries, type Entry, type EntryImage } from "@/data/projects";
import { CaseStudyContext } from "./case-study";

// Screens are laid out by the shape of the thing they were taken on: a phone
// screenshot stands tall, a browser one lies wide. Heights are picked so both
// shelves take up about the same vertical band.
const SHELF = {
  mobile: { ratio: "9 / 19.5", height: 400, label: "Mobile app" },
  web: { ratio: "16 / 10", height: 260, label: "Website" },
} as const;

function Screen({
  image,
  slug,
  shelf,
}: {
  image: EntryImage;
  slug: string;
  shelf: (typeof SHELF)[keyof typeof SHELF];
}) {
  const open = useContext(CaseStudyContext);

  if (!image.src) return null;

  return (
    <button
      type="button"
      onClick={() => open(slug)}
      className="d2-screen group relative shrink-0 overflow-hidden rounded-[18px] border border-foreground/12 bg-foreground/[0.03]"
      style={{ aspectRatio: shelf.ratio, height: shelf.height }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="420px"
        quality={90}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
      />
    </button>
  );
}

function Project({ entry }: { entry: Entry }) {
  const shelf = SHELF[entry.platform ?? "mobile"];

  return (
    <section className="d2-project">
      <p className="d2-eyebrow">{shelf.label}</p>

      <h2 className="d2-project-title">
        {entry.titleHref ? (
          <a
            href={entry.titleHref}
            target="_blank"
            rel="noreferrer"
            className="d2-title-link"
          >
            {entry.title}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        ) : (
          entry.title
        )}
      </h2>

      <p className="d2-project-body">
        {entry.description}
        {entry.link && (
          <>
            {" "}
            <a
              href={entry.link.href}
              target="_blank"
              rel="noreferrer"
              className="d2-inline-link"
            >
              {entry.link.label}
            </a>
          </>
        )}
      </p>

      {entry.images && entry.images.length > 0 && (
        <div className="d2-shelf">
          {entry.images.map((image, i) => (
            <Screen key={i} image={image} slug={entry.slug} shelf={shelf} />
          ))}
        </div>
      )}
    </section>
  );
}

export function DesignTwo() {
  return (
    <main className="d2">
      <div className="d2-grid">
        <aside className="d2-rail">
          <h1 className="d2-name">{site.name}</h1>
          <p className="d2-eyebrow d2-role">{site.role}</p>
          <p className="d2-bio">{site.bio}</p>

          <div className="d2-links">
            {site.buttons.map((button) => (
              <a
                key={button.label}
                href={button.href}
                target="_blank"
                rel="noreferrer"
                className="d2-link"
              >
                {button.label}
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </a>
            ))}
          </div>
        </aside>

        <div className="d2-work">
          {entries.map((entry) => (
            <Project key={entry.slug} entry={entry} />
          ))}
        </div>
      </div>
    </main>
  );
}
