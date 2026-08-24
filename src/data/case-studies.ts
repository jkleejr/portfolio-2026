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
  // When the project was made, under the title, in whatever words suit it —
  // "2026", "August 2026", "Summer 2026". The page prints it as written.
  date?: string;
  // --- all optional; add to a study to switch one on ---
  cover?: { src: string; alt: string; crop?: string }; // wide image up top
  facts?: { label: string; value: string }[]; // Role / Timeline / Tools strip
  links?: { label: string; href: string }[]; // buttons, e.g. "Live site"
  blocks: CaseStudyBlock[];
};

// overview
// background
// redesign / design
// final thoughts

// assume 20 second scan, 30 second read... need to have an interesting visual design, cant be basic 

// dont over complicate

export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    date: "June 2026",
    blocks: [
      {
        type: "text",
        text: "Loot Check is an app where you take a photo of any item to find its name, resale value, and marketplaces to list it. When I was moving places, I wanted a quick way to find the used value of an item to decide what to keep or sell. First I tried using existing apps, but found they were poorly designed and required a subscription after a few scans. I decided to build a fast, accurate, and free identifying app for all users.",
      },
      {
        type: "heading",
        text: "Design",
      },

      
      {
        type: "text",
        text: "asdf."
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/loot-check-home.png",
            alt: "The home screen: take a photo, or choose one from the library",
          },
          {
            src: "/projects/loot-check-photo.png",
            alt: "A photo of a MIDI keyboard added, with an optional detail field before identifying it",
          },
          {
            src: "/projects/loot-check-result.png",
            alt: "The result: an Akai MPK Mini MK3 identified, with an estimated resale value of $68",
          },
          {
            src: "/projects/loot-check-marketplaces.png",
            alt: "Where to sell, with eBay marked as the best bet and what each marketplace pays after fees",
          },
          {
            src: "/projects/loot-check-listing.png",
            alt: "A ready-to-post listing with a title and description to copy",
          },
          {
            src: "/projects/loot-check-detail.png",
            alt: "A photo of an OP-1 in its case, with \"Op1 synth\" typed into the detail field before identifying it",
          },
          {
            src: "/projects/loot-check-op1-result.png",
            alt: "The OP-1 identified from the photo, with an estimated resale value of $825",
          },
          {
            src: "/projects/loot-check-op1-marketplaces.png",
            alt: "Where to sell the OP-1, with eBay marked as the best bet at $717 after fees",
          },
          {
            src: "/projects/loot-check-op1-listing.png",
            alt: "A ready-to-post listing for the OP-1, with its title and description to copy",
          },
        ],
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/loot-check-logo-scan.png",
            alt: "An early icon: a price tag inside the corner brackets of a camera's scan frame",
          },
          {
            src: "/projects/loot-check-logo-sneaker-dark.png",
            alt: "The same tag on dark, the shoe now a sneaker with stripes",
          },
          {
            src: "/projects/loot-check-logo-sneaker.png",
            alt: "The icon it settled on, on light",
          },
        ],
      },
      {
        type: "heading",
        text: "Final Thoughts",
      },
      {
        type: "text",
        text: "asdf",
      },
      // claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      // thought about the users and making a subscription too but decided i would make it free to use since the cost is low
      // 
      // 
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    date: "July 2026",
    blocks: [
      {
        type: "text",
        text: "A friend was listening to a graduate research paper for class while walking and got '[1] et al., pp. 234-256' read aloud in a robot voice. That gave me the idea to create a PDF reader that skipped unecessary information like the formatting and citations, and spoke in a natural sounding voice.",
      },
       {
        type: "heading",
        text: "Design",
      },
      {
        type: "text",
        text: "asdf."
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-library.png",
            alt: "My Papers: the papers added so far, each with how much of it has been listened to, and a player docked at the bottom",
          },
          {
            src: "/projects/paper-reader-follow-along.png",
            alt: "A paper being read aloud with the current sentence highlighted, the sentence count, and playback controls",
          },
          {
            src: "/projects/paper-reader-settings.png",
            alt: "Settings: the Gemini API key, the text and voice models, and the narration voice",
          },
          {
            src: "/projects/paper-reader-error.png",
            alt: "The failure screen: a paper that could not be processed, with the error it came back with and a way to try again",
          },
        ],
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-logo-light.png",
            alt: "The app icon on light: lines of text with one highlighted in yellow and a play triangle at its end",
          },
          {
            src: "/projects/paper-reader-logo-dark.png",
            alt: "The same icon on dark",
          },
        ],
      },
      {
        type: "heading",
        text: "Final Thoughts",
      },
      {
        type: "text",
        text: "asdf",
      },
    
      // Gemini 3.1 flash
      // costs about $0.03 per minute of audio, about $1-3 per paper.
            //iteration, choices, tradeoffs
          // decided not to cover the cost for this app and make audio listens free for all users 
          // users pay for their own audio
    ],
  },

  "screen-translator": {
    title: "Screen Translator",
    date: "July 2026",
    blocks: [
      {
        type: "text",
        text: "Translate text live using the dynamic island for iPhone. It runs in the background, identifying the text in a certain section of the screen, and displays the translation live.",
      },
      // had to use the dynamic island iOS does not allow you to render anything over an existing app
      // had 2 choices, use the dynamic island or a floating window
      // both are included, but focusing on dynamic island and floating window to test
      // 
       {
        type: "heading",
        text: "Background",
      },
      {
        type: "text",
        text: "asdf.",
      },
       {
        type: "heading",
        text: "Design",
      },
      {
        type: "text",
        text: "asdf."
      },
      {
        type: "heading",
        text: "Final Thoughts",
      },
      {
        type: "text",
        text: "asdf",
      },
    ],
  },

  sleeptalk: {
    title: "SleepTalk",
    date: "August 2026",
    blocks: [
      {
        type: "text",
        text: "SleepTalk is a mobile app that tracks your sleep talking patterns over time.",
      },
       {
        type: "heading",
        text: "Design",
      },
      {
        type: "text",
        text: "asdf."
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/sleeptalk-logo-icon.svg",
            alt: "The app icon: a crescent moon with a speech wave coming out of it, on a purple gradient",
          },
          {
            src: "/projects/sleeptalk-logo-handdrawn.png",
            alt: "A hand-drawn take: blue Zs trailing off inside a rough black square",
          },
          {
            src: "/projects/sleeptalk-logo-blue.png",
            alt: "The Zs in white, filling a solid blue tile",
          },
        ],
      },
      {
        type: "heading",
        text: "Final Thoughts",
      },
      {
        type: "text",
        text: "asdf",
      },
    ],
  },

  "time-with-tree": {
    title: "Time with Tree",
    date: "May 2026",
    links: [{ label: "Live site", href: "https://timewithtree.co.kr/" }],
    blocks: [
      {
        type: "text",
        text: "Website for a birch tree farm in South Korea.",
      },
       {
        type: "heading",
        text: "Design",
      },
      {
        type: "text",
        text: "asdf."
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/time-with-tree-logo-v1.png",
            alt: "A birch tree drawn in outline, its branches carrying leaves in two greens",
          },
          {
            src: "/projects/time-with-tree-logo-v2.png",
            alt: "The tree set beside the farm's name in Korean, 나무와 걷는 시간",
          },
          {
            src: "/projects/time-with-tree-logo-v3.png",
            alt: "A later lockup: leaves rising out of a field, beside the same name set in a heavier face",
          },
          {
            src: "/projects/time-with-tree-logo-v4.png",
            alt: "The mark on its own, three leaves over two bands of field",
          },
        ],
      },
      {
        type: "heading",
        text: "Final Thoughts",
      },
      {
        type: "text",
        text: "asdf",
      },

      // following expectations from client, so less ideation 
      // looked at other true farm websites in Korea 
      // used lovable
    ],
  },


  "buy-side-briefings": {
    title: "Buy Side Briefings",
    date: "2026",
    links: [
      { label: "Live site", href: "https://buy-side-briefings.vercel.app/" },
    ],
    blocks: [
      {
        type: "text",
        text: "Buy Side Briefings is a personal website with automated daily reports on the stock market. The goal is to create a trustworthy source of information that keeps readers updated.",
      },
      { type: "heading", text: "Why build this?" },
      {
        type: "text",
        text: "The stock market is fast paced and narratives can change quickly based on the news. Traders and investors should be informed on the latest events and current state of the stock market.",
      },
       {
        type: "heading",
        text: "Design",
      },
      {
        type: "text",
        text: "asdf."
      },
      // One to a row rather than a grid: these are pages seen on a desktop,
      // and three across the column would leave them too small to read.
      {
        type: "image",
        src: "/projects/buy-side-figma-brief.png",
        alt: "The redesign in Figma: a morning brief with a market sentiment scale, key points, and a live markets rail down the left",
      },
      {
        type: "image",
        src: "/projects/buy-side-figma-signals.png",
        alt: "Further down the redesign: the key signal of the day, tickers to watch, the previous evening's brief, and sector performance",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-today.png",
        alt: "The site as built: the night briefing headline and summary, the week's schedule, and charts",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-catalysts.png",
        alt: "What matters today beside catalysts in detail, each item sourced and dated",
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/buy-side-logo.png",
            alt: "The mark: five candlesticks stepping from red down to green up",
          },
        ],
      },
      {
        type: "heading",
        text: "Final Thoughts",
      },
      {
        type: "text",
        text: "asdf",
      },
    ],
  },
};
