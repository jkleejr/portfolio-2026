// ---------------------------------------------------------------------------
// What a study's page says about itself to the things that read a page without
// showing it: the tab, a search result, and the card Slack, iMessage, LinkedIn
// and the rest draw when its link is pasted.
//
// A study has two addresses — "/" plus its slug, the homepage with that study
// open, and /projects/ plus its slug, the study on a page of its own — and
// both describe themselves from here, so the two cannot come to disagree.
//
// The card is the reason this is more than a title. Next merges the metadata
// of a layout and a page shallowly: a page that says nothing about openGraph
// inherits the layout's whole, which is the homepage's card — so a link to a
// project unfurled as "John Lee — Design Engineer" and pointed back at the
// homepage. And a page that sets openGraph replaces the layout's whole rather
// than adding to it, which is why the site's name and the image are said again
// here, from the one definition the layout uses.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { caseStudies } from "@/data/case-studies";
import { entries } from "@/data/projects";
import { site } from "@/data/site";

/** The parts of the card every page on the site shares. */
export const card = {
  siteName: site.titleName,
  // Wide, as a card wants it. The projects' own pictures are phone screens,
  // which a card would crop to a strip, so every page carries this one.
  images: [{ url: "/og.png", width: 1200, height: 630 }],
};

/** `path` is the address being described, from the root: "/loot-check". */
export function studyMetadata(slug: string, path: string): Metadata {
  const study = caseStudies[slug];
  if (!study) return {};

  // The project first, then the name, joined by a plain hyphen — the tab is
  // read from the left, and the project is what the page is about.
  const title = `${study.title} - ${site.titleName}`;
  // The line that sits under the project's name on the homepage. It is the one
  // sentence written to say what the thing is to someone who has not seen it.
  const description =
    study.tagline ?? entries.find((entry) => entry.slug === slug)?.blurb;

  return {
    title,
    description,
    openGraph: {
      ...card,
      // The card's headline is the project alone. The site's name is on the
      // card already, as siteName, and said twice it crowds the project out.
      title: study.title,
      description,
      // Relative, and resolved against metadataBase in layout.tsx.
      url: path,
      type: "article",
    },
  };
}
