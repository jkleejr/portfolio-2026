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

// overview
// background
// redesign / design
// final thoughts

// assume 20 second scan, 30 second read... need to have an interesting visual design, cant be basic 

// dont over complicate

export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    blocks: [
      {
        type: "text",
        text: "Photograph any item to find its name, resale value, and marketplaces to sell it.",
      },
      // claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      // thought about the users and making a subscription too but decided i would make it free to use since the cost is low
      // 
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    blocks: [
      {
        type: "text",
        text: "Upload a PDF and hear the text in a natural voice without the formatting and citations.",
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
    blocks: [
      {
        type: "text",
        text: "Translate text live using the dynamic island for iPhone. It runs in the background, identifying the text in a certain section of the screen, and displays the translation live.",
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

      // following expectations from client, so less ideation 
      // looked at other true farm websites in Korea 
      // used lovable
    ],
  },


  "buy-side-briefings": {
    title: "Buy Side Briefings",
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
    ],
  },
};
