export type CaseStudyBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; attribution?: string }
  // Runs the width of the column unless width is set, which holds it to that
  // many pixels and centres it — for a crop taken off a retina screen, where
  // the file is twice the size the thing was on screen and blowing it up to
  // the column would show it at twice life size.
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      crop?: string;
      width?: number;
    }
  // Three across from sm up, or two where the shots are wider than they are
  // tall and three would leave them too small to read.
  // A shot takes its width from the row unless it sets one, which holds it to
  // that many pixels — for one that reads bigger than what is beside it.
  //
  // Set fullOnPhone on a shot that is half a column too small to read. A row
  // is two across at every width, so on a phone half of it is around 160px —
  // fine for a whole screen, which is only being placed, and too small for a
  // crop, which is being read. Such a shot takes the column to itself there
  // and goes back to sharing the row from sm up. Not with `width`, which is a
  // fixed number of pixels and wins at every size, this one included.
  | {
      type: "images";
      items: {
        src: string;
        alt: string;
        crop?: string;
        width?: number;
        fullOnPhone?: boolean;
      }[];
      caption?: string;
      columns?: 2;
    }
  // Autoplays muted and looping. Set controls where the sound is part of
  // what the recording shows — a viewer needs a way to unmute it.
  | {
      type: "video";
      src: string;
      caption?: string;
      // A second caption, in the space on the other side of the video. An
      // array for one that runs to more than a line, each set under the last.
      captionLeft?: string | string[];
      controls?: boolean;
      // Where the caption sits beside the video. Middle by default; high for
      // one that reads better up nearer the top of the frame.
      captionAlign?: "middle" | "high";
    }
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
  // it opens; an empty string shows the mark without a link. When there is no
  // `href`, the title itself opens the listing too. See the same field on an
  // entry in projects.ts.
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

  // showcase the final rpoduct at the top of each case study - never open with process
// the problem - what was happening and why it mattered
  // be specific about the pain point i identified

  // for screen translator - the annoyance of having to switch apps to use translator, having to copy and paste, wasting time

// key decisions, not full process - pick 2-3 interesting decisions and explain the reasoning and tradeoffs
// "i tried X, it failed because Y, so I did Z" 

  // one section zooming into something i cared about

// outcome + reflection - i wont have team metrics and thats fine. outcomes should show direction, learning, or real world impact. "shipped to app store", downloads, honestly what i'd do differently. or what i'd do from here.

// note on figma: when good designers show process artifacts, they present them beautifully, cleaned up, on consistent backgrounds, annotated
// dont show raw uncropped screenshots w mismatchced sizes

// ease of access
// ease of use
// clearly designed
// tells a story
// visually appealing


