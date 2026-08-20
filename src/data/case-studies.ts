// ---------------------------------------------------------------------------
// CASE STUDIES — this is where you write.
//
// Each key below matches an entry `slug` in projects.ts — one case study per
// project. Clicking ANY thumbnail of a project opens that project's study as
// an overlay over the homepage.
//
// Every project already has a block below with its real title and tagline.
// The prose is all marked TODO — that part is yours. To add a case study for
// a new project, copy any block and change the key.
//
// A study is a title, a tagline, and then body blocks. `cover`, `facts` and
// `links` are still supported but unused — add them back to any study when
// you want a header image, a Role/Timeline strip, or a link button.
//
// Body content is a list of blocks. Available blocks:
//
//   { type: "heading", text: "..." }              a section heading
//   { type: "text",    text: "..." }              a paragraph
//   { type: "list",    items: ["...", "..."] }    a bulleted list
//   { type: "quote",   text: "...",               a pulled-out quote
//                      attribution: "..." }         (attribution optional)
//   { type: "image",   src: "/projects/x.png",    one full-width image
//                      alt: "...", caption: "..." }
//   { type: "images",  items: [{ src, alt }, …] } a row of images, side by side
//   { type: "video",   src: "/projects/x.mp4",    an autoplaying muted loop
//                      caption: "..." }
//   { type: "divider" }                            a horizontal rule
//
// Blocks render in the order you list them, so the study reads top to bottom.
// ---------------------------------------------------------------------------

export type CaseStudyBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[] }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; src: string; alt: string; caption?: string; crop?: string }
  | {
      type: "images";
      items: { src: string; alt: string; crop?: string }[];
      caption?: string;
    }
  | { type: "video"; src: string; caption?: string }
  | { type: "divider" };

export type CaseStudy = {
  title: string;
  tagline?: string; // one line under the title
  // --- all optional, all currently unused; add to a study to switch on ---
  cover?: { src: string; alt: string; crop?: string }; // wide image up top
  facts?: { label: string; value: string }[]; // Role / Timeline / Tools strip
  links?: { label: string; href: string }[]; // buttons, e.g. "Live site"
  blocks: CaseStudyBlock[];
};

export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    tagline:
      "Take a picture of any item to identify it and find its resale value from similar items sold online.",
    blocks: [
      { type: "heading", text: "The problem" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "What I explored" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },
      {
        type: "images",
        items: [
          { src: "/projects/loot-check-2.png", alt: "Item photo capture" },
          {
            src: "/projects/loot-check-3.png",
            alt: "Resale value estimate",
            crop: "50% 58%",
          },
        ],
        caption: "TODO — caption these screens.",
      },

      { type: "heading", text: "The decisions that mattered" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Where it landed" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    tagline:
      "Upload a PDF to hear the text in a natural voice without the annoying formatting and citations.",
    blocks: [
      { type: "heading", text: "The problem" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "What I explored" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-2.png",
            alt: "Reader view with the sentence being read aloud highlighted",
            crop: "50% 34%",
          },
        ],
        caption: "TODO — caption these screens.",
      },

      { type: "heading", text: "The decisions that mattered" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Where it landed" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "screen-translator": {
    title: "Screen Translator",
    tagline:
      "Translate Korean text to English live on your screen, shown through the Dynamic Island on iPhone.",
    blocks: [
      { type: "heading", text: "The problem" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "What I explored" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },

      { type: "heading", text: "The decisions that mattered" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Where it landed" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  sleeptalk: {
    title: "SleepTalk",
    tagline:
      "Record your audio overnight and learn about your sleep talking patterns over time.",
    blocks: [
      { type: "heading", text: "The problem" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "What I explored" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },

      { type: "heading", text: "The decisions that mattered" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Where it landed" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "time-with-tree": {
    title: "Time with Tree",
    tagline:
      "A storefront and inventory dashboard for a tree farm in Sejong, South Korea.",
    blocks: [
      { type: "heading", text: "The problem" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "What I explored" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/time-with-tree-2.jpg",
            alt: "Tree catalog and shop page",
          },
        ],
        caption: "TODO — caption these screens.",
      },

      { type: "heading", text: "The decisions that mattered" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Where it landed" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "buy-side-briefings": {
    title: "Buy Side Briefings",
    tagline:
      "Daily morning and night stock market reports on the catalysts moving the market.",
    blocks: [
      { type: "heading", text: "The problem" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "What I explored" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/buy-side-briefings-2.png",
            alt: "S&P 500 candlestick chart",
          },
          {
            src: "/projects/buy-side-briefings-3.png",
            alt: "Full briefing read view",
          },
        ],
        caption: "TODO — caption these screens.",
      },

      { type: "heading", text: "The decisions that mattered" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Where it landed" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },
};
