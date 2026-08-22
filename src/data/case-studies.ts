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

// dont need to follow design process fk it


export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    blocks: [
      {
        type: "text",
        text: "Photograph any item to find its name, resale value, and marketplaces to sell it.",
      },
      //empathize & define, context
      // i chose to use claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "I wanted a quick way to tell whether things were worth selling but I couldn't find an app that was fast, accurate, and well designed. Many apps can identify items from a photo, but their interfaces are cluttered and require a subscription after a few free scans. I tried to improve upon existing apps by making a simple app that was free to use.",
      },
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    blocks: [
      // context, problem, pain point
      {
        type: "text",
        text: "Upload a PDF and hear the text in a natural voice without the formatting and citations.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "A friend tried listening to a paper while walking and got '[1] et al., pp. 234–256' read aloud in a robot voice. She wanted an app that fixed both the formatting and the voice.",
      },

      // the opportunity, the solution
      // Gemini 3.1 flash, 3.1 flash tts. 
      // costs about $0.03 per minute of audio, about $1-3 per paper.
            //iteration, choices, tradeoffs
    ],
  },

  "screen-translator": {
    title: "Screen Translator",
    blocks: [
      {
        type: "text",
        text: "Translate text live using the dynamic island for iPhone. It runs in the background, identifying the text in a certain section of the screen, and displays the translation live.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "Constantly switching between apps while learning a language is frustrating and time consuming. Chrome's translation plugin doesn't always work when surfing the web, and Naver doesn't provide a solution for their mobile app. I wanted to learn by seeing the Korean text alongside the English translation while I was using my phone.",
      },
    ],
  },

  sleeptalk: {
    title: "SleepTalk",
    blocks: [
      {
        type: "text",
        text: "SleepTalk is a mobile app that tracks your sleep talking patterns over time.",
      },
    ],
  },

  "time-with-tree": {
    title: "Time with Tree",
    blocks: [
      {
        type: "text",
        text: "Website for a birch tree farm in South Korea.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "The client needed a website for customers to learn about the farm, manage communications, and sell their trees.",
      },

      // following expectations from client, so less ideation 
      // looked at other true farm websites in Korea 
            //iteration, choices, tradeoffs
      // used lovable, easy to build a basic website, but hard to make changes using Lovable UI
    ],
  },


  "buy-side-briefings": {
    title: "Buy Side Briefings",
    blocks: [
      {
        type: "text",
        text: "Buy Side Briefings is a personal website with automated daily reports on the stock market. The goal is to create a trustworthy source of information that keeps investors updated and helps them make better investment decisions.",
      },
      { type: "heading", text: "Context" },
      {
        type: "text",
        text: "The stock market is fast paced and narratives can change quickly based on the news. Traders and investors should be informed on the latest events and current state of the stock market.",
      },
    ],
  },
};
