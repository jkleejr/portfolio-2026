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
  // Where the project lives, if it is up somewhere. Set it and the title
  // becomes the link to it, opened in a tab of its own.
  href?: string;
  tagline?: string; // one line under the title
  // When the project was made, under the title, in whatever words suit it —
  // "2026", "August 2026", "Summer 2026". The page prints it as written.
  date?: string;
  // A line under the date for where the project stands — "Work in Progress",
  // "Shipped", "Shelved". Printed as written, and left out when unset.
  status?: string;
  // On the App Store: the mark goes after the title. The value is the listing
  // it opens; an empty string shows the mark without a link. See the same
  // field on an entry in projects.ts.
  appStore?: string;
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

// need to make ui designs look more professional
// logos need some work still


export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    appStore: "https://apps.apple.com/us/app/loot-check/id6785767104",
    date: "June 2026",
    blocks: [
      {
        type: "text",
        text: "Take a photo of any item to find its name, resale value, and marketplaces. Existing apps seemed poorly designed and required a subscription to use. I decided to build a fast, accurate, and free identifying app for all users.",
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
            src: "/projects/loot-check-logo-sneaker.png",
            alt: "The icon it settled on, on light",
          },
        ],
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
        text: "A friend was listening to a research paper while walking and got '[1] et al., pp. 234-256' read aloud in a robot voice. That gave me the idea to create a PDF reader that filtered out unnecessary information and spoke in a natural voice.",
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
        ],
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
    date: "August 2026",
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
        type: "text",
        text: "asdf."
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/screen-translator-1.png",
            alt: "The recording screen: a red Recording card over a running list of live captions, each Korean line with its English under it",
          },
          {
            src: "/projects/screen-translator-3.png",
            alt: "The translation region picker: a phone outline with a blue box dragged over the top third of the screen, and a resize handle at its corner",
          },
          {
            src: "/projects/screen-translator-4.png",
            alt: "Settings for captions over other apps: Dynamic Island on, floating caption window off",
          },
          {
            src: "/projects/screen-translator-2.png",
            alt: "The Dynamic Island expanded over a Korean news feed, holding the headline and its English translation",
          },
        ],
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/screen-translator-logo-clean.png",
            alt: "The mark in black on white: a record dot inside a ring, set on a pale grey circle",
          },
          {
            src: "/projects/screen-translator-logo-4.png",
            alt: "The same mark on black, with the centre dot in recording red",
          },
          {
            src: "/projects/screen-translator-logo-dark.png",
            alt: "A dark take: white ring and red dot on a charcoal circle",
          },
        ],
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
    status: "Work in Progress",
    blocks: [
      {
        type: "text",
        text: "SleepTalk is a mobile app that tracks your sleep talking patterns over time.",
      },
      {
        type: "text",
        text: "",
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
        type: "text",
        text: "",
      },
    ],
  },

  "time-with-tree": {
    title: "Time with Tree",
    date: "May 2026",
    href: "https://timewithtree.co.kr/",
    blocks: [
      {
        type: "text",
        text: "Website for a birch tree farm in South Korea.",
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
    href: "https://buy-side-briefings.vercel.app/",
    blocks: [
      {
        type: "text",
        text: "Buy Side Briefings is a personal website with automated daily reports on the stock market. The goal is to create a trustworthy source of information that keeps readers updated.",
      },
      { type: "heading", text: "Why build this?" },
      {
        type: "text",
        text: "The stock market is fast paced and narratives can change quickly based on the news. Traders and investors should be informed on the latest events and current state of the market.",
      },
      {
        type: "text",
        text: "asdf."
      },
      // One to a row rather than a grid: these are pages seen on a desktop,
      // and three across the column would leave them too small to read.
      {
        type: "image",
        src: "/projects/buy-side-site-dashboard.png",
        alt: "The built dashboard: the evening brief and its headline, index tiles across the top, the key signal and tickers to watch down the right, and the day's archive on the left",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-markets.png",
        alt: "The markets page: three-month charts for the S&P, Nasdaq and Russell, metals beside them, and sector rotation across eleven ETFs underneath",
      },
      {
        type: "image",
        src: "/projects/buy-side-figma-brief.png",
        alt: "The redesign in Figma: a morning brief with a market sentiment scale, key points, and a live markets rail down the left",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-night-brief.png",
        alt: "The Today page: the night briefing's headline set in serif over its standfirst, the ticker tape above it, and the chart panel starting underneath",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-chart.png",
        alt: "The chart expanded to fill the page: monthly S&P bars on a log scale with three EMAs over them and RSI running underneath",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-briefing.png",
        alt: "A briefing in full: the headline, three sourced bullets, each point linked back to where it came from, and the long read below",
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/buy-side-logo-transparent.png",
            alt: "The same mark without its background, on whatever it is set against",
          },
        ],
      },
      {
        type: "text",
        text: "asdf",
      },
    ],
  },
};
