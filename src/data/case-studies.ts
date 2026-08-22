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

// traditional design process: empathize, define, ideate, prototype, test, implement
// Discovery, Define, Ideate, Design, Develop, Test

// overview
// background
// redesign / design
// final thoughts


// problem solving, tradeoffs, development choices
// assume 20 second scan, 1 minute read... need to have an interesting visual design, cant be basic 


// Note on the design process: roles are changing, don't have to follow the design process exactly. 
// the design process is a rigid order, you can't create great work repeatably this way
// what rly matters is the ability to choose and curate what to make
// sometimes you have to jump around, iterate, make decisions that are not linear
// the user doesn't care about the process artifacts or the user journey
// they care about the end experience they are feeling/seeing



export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    blocks: [
      {
        type: "text",
        text: "Loot check is a mobile app that allows users to photograph any item to find its name, resale value, and marketplaces to sell it.",
      },
      //empathize & define, context
      // i chose to use claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "I wanted a quick way to tell whether things were worth selling but I couldn't find an app that was fast, accurate, and well designed. Many apps could identify items from a photo, but their interfaces were cluttered and required a subscription after a few free scans.",
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
      },
//ideate, prototype
//shaping the product
      { type: "heading", text: "Designing the experience" },
      {
        type: "list",
        items: [
          "A key design decision.",
          "Another key design decision",
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
      { type: "heading", text: "Final Thoughts" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    blocks: [
      // context, problem, pain point
      {
        type: "text",
        text: "Paper Reader is a mobile app that allows users to upload a PDF and hear the text in a natural voice without unnecessary formatting and citations.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "A friend tried listening to a paper while walking and got '[1] et al., pp. 234–256' read aloud in a robot voice. She wanted an app that fixed both the formatting and the voice.",
      },

      // the opportunity, the solution
      // Gemini 3.1 flash, 3.1 flash tts. 
      // costs about $0.03 per minute of audio, about $1-3 per paper.
      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-2.png",
            alt: "Reader view with the sentence being read aloud highlighted",
            crop: "50% 34%",
          },
        ],
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
      { type: "heading", text: "Final Thoughts" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "screen-translator": {
    title: "Screen Translator",
    blocks: [
      {
        type: "text",
        text: "Screen Translator is a mobile app that translates Korean language instantly on screen. It runs in the background, identifying the text in a certain section of the screen, and displays the translation on the dynamic island for iPhone.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "I wanted a way to translate Korean to English without constantly switching to a translator app.",
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
      { type: "heading", text: "Final Thoughts" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  sleeptalk: {
    title: "SleepTalk",
    blocks: [
      {
        type: "text",
        text: "SleepTalk is a mobile app that tracks your sleep talking patterns and provides insight over time.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
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
      { type: "heading", text: "Final Thoughts" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },

  "time-with-tree": {
    title: "Time with Tree",
    blocks: [
      {
        type: "text",
        text: "Built a website and store for Time with Tree, a birch tree farm in Sejong, South Korea. ",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "The client needed to start selling their trees online, but they didn't have a website or an online store.",
      },

      // following expectations from client, so less ideation 
      // looked at other true farm websites in Korea 
            //iteration, choices, tradeoffs
      // used lovable, easy to build a basic website, but hard to make changes using Lovable UI

      { type: "heading", text: "Designing the website" },
      {
        // dns setup, seo strategy
        // used lovable, but hard to make changes using lovable ui
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
      { type: "heading", text: "Final Thoughts" },
      {
        // naver seo, google seo, coupang
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },


  "buy-side-briefings": {
    title: "Buy Side Briefings",
    blocks: [
      {
        type: "text",
        text: "Buy Side Briefings is a personal website that updates me daily on important catalysts impacting the market and the stocks im interested in. The goal for this project is to create a trustworthy source of information, keeping me informed and helps me make better investments.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "TODO — who is this for, and what was painful before it existed?",
      },

      // briefings initially had a buy, sell, hold recommendation after every briefing
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

      { type: "heading", text: "Final Thoughts" },
      {
        type: "text",
        text: "TODO — what shipped, how it performs, what is next.",
      },
    ],
  },
};
