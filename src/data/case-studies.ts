export type CaseStudyBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  // A list of lines. Bulleted by default; set ordered for a numbered one,
  // where the count is part of what the lines say — the steps of a pipeline,
  // in the order they run.
  | { type: "list"; items: string[]; ordered?: boolean }
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

// problem, context, process, solution, and results
// real cocnstraints and what changed over time

// hero - one line description, my role, the outcome (designed and shipped, live on app store)
  // the best visual i have
  // showcase the final rpoduct at the top of each case study - never open with process
// the problem - start with the situation - what was happening and why it mattered
  // be specific about the pain point i identified. avoid general openings like "the goal was to improve the user experience"
  // for screen translator - the annoyance of having to switch apps to use translator, having to copy and paste, wasting time
// key decisions, not full process - pick 2-3 interesting decisions and explain the reasoning and tradeoffs
  // "i tried X, it failed because Y, so I did Z" 
// craft details
  // one section zooming into something small i cared about
    // maybe the word-sync animation in Paper Reader, a transition, an empty state
    // small detials may seem insignificant but they are actually indispensable - highlight these and recap why they matter
// outcome + reflection - i wont have team metrics and thats fine. outcomes should show direction, learning, or real world impact. "shipped to app store", downloads, honestly what i'd do differently. or what i'd do from here.

// note on figma: when good designers show process artifacts, they present them beautifully, cleaned up, on consistent backgrounds, annotated
// sketches or wireframes are fine, the amateurism isnt in showing process, its in showing raw uncropped screenshots w mismatchced sizes
// use ai to create some animated video showing the features of the app, for example, for loot check, screen recording of someone using the app to take pictures of things around their house. interesting things, the app can value items too, or help someone remember the name of the item, even if it has no brand name.
// 


export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    appStore: "https://apps.apple.com/us/app/loot-check/id6785767104",
    date: "June 2026",
    blocks: [
      {
        type: "text",
        text: "Take a photo of any item to find its name, resale value, and where to sell it."
       },
      {
        type: "video",
        src: "/projects/loot-check-shark.mp4",
        caption: "Finding the potential price of my shark painting",
      },
      {
        type: "text",
        text: "Existing apps looked poorly designed and required a subscription to use. My solution was a fast, accurate, and free identifying app.",
      },
      {
        type: "text",
        text: "I used Claude Sonnet 4.6 to identify the item, find the price, and write the listing due to its high accuracy and low API costs at ~$0.013 per scan. I considered Kimi K3, but the costs were similar and I wanted the results to be as trustworthy as possible.",
      },
      // 2 key decisions....
      // claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      // thought about the users and making a subscription too but decided i would make it free to use since the cost is low
      {
        type: "images",
        items: [
          {
            src: "/projects/loot-check-home.png",
            alt: "The home screen: take a photo, or choose one from the library",
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
        text: "The next step for this project is marketing and finding users. Depending on the number of users and the volume of photos, I would use a cheaper AI model or consider adding subscriptions for the most active users.",
      },

    ],
  },


  "paper-reader": {
    title: "Paper Reader",
    date: "July 2026",
    blocks: [
      {
        type: "text",
        text: "Upload a PDF and hear it read aloud in a natural voice, citations and formatting filtered out."
      },
      {
        type: "text",
        text: "A friend was listening to a research paper while walking and got '[1] et al., pp. 234-256' read aloud in a robot voice. That gave me the idea to create a PDF reader that filtered out unnecessary information and spoke in a natural voice.",
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
        ],
      },
      {
        type: "text",
        text: "I designed the app around users paying for their own API usage due to the costs of audio generation at ~$1-3 per paper. This meant one API key has to identify the document and generate audio. Gemini 3.1 flash was the best option for both of these tasks since it could clean up the text for reading and included text to speech with 8 prebuilt voices.",
      },
      {
        type: "text",
        text: "There were many steps in making the audio generation feel seamless for the user:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Extract - PDFKit pulls the text out of the PDF page by page.",
          "Repair - The spacing is rebuilt using the document’s own vocabulary. No model has been involved yet — both of these steps run on the phone.",
          "Identify - A Gemini text call names the document and works out what kind of thing it is.",
          "Clean - The text is split into chunks of under 10,000 characters at paragraph boundaries, and each chunk gets its own Gemini call. A paper loses its citations, captions, and bibliography while the prose stays verbatim; a slide deck has its fragments turned into speakable sentences. Each chunk is saved as it lands, so an app that gets killed resumes instead of spending the tokens again.",
          "Segment - Apple’s NLTokenizer splits the cleaned script into sentences on device, and ChunkPlanner groups them into chunks of about 750 characters for narration.",
          "Narrate - Each chunk goes to Gemini TTS with a style prefix and the chosen voice, comes back as 24 kHz mono PCM, and is wrapped in a WAV and cached on disk. The API returns no word timings, so each sentence’s duration is apportioned from the chunk’s real length by character count — accurate enough to highlight a sentence at a time, and it re-syncs at every chunk boundary so the error cannot accumulate.",
        ],
      },
      // gemini flash latest - title + document, then the per chunk cleanup
      // gemini 3.1 flash tts - narration, 8 curated prebuilt voices
      // cleanup is a few cents while the text to spesech per paper is $1-$3

      // 1. extract - PDFTextExtractor.swift - PDFKit pulls text page by page
      // 2. repair - TextRepair.swift - rebuilds the spacing using the document's own vocabulary
      // until this point, no model is involved
      // 3. identify - Gemini text call identifies the page, and cleans the text. 
      // 4. clean - the text is split into <10,000 character chunks at paragraph boundaries, and each chunk gets its own Gemini call. a paper gets citations, captions, bibliography, etc taken out while the prose stays verbatim. a slide deck gets its fragments turned into speakable sentences. each chunk's result is persisted as it lands, so a killed app resumes instead of re-spending tokens.
      // 5. segment - Apple's NLTokenizer splits the cleaned script into sentences on device. ChunkPlanner then groups them into ~750 character TTS chunks.
      // 6. narrate - each chunk goes to Gemini TTS with a style prefix and the user's chosen voice, comes back as 24 kHz mono PCM, gets wrapped in a WAV and cached on disk. Since the API returns no word timings, each sentence's duration is apportioned from the chunk's exacty length by character count - accurate enough for sentence level highlighting, and it re-syncs at every chunk boundary so error can't accumulate.
      // playback is AVAudioEngine with a time-pitch unit (speed changes without chipmunking), scheduling one chunk ahead so works smoothly. 

      {
        type: "images",
        items: [
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
        text: "Next steps.....",
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
        text: "Translate text live using the dynamic island for iPhone. It runs in the background, identifies text in a section of the screen, and displays the translation live.",
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
        src: "/projects/buy-side-site-today.png",
        alt: "The Today page: a live ticker strip under the nav, the night briefing's headline and the paragraph that argues it, and the chart panel opening underneath",
      },

      {
        type: "image",
        src: "/projects/buy-side-site-chart.png",
        alt: "The chart expanded to fill the page: monthly S&P bars on a log scale with three EMAs over them and RSI running underneath",
      },

      {
        type: "image",
        src: "/projects/buy-side-site-briefing.png",
        alt: "A single briefing: the night's headline over three key points, each one repeated underneath with the source it came from and a link out to it",
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