export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    appStore: "https://apps.apple.com/us/app/loot-check/id6785767104",
    date: "June 2026",
    blocks: [

       {
        type: "text",
        text: "When I was moving places, I wanted a quick way to find the value of a used item and decide what to sell. I tried existing apps but they felt poorly designed and required a subscription to use. My solution was a fast, accurate, and free identifying app.",
      },

      {
        type: "video",
        src: "/projects/loot-check-shark.mp4",
        caption: "Finding the potential value of my shark painting",
      },
                  { type: "heading", text: "How it works" },

      {
        type: "list",
        ordered: true,
        items: [
          "The user takes a photo",
          "Claude identifies and values the item",
        ],
      },

      {
        type: "text",
        text: "I used Claude Sonnet 4.6 due to its low costs and high accuracy at ~$0.013 per scan. I considered other AI models but the costs were similar and I wanted the results to be as trustworthy as possible.",
      },

                              { type: "heading", text: "Scope" },

      {
        type: "text",
        text: "I built the app for resale, but the most interesting use case was showing it something original like a painting. I wanted to know the potential value of a painting that never had a listing. That grew the idea into a price discovery tool for both used and original items.",
      },

                                    { type: "heading", text: "Valuing items" },

      {
        type: "text",
        text: "Most estimates are based on the model's pre-trained data. Claude only does a web search to find the current value when its confidence is low. A web search wasn't necessary for every scan because it increased the cost by 3-4x and Sonnet 4.6 was accurate enough for most things."
      },

                        { type: "heading", text: "Designing for uncertainty" },

      // designing for uncertainty
      {
        type: "text",
        text: "Since vision models are not 100% accurate, users can add a few words to guide AI toward the right product. Results with low confidence are labeled 'best guess'.",
      },

      {
        type: "images",
        columns: 2,
        items: [
          {
            src: "/projects/loot-check-detail-input.png",
            fullOnPhone: true,
            alt: "The optional detail field under a photo of an OP-1 in its case, with \"keyboard and synth\" typed in and a tip to include a close-up of the brand logo",
          },
        ],
      },

      // 2 key decisions....
      // claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      // thought about the users and making a subscription too but decided i would make it free to use since the cost is low

      // BACKEND
      // photo -> Claude -> result
      // When I tap identify, my phone sends the photo, hits Claude, and it sends back title, price, marketplace, description.
      // prompted to find resale vale and base it on item type, brand, and condition
      // 60 scans per day limit
      // key is stored

      // HOW IS LOOT CHECK VALUING ITEMS? (8.29.26)
      // It's a well informed guess from Claude, no lookup
      // 1 API call is being made per scan, not per photo.
      // more photos costs more, capped at 4.
      // if i wanted to get sales data online to make the price estimation more accurate....
      // id have to pay $.01 per search online (Anthropic's rate) so it would be 2-3x more expensive per scan
      // decided not to
      
                { type: "heading", text: "Result" },

      {
        type: "text",
        text: "Loot Check is live on the App Store. I wanted to automate the listing process but most marketplaces don't have a public listing API, so the app creates a title and description for copy and paste. The next steps are finding users and marketing on social media.",
      },
      // Loot Check is the first app I put on the app store so I learned a lot about iOS and mobile development from this project.
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
        type: "video",
        src: "/projects/paper-reader-add-and-listen.mp4",
        controls: true,
        captionAlign: "high",
        caption: "Add a new paper from files",
        captionLeft: [
          "Audio is generated as the user needs it, lowering initial cost and wait time",
        ],
      },
      
      {
        type: "text",
        text: "I designed the app around users paying for their own API usage due to the costs of audio generation at ~$1-3 per paper. To keep things simple, I used one API to identify text and generate audio. Gemini 3.1 flash was the best option because it could clean up text and had TTS with 8 voices.",
      },
      { type: "heading", text: "How it works" },

      {
        type: "list",
        ordered: true,
        items: [
          "Gemini splits text into groups, filters out citations, captions, etc. and keeps prose the same",
        // Group sentences ~750 characters, ~45 seconds of speech.",
          "TTS returns audio for each group",
        ],
      },
   

            { type: "heading", text: "Highlighting" },

      {
        type: "text",
        text: "Because Gemini only returns audio and no timestamps, the app has to estimate when each sentence is being narrated. It splits a group's audio proportionally by character count, so a sentence with 5% of a group's characters is assumed to take 5% of the audio. As audio plays, the app tracks the time passed and highlights a sentence based on its estimate. However, this is not always accurate. Highlighted sentences are re-synced at the start of every group to minimize errors.",
      },
      {
        type: "image",
        src: "/projects/paper-reader-highlight-detail.png",
        width: 353,
        alt: "A close read of the narration: the sentence being spoken sits in a pale blue block, the lines either side of it in grey",
      },

                        { type: "heading", text: "Design decisions" },

      {
        type: "text",
        text: "When processing fails, the paper enters an error state and shows the exact error message.",
      },
      {
        type: "images",
        columns: 2,
        items: [
          {
            src: "/projects/paper-reader-library-error-detail.png",
            fullOnPhone: true,
            alt: "A close read of the failed row: the paper's name over the Gemini error in red, with a retry button on its right",
          },
          {
            src: "/projects/paper-reader-error-detail.png",
            width: 265,
            alt: "The failure the row opens onto: a warning triangle over the Gemini error, a line pointing to the API key in Settings, and a Try Again button",
          },
        ],
      },
      {
        type: "text",
        text: "A sample paper with narration is pre-downloaded so users can experience the app before setting up a key.",
      },
      {
        type: "image",
        src: "/projects/paper-reader-sample-paper-detail.png",
        width: 367,
        alt: "A close read of the sample row: a SAMPLE tag over the paper's title, 77% listened beneath it with a progress bar, and a play button on its right",
      },

      // (total samples / 24,000 = total seconds)
      // (characters in each sentence / group total characters = % of group text)
      // (% of group text x total seconds = how long each sentence could take)
      // as the audio for that group plays, the app tracks how many seconds have passed to estimate the current sentence. but its not always accurate because some sentences take longer than others due to punctuation
      // splits proportionally by text, so a sentence with 30% of the group's characters is assumed to take 30% of the audio.
      // as playback runs, the app tracks elapsed time against these estimates to decide which sentence to highlight.
      // the split is only an estimate, so the highlight can drift slightly, but the moment a clip ends is exact and it re-syncs there


      // 24000 samples per second is the same as 24000 numbers for every second of sound
        // knows the number of sentences from splitting the script into sentences using Apple NLTokenizer, producing a numbered list of sentences through the whole paper
 
      // Gemini returns no timings so the app estimates them. each sentence takes a share of the group's audio in proportion to its length. that drifts slightly, but the highlight is corrected every 45 seconds and the error never builds up
    

      // Gemini's TTS response comes back as the audio, as base64 sound data
      // so the app has to derive everything itself: the total length by counting samples, and the position of each sentence inside that length by the character count estimate. thats why the highlight works the way it does, its sentence level rather than word level

      // group is 5-8 sentences that were sent to gemini and came back as one clip, about 45 seconds long.
      // the app knows that clip's length precisely: the clip is a list of sound samples, 24,000 of them per second, so a million samples means 41.7 seconds.

      // what the app doesn't know is where each sentence sits inside those 45 seconds.
      // so it divides the clip by text length
      // the sentence "The paper is TradingAgents..." has 192 characters, 31% share of the clip, and took 14.29 seconds. 192 characters out of 623 is 31% of the text, so its assumed to take 31% of the time. 

      // the highlight follows that estimate. 4 times a second, the app adds the elapsed time to a running total.. at 1.5x the total climbs 1.5 seconds per real second. 
    
      // a 40 minute paper is roughly 50 groups
       
      // the user's Gemini API key is safely stored in the iOS keychain. it can't be read by other apps, is encryptoed by the rest of the OS tied to the device's hardware.
      // where it goes:
      // generativelanguage.googleapis.com over HTTPS, in a request header (x-goog-api-key), not in the URL, which matters because URLs get logged by proxies and headers generally don't. There's one URLSession in the entire app and one destination host.
      // the key is never printed to a log, never written into a paper's JSON, never attached to an error message, and never sent anywhere else.
    

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

      // while the user is listening to one chunk, the next one finishes. users can pay as they listen

      // Gemini TTS sends back an audio file for each group of sentences, but the question is how to know which sentence is currently being said to highlight it on the user's screen
      // if one sentence has 50 letters and the next has 150, the second one probably takes about 3 times as long to say.
      // the app knows the clip is exactly 46 seconds total, so it slices those 46 seconds up in proportion to how long each sentence is
      // its only a guess because people don't read at a perfectly steady pace. a sentence with a lot of commas takes longer than a simple one. so highlight might be half a second early or late.
      // why that never gets bad: each clip is only about 50 seconds long. when it finishes playing, the app knows it finished. so it moves the highlight to the first sentence of the next clip and starts counting from 0 again.
      // the reset is important. the guessing only happens for 50 seconds before its corrected. 
      // if the app made one 40 min guess for the whole paper, small errors would pile together and the text highlight would end up nowhere near the voice.
      // 750 characterse, ~50 seconds of speech. 
      // why around a minute? - too short is wasteful, each group is a separate round trip to Google. cut them 10 seconds each and a 40 minute paper needs 240 requests instead of 50. 5 times the waiting on network overhead, chances of getting rate-limited, or retries if something fails. 
      // too long delays the start. nothing plays until the first group exists. at 50 seconds, thats about a 20 second wait. if a group were 3 minutes of audio, i'd wait over a minute before hearing anything. 
      // too long wastes money when you skip. jump to a different part of the paper and whatever was being generated is paid for but never heard
      // about a minute was the best choice

      // in the latest update Aug 27,2026, the narration speed can be set by the user from 0.75x-2x speed. 
      // also, the first chunk/group of text is generated into audio before the paper is playable
      // takes about 20 seconds to generate audio for the first chunk ~40 seconds of audio
      // chunk 2 loads before chunk 1 finishes playing
      // also fixed a ui design issue where the iphone time and battery were over the text making it hard to see. now the text doesnt reach that top part of the screen

      // for segment - apple nltokenizer is Apple's. it comes from the naturallanguage framework, not swiftui. swiftui is only for building the interface, naturallanguage is text analysis. you hand it a string, it hands back the ranges of each sentence. it knows that "et al." and "Fig. 3" arent sentence endings, which is why i use it instead of splitting on periods.
      // ChunkPlanner is my own code, not Apple's. it has one function, plan(for:targetChars:), which walks the sentences NLTokenizer produced and groups consecutive ones until adding the next would exceed 750 characters. 
      // the reason is - small enough that character-proportional sentence timing stays accurate, large enough for natural speech and few API calls.

      // why did we decide to show the highlighted sentences/current sentence this way? 
      // theres a constraint. Gemini TTS returns audio and nothing else - no word timings, no marks. so the app has to work out for itself when each piece of text is being spoken, and the only signal available is length: this sentence is 190 characters of a 623 character chunk, so it gets 190/623 of the chunk's 46 seconds
      // the estimate is decent but not exact. a comma heavy sentence reads slower than a plain sentence so any estimate is off
      // word lasts about 0.3 seconds, a sentence lasts 5-15 seconds. so words are better, but word level would have required real timings which is more complicated and probably requires another model to do
      // the re-sync for the end of every clip/chunk/group, so the app stops guessing and it knows whats the current sentence that needs to be highlighted to match the audio
      //


     // write to the level of my understanding
      
            { type: "heading", text: "Lesson learned" },

      {
        type: "text",
        text: "If I continued this project, I would integrate an API key into the app. I realized that asking users to set up their own key creates too much friction and is a bad idea. I should have reasoned through this earlier in the planning stage because I ended up designing the app around that. There are many TTS products like Speechify that address the same problems, so I moved on.",
      },
      // should have considered the user more during planning, so I didn't end up designing the whole app around the user paying for themselves
      // should have thought about this earlier
    
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
        text: "Constantly switching apps while learning a language is too time consuming. I created an app that translates the Korean text on screen to English in real time.",
      },
      // had to use the dynamic island iOS does not allow you to render anything over an existing app
      // had 2 choices, use the dynamic island or a floating window
      // both are included, but focusing on dynamic island and floating window to test
      // 
      {
        type: "text",
        text: "My first idea was to generate text over the current display, but iOS does not allow an app to draw over another app. To get around this, I used a ReplayKit broadcast extension to receive pixels of what's on screen, and showed the translation using the dynamic island and floating window."

      },
        { type: "heading", text: "How it works" },
      // first, focusing this app on live captions translations, and trying to make that process as seamless as i can.
      // audio later
      {
        type: "list",
        ordered: true,
        items: [
          "Apple Vision reads the screen",
          "Apple Speech transcribes audio",
          "DeepL translates the text",
        ],
      },
      {
        type: "text",
        text: ""
      },
      {
        type: "text",
        text: ""
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/screen-translator-2.png",
            alt: "The Dynamic Island expanded over a Korean news feed, holding the headline and its English translation",
          },
          {
            src: "/projects/screen-translator-1.png",
            alt: "The recording screen: a red Recording card over a running list of live captions, each Korean line with its English under it",
          },
          {
            src: "/projects/screen-translator-3.png",
            alt: "The translation region picker: a phone outline with a blue box dragged over the top third of the screen, and a resize handle at its corner",
          },
        ],
      },
    ],
  },

  "buy-side-briefings": {
    title: "Buy Side Briefings",
    date: "May 2026",
    href: "https://buy-side-briefings.vercel.app/",
    blocks: [

      {
        type: "text",
        text: "Buy Side is an automated market reporting website designed to save the reader time. The website tracks the stock market, filters out noise to focus on critical events, and analyzes stock performance to generate daily publications.",
      },

      {
        type: "image",
        src: "/projects/buy-side-site-today.png",
        alt: "The Today page: a live ticker strip under the nav, then the morning report's headline on a global bond selloff, the paragraph that argues it, a link out to the full six minute read, and the charts panel opening underneath",
      },
      // reduce information overload and cognitive fatigue for investors by providing concise insights and a quick read

            { type: "heading", text: "Preventing cognitive fatigue" },

            {
        type: "text",
        text: "Stock prices change constantly and it takes time to know why. It takes time to navigate multiple sources, find the right information, and understand it all. This turns a quick read into a hard task. "
      },
      {
        type: "text",
        text: "To understand why prices were moving, I had to use multiple platforms and analyze data. This was a fragmented workflow because of context switching and friction."
      },
      // context switching - constantly jumping between multiple disconnected browser tabs and apps to gather information, which can be mentally exhausting and lead to cognitive fatigue
      {
        type: "text",
        text: "I designed Buy Side to reduce cognitive fatigue by using AI to remove the manual work of navigating sources and collecting information. AI curates the information and outputs a dense but concise report that takes ~6 minutes to read."
      },

                  { type: "heading", text: "AM/PM mode" },
      {
        type: "text",
        text: "."
      },

            { type: "heading", text: "Sector rotation matrix" },
      {
        type: "text",
        text: "."
      },

      {
        type: "image",
        src: "/projects/buy-side-sector-rotation.png",
        width: 620,
        alt: "The sector rotation table: eleven sectors from Energy down to Consumer Discretionary, each with its ETF ticker, today's move, and the fifty day move, the gains in green and the losses in red",
      },

     // current design
      // mobile design
      { type: "heading", text: "Mobile design" },
      {
        type: "images",
        columns: 2,
        items: [
          {
            src: "/projects/buy-side-mobile-today.png",
            width: 290,
            alt: "The Today page on a phone: the ticker strip under the nav, the date with an AM/PM toggle set to PM, the night report's headline on US strikes on Iran pushing oil to a six-week high, its opening paragraph, a link to the eight minute read, and the charts panel starting below",
          },
          {
            src: "/projects/buy-side-mobile-full-read.png",
            width: 290,
            alt: "The full read on a phone: a methodology note in italics up top, the report's first section heading in blue capitals, the paragraph under it on the strikes and the oil settle, and the underlined source citations that follow",
          },
          {
            src: "/projects/buy-side-mobile-movers.png",
            width: 290,
            alt: "The Movers section of the full read on a phone: a bulleted list with Semiconductors, NVDA, Energy, and BTC in blue, each followed by the day's move and the underlined sources behind it",
          },
          {
            src: "/projects/buy-side-mobile-what-to-watch.png",
            width: 290,
            alt: "The What to Watch section on a phone: three paragraphs, each opening with a bold blue lead on the 30-year yield, transit in Hormuz, and the labour market, with the Next 5 Trading Days table starting below",
          },
        ],
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
        text: "Time with Tree is a birch tree farm in South Korea. They had trees but no way for customers to find them, so I built their online store. "
      },
      {
        type: "text",
        text: "",
      },

      {
        type: "text",
        text: "",
      },

      // following expectations from client, so less ideation 
      // looked at other true farm websites in Korea 
      // used lovable
    ],
  },
};
