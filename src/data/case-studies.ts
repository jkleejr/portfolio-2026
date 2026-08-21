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

// Discovery, Define, Ideate, Design, Develop, Test

// overview
// background
// redesign / design
// final thoughts


// problem solving, tradeoffs, development choices
// assume 20 second scan, 1 minute read... need to have an interesting visual design, cant be basic 



export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    tagline:
      "Take a picture of any item to identify it and find its resale value.",
    blocks: [

      //empathize & define, context
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "Moving out of my apartment, I wanted a quick way to tell whether things were worth selling — and couldn't find an app that was fast, accurate, and actually well designed.",
      },
      {
        type: "text",
        text: "Many apps could identify items from a photo, but they buried the feature under cluttered, dated interfaces and required a subscription after a few free scans.",      },
// the opportunity, or the solution?
      { type: "heading", text: "Solution" },
      {
        type: "text",
// Keeps your sentence structure, tightened
        text: "A simple app that allows users to photograph any item and get its name, resale value, and where to sell it.",      },

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
      },
//ideate, prototype
//shaping the product
      { type: "heading", text: "Designing the experience" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      //testing, development, iteration
      { type: "heading", text: "Development" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      //Implementation, launch, results, whats next
      { type: "divider" },

      { type: "heading", text: "Outcome" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    tagline:
      "Upload a PDF to hear the text in a natural voice without unnecessary formatting and citations.",
    blocks: [
      // context, problem, pain point
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "A friend tried listening to a paper while walking and got '[1] et al., pp. 234–256' read aloud in a robot voice. She wanted an app that fixed both the formatting and the voice.",
      },

      // the opportunity, the solution
      { type: "heading", text: "Solution" },
      
      {
        type: "text",
        text: "An app that allows users to upload a PDF and hear the text in a natural voice without the formatting and citations.",     
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
//shaping the product, ideate, prototype
      
      { type: "heading", text: "Designing the experience" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },
      //testing, development, iteration, choices, tradeoffs
      { type: "heading", text: "Development" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Outcome" },
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
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "Opportunity" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },

      { type: "heading", text: "Ideation" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },
      { type: "heading", text: "Designing the experience" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "heading", text: "Development" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Outcome" },
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
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      { type: "heading", text: "Opportunity" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },

      { type: "heading", text: "Ideation" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },
      { type: "heading", text: "Designing the experience" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },
      { type: "heading", text: "Development" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      { type: "divider" },

      { type: "heading", text: "Outcome" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "time-with-tree": {
    title: "Time with Tree",
    tagline:
      "An e-commerce website for a tree farm in Sejong, South Korea.",
    blocks: [
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "Time with Tree is a Birch tree farm in Sejong, South Korea. The client wanted to sell their trees online, but they didn't have a website or an online store.",
      },

      // following expectations from client, so less ideation 
      // looked at other true farm websites in Korea 
       { type: "heading", text: "Ideation" },
      {
        type: "text",
        text: "TODO — the approaches you tried, including the ones you threw away.",
      },

            //iteration, choices, tradeoffs
      // used lovable, easy to build a basic website, but hard to make changes using Lovable UI

      { type: "heading", text: "Designing the website" },
      {
        // dns setup, seo strategy, 
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
      },

      
      { type: "divider" },

      { type: "heading", text: "Outcome" },
      {
        // naver seo, google seo, coupang
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
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      // briefings initially had a buy, sell, hold recommendation after every briefing
      { type: "heading", text: "Ideation" },
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
      },
      // claude code, figma ai, generating ai redesigns at first to get more ideas

      { type: "heading", text: "Designing the website" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },

      // claude code
      { type: "heading", text: "Development" },
      {
        type: "list",
        items: [
          "TODO — a specific decision and the tradeoff behind it.",
          "TODO — another one. Specifics beat adjectives here.",
          "TODO — something you got wrong first, and what changed your mind.",
        ],
      },


      { type: "divider" },

      { type: "heading", text: "Outcome" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },
};
