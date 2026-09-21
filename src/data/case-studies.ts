export type CaseStudyBlock =
  // `note` is set out in the margin at the left of the window, level with the
  // heading — a line about the section beside the section, rather than in it.
  // Shown only where there is a margin to hold it, which is from 1000px up;
  // under that the heading stands alone. Leave it out, or empty, for a
  // heading that has nothing to say out there.
  | { type: "heading"; text: string; note?: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; attribution?: string }
  // Runs the width of the column unless width is set, which holds it to that
  // many pixels and centres it — for a crop taken off a retina screen, where
  // the file is twice the size the thing was on screen and blowing it up to
  // the column would show it at twice life size.
  // max is the other way round from width: the shot still takes the column
  // and still grows with the window, but stops growing at that many pixels.
  // For a wide shot that is readable long before the column runs out, and on
  // a large monitor at full screen would otherwise be blown up past the point
  // where the extra size tells you anything.
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      // Centred under the shot rather than set against the left edge.
      captionCenter?: boolean;
      crop?: string;
      width?: number;
      max?: number;
      // A fixed height in CSS pixels. The shot is scaled to fill its width
      // and cropped to this, with crop saying which part is kept, so shots
      // of different proportions can sit in a run at one size. With max set
      // it is the height at that width, and the shot keeps the proportion
      // when the column is narrower than the max — on a phone — rather than
      // holding the height and cropping the sides to fill it.
      height?: number;
      // The corner radius in CSS pixels, for a shot whose own corners are
      // rounder than the page's default: the page clips and borders every shot
      // at rounded-xl, and a card cut out with a larger radius would show the
      // page through the gap between the two curves.
      radius?: number;
      // Pixels to nudge the shot right of centre (negative for left) from sm
      // up, where the shot is narrower than the column. For one that is
      // centred to the pixel but reads as off it, the way a picture with a
      // heavy edge does. On a phone the shot fills the column and stays put.
      shift?: number;
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
        caption?: string; // under this one shot, where the row's is under them all
        // Drawn at this fraction of its slot and centred in it, both ways, so
        // it keeps its place beside the shot next to it while sitting a
        // little smaller. 0.91 for one a touch under the rest. Its caption
        // hangs under the picture rather than adding to its height, so the
        // picture is what sits centred.
        scale?: number;
        // Pixels a scaled shot is raised from the middle of its slot, for one
        // that reads a hair low there.
        lift?: number;
      }[];
      caption?: string;
      columns?: 2;
      // Under sm the shots are piled on one another, each turned a few
      // degrees so the ones behind show, and swiped through one at a time —
      // for three phones across, which a phone can only show too small or as
      // three screens of scrolling. The row from sm up is unchanged. It is for
      // plain shots all the same shape: a pile draws each item's `src` and
      // `alt` and nothing else of it, so no `caption`, `scale` or `width`.
      stackOnPhone?: boolean;
      // A ceiling on the row, not on a shot in it: the shots keep sharing it
      // in the same proportions and stop growing together.
      max?: number;
    }
  // Autoplays muted and looping. Set controls to let a viewer pause and scrub
  // it, and unmute it where the sound is part of what the recording shows.
  // A browser leaves the volume button off a file with no audio track, so a
  // silent recording is saved without one rather than with an empty one.
  | {
      type: "video";
      src: string;
      caption?: string;
      // A second caption, in the space on the other side of the video. An
      // array for one that runs to more than a line, each set under the last.
      captionLeft?: string | string[];
      // Low sets the left caption's first line a step under where it sits by
      // default, for one that reads better nearer the middle of the frame.
      captionLeftAlign?: "low";
      controls?: boolean;
      // Where the caption sits beside the video. Middle by default; high for
      // one that reads better up nearer the top of the frame, then higher and
      // highest, each a step further up again.
      captionAlign?: "middle" | "high" | "higher" | "highest";
      // Leaves a caption out on a phone, where both sit under the video rather
      // than beside it: one that points at something in the frame reads as a
      // stray line there, and the other caption is enough on its own.
      captionHiddenOnPhone?: boolean;
      captionLeftHiddenOnPhone?: boolean;
    }
  | { type: "divider" };

export type CaseStudy = {
  title: string;
  // Where the project lives, if it is up somewhere. Set it and the title
  // becomes the link to it, opened in a tab of its own.
  href?: string;
  tagline?: string; // one line under the title
  // The facts about a project, set as one small block of three lines: where
  // it stands, who did what, and when. Each is printed as written and left
  // out when unset.
  //
  // Scope is the first of them — "Live on the App Store", "Prototype". When
  // the project is up somewhere (`appStore` or `href` below) the line is the
  // link there, with an arrow after it to say it leaves the page.
  // Role is the second — the work, shortened, then who it was done with.
  // Date is the last, months abbreviated and an en dash for a span:
  // "Jun–Sep 2026", "Sep 2026", "May 2026–Present".
  scope?: string;
  role?: string;
  date?: string;
  // A further line for where the project stands — "Work in Progress",
  // "Shelved" — for when the scope does not already say. Under the scope.
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



// outcome + reflection - i wont have team metrics and thats fine. outcomes should show direction, learning, or real world impact. 

// note on figma: when good designers show process artifacts, they present them beautifully, cleaned up, on consistent backgrounds, annotated
// dont show raw uncropped screenshots w mismatchced sizes

// thinking process, execution quality, problem solving

// design thinking -empathise, define, ideate, prototype, test


export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    appStore: "https://apps.apple.com/us/app/loot-check/id6785767104",
    date: "Jun–Sep 2026",
    role: "Design, iOS dev, Solo",
    scope: "Live on the App Store",
    blocks: [

      // frame the problem in terms of user friction and business opportunity. state a clear hypothesis or goal.

      
      {
        type: "video",
        src: "/projects/loot-check-shark.mp4",
        controls: true,
        caption: "Finding the potential value of my shark painting",
      },

            {
                    type: "heading",
                    text: "Context",
                    note: "Problem & Solution",
                  },
      {
        type: "text",
        text: "When I was moving places, I had a room full of clothes, electronics, and other things to sell. It took me too much time to research the fair selling price and write listings for every single item. I tried existing appraisal apps to speed up the process, but they had unnecessary steps, ads, or asked me to subscribe after a few scans. I saw an opportunity to create Loot Check, a free solution that uses AI to identify an item, estimate its value range, and recommend where to sell it.",
      },

      
            {
              type: "heading",
              text: "System Architecture",
              note: "Design Decisions",
            },

      {
        type: "text",
        text: "The app routes requests through a Vercel endpoint so API keys aren't stored on the device. To keep the app free without risking runaway costs, I used Upstash Redis to cap usage at 100 scans per device and 1,000 scans globally per day.",
        // risks using claude api and making the app free: my api keys need to be secure, and i need to create spending limits to minimize the cost and plan for a worst case scenario. 
      },
      
      // system architecture and data flow diagrams
      // photo captured to the result and estimated price range

      // native client, serverless orchestrator, AI inference, rate limiting, returned payload
      {
        type: "image",
        src: "/projects/loot-check-architecture.svg",
        max: 700,
        alt: "Architecture diagram. The iOS app uploads a photo to a single analyze endpoint on Vercel, which calls Claude Sonnet 4.6 to identify and price the item and Upstash Redis for daily caps and search allowances. A JSON response returns to the app as an item valuation with payouts from marketplaces.",
      },

            // api key lives in Vercel's environment variables - so its never in app, sent to phone, or git
            // upstash redis - stores numbers: 100 scans a day per phone cap, 1000 global daily cap, all time number of scans, 25 paid web searches a day per user cap - to limit costs and a worst case scenario 
            // at rougly $0.013-$0.02 per scan - 100 scans would cost me ~$2 a day per user, or ~$20 a day if the global daily cap is reached
            // 9.8.26 - deleted the verification cache since it didn't help much
            // anthropic monthly spend limit is another real backstop



            // PRICE_VERIFY - original items worth $40+ get a web searched price, costs ~$0.01 per search, capped at 25 per device a day, scans take ~6-27 seconds (ON - 9.8.26)
              // web search scan is not too common            


            // 9.18.26
            // vercel - 60s ceiling
            // iOS default request timeout - 60s
            // loot check app - 45s ceiling - from testing the longest scan took ~27s
            // the app's deadline is always hit first 
            // after the first call (sonnet), if the item passes the checks i set, a web search can use whatever is left of the time - if it takes too long the user still gets Sonnet 4.6's own price
            // if the first call times out, it tries again with the remaining time
            // if both attempts time out, no price estimate is returned, and the user sees "That took longer than expected. Please try again."
            // both failed another way - like API being overloaded or a bad request - "Analysis failed" (502).
            // in both cases the user can see a try again button which reuses the same photos and hint, and a start over button
            // this is the only way to end up with no price - if just the web search fails, the user sees Sonnet's estimate
            // verified scan is scan with web search


            // loading state shows ~6 seconds, switches to ~25s at 10s
            // 0-10 s - "identifying ... ~6 seconds"
            // 10-25s - "checking recent listings... ~25 seconds"
            // after 25s - "checking recent listings... taking longer than usual..."


            // from testing web searches the range was 14-27s for verified scans 
            // results say where the estimate is from, "based on ..."


            {
              type: "heading",
              text: "Balancing Accuracy and API Costs",
              note: "",
            },


      {
        type: "text",
        text: "I used Claude Sonnet 4.6 due to its low costs and high accuracy at ~$0.013 per scan. I considered other models but the costs were similar and I wanted the results to be as trustworthy as possible.",
      },

      {
        type: "text",
        text: "A key product decision was determining how items were valued. Using a web search for every scan increased accuracy, but because it raised API costs by 3-4x and quadrupled the total latency from ~6-25 seconds, I chose to rely on Sonnet's pre-trained data for most items.",
      },


      {
              type: "heading",
              text: "Price Discovery",
              note: "",
            },
      
      {
        type: "text",
        text: "The project started with resale pricing, but the most interesting use case was showing it something original like a painting that wasn't listed before. That grew the idea into a price discovery tool for both used and original items.",
      },



      {
        type: "text",
        text: "This required two separate pricing strategies. Since handmade and original items lack past transaction data, the search workflow finds the asking prices of visually comparable items to estimate the value.",
      },

      // why not add a button that a user can press if its original
        // temporary solution

      {
        type: "image",
        src: "/projects/loot-check-pricing-fork.svg",
        max: 700,
        alt: "The pricing fork. After the iOS app uploads a photo, the scan asks whether the item is a handmade or original piece. If no, it is resale and priced from training data. If yes, there is no fixed secondhand catalog, so one web search finds the asking price of comparable work. Both paths end in an item valuation.",
      },


      {
              type: "heading",
              text: "Managing Inference Latency",
              note: "",
            },

              // managing inference latency - time budgeted fallback, trying to reduce errors
      {
        type: "text",
        text: "Scans with web searches took ~14-27 seconds from testing, so I capped searches at 45s and the loading state displays an estimated wait time. If the first API call times out, it automatically tries again with the remaining time. If both attempts fail, no price estimate is shown and the user can retry or start over.",
      },

            {
              type: "heading",
              text: "Designing for LLM Uncertainty",
              note: "",
            },

      {
        type: "text",
        text: "Since vision models are not 100% accurate, users can input optional keywords to guide the model before submitting a photo.",
      },



      {
        type: "images",
        columns: 2,
        // Crops off a retina screen, so 776px of file is 388px of screen.
        // Half the row plus the gap between the two halves holds the first
        // there, rather than letting a wide window blow it up past life size.
        max: 792,
        items: [
          {
            src: "/projects/loot-check-detail-input.png",
            fullOnPhone: true,
            alt: "The optional detail field under a photo of an OP-1 in its case, with \"keyboard and synth\" typed in and a tip to include a close-up of the brand logo",
          },
          {
            src: "/projects/loot-check-detail-result.png",
            fullOnPhone: true,
            alt: "The result for that photo: Teenage Engineering OP-1 Portable Synthesizer & Sampler with Case, tagged Electronics and Good, with the brand and a line of search keywords under it",
          },
        ],
      },


      {
        type: "text",
        text: "Results with low confidence are labeled \"best guess\", and users have the option to add another photo and retry.",
      },

      {
        type: "images",
        columns: 2,
        max: 792,
        items: [
          {
            src: "/projects/loot-check-generic-match.png",
            fullOnPhone: true,
            alt: "A warning card on a result titled \"Not sure of the exact product\". It says this looks like a generic match, suggests adding a close-up of the brand logo or typing the brand in the detail field, and offers an \"Add a photo & retry\" button",
          },
        ],
      },
      
                {
                  type: "heading",
                  text: "Result",
                  note: "Retrospective",
                },

      {
        type: "text",
        text: "Loot Check is live on the [App Store](https://apps.apple.com/us/app/loot-check/id6785767104). With no marketing, the app gained over 100 organic downloads and ~7K App Store impressions in the first two months with 870 items scanned globally. Requests didn't get lost, keys stayed secure, and there were no runaway API costs or crashes.",
      },

      // the first scan matters - how fast it is, if the price is believable


      // 9.20.26: rn only stores total scans in Upstash, per device daily scan counts and web search counts stored for 2 days
      // not recorded anywhere: duration, original vs. resale, confidence, what the item was, and whether the scan succeeded

      /// so i need to figure out what data to capture while still respecting the users privacy
      // to get a better idea of the best use cases for this app and how to improve it
      // how to monetize

      // privacy: 
      // never stored: photos, hint text, item title, brand name
      // maybe can store: category of the item, a yes/no if a brand was recognized, timings, confidence, web search outcome, price range, and cost

      // backend - anonymous per scan analytics, no device linking, respescting the users privacy
      // every scan is kept anonymous for privacy. (clothing, resale, high confidence, 2 photos, 6.1s, no web search, $25-40)
      // App Store - usage data is collected and is not linked to the users device
      

       {
        type: "text",
        text: "I wanted to automate the listing process but because marketplaces don't have a public listing API, the app creates a title and description for copy and paste. The next steps are continuing to test the app and learning which use cases provide the most value.",
      },
    ],
  },


  "paper-reader": {
    title: "Paper Reader",
    date: "Jul–Aug 2026",
    role: "Design, iOS dev, Solo",
    scope: "Prototype",
    blocks: [
      {
        type: "video",
        src: "/projects/paper-reader-add-and-listen.mp4",
        controls: true,
        captionAlign: "highest",
        caption: "Add a new paper from files",
        captionHiddenOnPhone: true,
        captionLeft: [
          "Audio is generated as the user needs, lowering initial cost and wait time",
        ],
      },

      {
        type: "heading",
        text: "Context",
        note: "Problem & Solution",
      },

        {
        type: "text",
        text: "A friend was listening to a research paper while walking and got '[1] et al., pp. 234-256' read aloud in a robot voice. I tried to build an app to fix that problem.",
      },
       {
        type: "text",
        text: "I designed the app around a user paying for their own API usage due to the costs of audio generation at ~$1-3 per paper. To keep things simple, I used one API to identify text and generate audio. Gemini 3.1 Flash was the best option because it could clean up text and had text to speech with eight voices.",
      },      

      {
              type: "heading",
              text: "Generating Audio in Groups",
              note: "Design Decisions",
            },

        // network lag - more API requests can cause delays, or hit Gemini's rate limit
        // Gemini - Free Tier so thats 15 requests per minute
        // TTS takes time - 50 seconds of audio, ~20 seconds for Gemini to process and return
        // so initial wait is 20 seconds

        // 50 second groups - 1 API request per minute

        // the app works on Google's free tier - 10-15 mins of free audio generation a day
        // a user could be using the free tier so i had to consider rate limits
        
        // typical academic paper is 30 - 45 mins of audio

      {
        type: "text",
        text: "Generating audio for the entire paper was unnecessary if someone only wanted to listen briefly. I organized text from a paper into groups of about 750 characters, which made ~50 seconds of audio. Making groups shorter would require more API requests and could reach Gemini's Free Tier rate limit, while making groups longer would increase the initial wait time. At 50 seconds, the first group takes ~20 seconds to generate and the next group loads in the background.",
      },


            {
              type: "heading",
              text: "Highlighting",
              note: "",
            },
        
        // Apple PDFKit extracts the text from the paper
        // Apple NLTokenizer splits text
      {
        type: "text",
        text: "Because Gemini only returns audio and no timestamps, the app has to estimate which sentence is being spoken to highlight it. I used Apple's NLTokenizer to find the end of each sentence instead of splitting text on periods to prevent abbreviations like 'et al.' or 'Fig. 1' from breaking sentences. The app groups the sentences, sends them to Gemini TTS, and receives an audio clip. Since the app knows the duration of the clip, it divides a group's audio proportionally by character count, so a sentence with 5% of a group's characters is assumed to take 5% of the audio. As audio plays, the app tracks the time passed and highlights a sentence based on its estimate. This is not always accurate so sentences are re-synced at the start of every group to minimize errors.",
      },

      {
        type: "image",
        src: "/projects/paper-reader-highlight-detail.png",
        width: 420,
        alt: "A close read of the narration: the sentence being spoken sits in a pale blue block, the lines either side of it in grey",
      },

      {
        type: "text",
        text: "When processing fails, the paper enters an error state and shows the exact error message.",
      },
      {
        type: "image",
        src: "/projects/paper-reader-library-error-detail.png",
        width: 420,
        alt: "A close read of the failed row: the paper's name over the Gemini error in red, with a retry button on its right",
      },
      {
        type: "text",
        text: "I added a sample paper to test the app before setting up a key.",
      },
      {
        type: "image",
        src: "/projects/paper-reader-sample-paper-detail.png",
        width: 420,
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
      
            {
              type: "heading",
              text: "Result",
              note: "Retrospective",
            },

      {
        type: "text",
        text: "Reflecting on this project, I realized that I prioritized avoiding API costs over delivering a good user onboarding experience which impacted the whole design. Requiring users to bring their own Gemini API key kept the app free for me to host but created unacceptable friction.",
      },

      {
        type: "text",
        text: "If I continued this idea, I would manage keys on the backend and either cover the initial costs for onboarding, charge per paper, or switch to a cheaper TTS model. Considering the market, products like Speechify dominate consumer text to speech and solve the same problems so it would be difficult to monetize this idea without a valuable use case.",
      },
    ],
  },



  "screen-translator": {
    title: "Screen Translator",
    date: "Sep 2026",
    role: "Design, iOS dev, Solo",
    scope: "Prototype",
    blocks: [
      {
        type: "video",
        src: "/projects/screen-translator-demo.mp4",
        controls: true,
        captionAlign: "higher",
        // A no-break space keeps "see translations" together on the second line.
        caption: "long press the Dynamic Island to see translations",
        captionLeft: "choose a section of the screen to translate",
        captionLeftAlign: "low",
        captionLeftHiddenOnPhone: true,
      },

      {
          type: "heading",
          text: "Context",
          note: "Problem & Solution",
        },
      {

        type: "text",
        text: "Constantly switching apps while learning a language is annoying, time-consuming, and makes learning inefficient, so I created an app that translates the Korean text on screen to English in real time.",
      },
  
      {
        type: "text",
        text: "My first idea was to generate text over the current display, but iOS does not allow an app to draw over another app. To get around this, I used the Dynamic Island since it stays visible in every app. I used ReplayKit to broadcast video frames, Apple Vision OCR to extract Korean text, DeepL API for translations, and ActivityKit to update the island."
      },

      {
          type: "heading",
          text: "System Constraints",
          note: "Design Decisions",
        },


      {
        type: "text",
        text: "Because iOS controls how and when the Dynamic Island is displayed, I designed for states I couldn't choose and updates I couldn't guarantee."
      },
      //iOS prohibits third party overlay windows, which makes language learning more difficult since a user experiences constant context switching between an app and Google Translate.

      {
        type: "text",
        text: "The island has three states: minimal, compact, and expanded. iOS treats Live Activities as an occasional status update and not a live display, so I could not keep the expanded state on screen, and the user has to long press the island to see the translation. I also had to design UI elements around the front-facing camera in the top-center area of the screen."
      },


      // dynamic island has no published refresh rate, and iOS silently limits background updates
      // designed the island so it only shows text from the translation region (selected by the user)
      // dynamic island can't refresh on its own, it only updates when the app calls activity.update
      
      // the app uses a Live Activity (ActivityKit) to display translations in the island
      // because the system (not my app) controls how and when the dynamic island displays the activity, I designed for states I couldn’t choose and updates I couldn’t guarantee 


      // 3 different dynamic island states
      // minimal (active overlay, default state)
      // compact (limited by iOS, since we r recording the screen, appears for 6 seconds after recording stops)
      // expanded (during recording, long press, full caption card)
      // iOS collapses it on its own again
      
      // island shows at most 2 live activities at once - screen recording indicator and the app
      // which is why the minimal state is showing most of the time
      // though Apple's default is compact state

      // iOS renders the expanded island only when the app pushes an update, it can't render at the moment of the long press
      // if i long press and see previous text, the latency is bc of OCR (optical character recognition) and network time - the new update hasn't been pushed yet
      
      // 1. screen is captured
      // 2. OCR reads the text out of the image
      // 3. round trip to translation API
      // 4. activity.update pushes the new text
      // 5. iOS re renders the island


      // iOS decides execution time - when the app can run
      // iOS suspends background apps for battery, speed, privacy
      // each Live Activity has an update budget - which delays or drops updates that are too often
      // call activity.update 
      // need to keep the app running in the background - Apple keeps screen broadcast extensions / screen recording running
 
      

      {
        type: "image",
        src: "/projects/screen-translator-island-minimal.png",
        // The three island shots share one size so they read as a set. 455
        // is 1:1 for this 2x capture, 910px across; 204 is the compact shot's
        // natural height at that width, and the crop keeps the island at the
        // top and gives up the bottom of the news nav.
        max: 455,
        height: 204,
        crop: "top",
        alt: "The minimal Dynamic Island over the top of the Naver News site: the island shrunk to a Korean flag, a red recording dot in its own circle beside it, and the blue news header with its section tabs under the status bar",
        caption: "minimal state (active while recording)",
        captionCenter: true,
      },

      {
        type: "image",
        src: "/projects/screen-translator-island-compact.jpg",
        // The one the other two are sized to: 455 across is 204 tall at its
        // own proportions, so nothing is cropped here.
        max: 455,
        height: 204,
        alt: "The compact Dynamic Island on the home screen above the FaceTime, Calendar, Photos and Camera icons: a Korean flag, an arrow and a US flag at the left, and the start of the Korean line being read at the right",
        caption: "compact state (after recording stops)",
        captionCenter: true,
      },

      {
        type: "image",
        src: "/projects/screen-translator-island-expanded-news.png",
        // The top of a full-screen capture, cut to 1206 by 541 — the compact
        // shot's exact proportions — so it lands at the same size with no
        // crop in the browser. A step wider than the two above it, at the
        // same proportions.
        max: 480,
        height: 215,
        alt: "The expanded Dynamic Island over the top of a Korean news article: a Korean-to-US flag pair and a pin at the top, a two-line Korean headline about a Samsung employee's internal loan sending home prices soaring in Suwon Yeongtong, and its English translation under it in grey",
        caption: "expanded state (long press for full translation)",
        captionCenter: true,
      },


      {
          type: "heading",
          text: "Translation Region",
          note: "",
        },

      {
        type: "text",
        text: "Translating the entire screen was impractical because of the limited space to display the text. To improve accuracy and prevent clutter, I added an interactive crop box for selecting a specific area of the screen to align the app with the user's intent."
      },

      {
        type: "image",
        src: "/projects/screen-translator-region-card.png",
        // A step under the card's own size: the shot is a 2x capture cropped
        // to the card's edges, 837px across, so 418 would show it 1:1 on a
        // Retina screen. 380 keeps it clearly a card rather than a screen.
        max: 380,
        // The card's own corners, measured off the alpha channel: ~72px at
        // the file's 2x scale, which is 36 at 1:1 and 33 at 380 across.
        radius: 33,
        // Centred to the pixel it read as sitting a touch left.
        shift: 6,
        alt: "The Translation region card: a crop icon and title with a Custom dropdown at the right, a note that only text inside the box is translated, a phone outline with a blue box dragged over the top of its screen and a resize handle at the corner, and Subtitle band and Full screen presets along the bottom",
      },

      {
          type: "heading",
          text: "Translation Models",
          note: "",
        },

      {
        type: "text",
        text: "I used DeepL for sentence translations and Claude Opus 5 for word definitions. DeepL was excellent for full sentences, but unreliable for individual words. Claude was more accurate for words because it could define each word as it's used in the context of the sentence."
      },

       {
        type: "text",
        text: "I had Claude do a benchmark test comparing Opus 5 and DeepL on sentence translations. Claude had a median latency of 2.07 seconds compared to 0.73s for DeepL. Claude was also about 5x more expensive, at $0.0031 per sentence vs. $0.0006 for DeepL."
      },
      
       // had claude do a benchmark test with claude and deepl
      // using claude for sentence translations had higher latency and was more expensive than deepl
      // claude was about 3x slower
      // claude - median 2070 ms - 2.07 s per sentence
      // deepl - median 727 ms - 0.73 s 
      // cost is $0.0006 per sentence DeepL and $0.0031 claude opus 5 for a sentence of ~25 Korean characters



      {
          type: "heading",
          text: "First UI Design",
          note: "",
        },

        {
        type: "text",
        text: "I tested the island and floating window in the first prototype to see which display felt better to use. Because I didn't need to see the translation of every sentence, I focused on the Dynamic Island and making it feel as seamless as possible."
      },
      
      {
        type: "images",
        // Three phones across. The row is what is held rather than each shot,
        // so they keep sharing it evenly: 900 across, less the two gaps, puts
        // each phone at 289px whatever the window is doing.
        max: 900,
        stackOnPhone: true,
        items: [
          {
            src: "/projects/screen-translator-2.png",
            alt: "The Dynamic Island expanded over a Korean news feed, holding the headline and its English translation",
          },
          {
            src: "/projects/screen-translator-floating-window.png",
            alt: "The floating window over the Naver news front page: a red recording dot in the Dynamic Island, the Politics tab's headline list, and a dark caption panel at the bottom holding the first headline in Korean, its English translation, and the start of the next one",
          },
          {
            src: "/projects/screen-translator-1.png",
            alt: "The recording screen: a red Recording card over a running list of live captions, each Korean line with its English under it",
          },
        ],
      },

      

      {
          type: "heading",
          text: "Current UI Design",
          note: "",
        },

        {
        type: "text",
        text: "The home screen centers on a circle that starts the recording. Settings are shown in a list of rows, so nothing is hidden behind a separate menu. Once recording starts, the user can leave the app and open whatever they want to read. Screen Translator stays active in the background and translates text from the selected region of the screen."
      },


      {
        type: "images",
        max: 900,
        stackOnPhone: true,
        items: [
        
          {
            src: "/projects/screen-translator-captions-idle.png",
            alt: "The Translate tab before a session: a card with a grey circle and the words Tap the circle to start screen recording, then rows for Select display set to Island, Translation region set to Custom, API Keys and Debug log",
          },
          {
            src: "/projects/screen-translator-recording.png",
            alt: "The Translate tab while recording: the Dynamic Island holding a red recording dot, the card retitled Recording with a note that captions follow you between apps, a red to blue glow around it, and two Korean sentences from a court ruling with their English under each",
          },
          {
            src: "/projects/screen-translator-captions-sheet.png",
            alt: "The Live captions sheet: a count of thirteen and a Done button, then each caption as a card with its Korean line, its English under it and a pin at the corner, the first one pinned in blue and the rest hollow",
          },
        ],
      },


      {
          type: "heading",
          text: "Saving Translations for Learning",
          note: "",
        },

      {
        type: "text",
        text: "Pinning a sentence saves it to the \"Learn\" page and breaks it into individual words. Tapping a word shows its definition as used in that sentence."
      },

      {
        type: "video",
        src: "/projects/screen-translator-pin-and-learn.mp4",
        controls: true,
        caption: "",
      },


      {
          type: "heading",
          text: "Result",
          note: "Retrospective",
        },

      {
        type: "text",
        text: "The biggest lesson from this project was learning to design with system constraints. Every decision had to account for iOS limitations, which pushed me to find different solutions. It was difficult to make the user experience feel seamless when there was so much out of my control, like the Dynamic Island's current state and when Live Activities update."
      },

      {
        type: "text",
        text: "After building a working prototype, I looked for academic research to see if this idea had real merit. I found a paper reviewing 42 studies, which showed that readers who see translations alongside the text learn 45% of new words compared to 27% without them [(Yanagisawa et al., 2020)](https://takumiuchihara.weebly.com/uploads/1/2/3/7/123756989/yanagisawa-webb-uchihara-2019-glossing_meta-analysis.pdf). Seeing that data gave me more conviction to keep refining the concept."
      },

      {
        type: "text",
        text: "If I continued this project, I would work on the UI/UX so the island feels more responsive and aligned with the user's intent. I would also improve translations for visual diagrams and make it work with any app. Currently only Korean is translated, but I could add more languages and test whether other people find it helpful for learning."  
      },
      // could try making it vocabulary focused, only translating difficult words from a sentence, not the entire sentence
      // so it would show only a few difficult or new words in the dynamic island not the sentence

    ],
  },



  "buy-side-briefings": {
    title: "Buy Side Briefings",
    date: "May 2026–Present",
    role: "Design, web dev, Solo",
    scope: "Live on the web",
    href: "https://buy-side-briefings.vercel.app/",
    blocks: [


      {
        type: "image",
        src: "/projects/buy-side-site-today-5.png",
        max: 1000,
        alt: "The Today page with the toggle on AM: a live ticker strip under the nav, then the morning report of Monday, September 14, filed at 8:21 AM ET, its headline on frontier AI labs calling for a slowdown and chip stocks dropping before the open, the paragraph that argues it, a link out to the full six minute read, and the charts panel opening underneath",
      },

            {
              type: "heading",
              text: "Context",
              note: "Problem & Solution", // title text on the left side
            },


      {
        type: "text",
        text: "Stock prices change constantly, and it takes time and judgement to find the right information. Tracking the market requires aggregating data from multiple sources: stock exchanges, financial news outlets, SEC filings, and social media. "
      },

      {
        type: "text",
        text: "This is a fragmented workflow due to context switching and information overload. It can be difficult to separate what's relevant from the noise, which leads to uncertainty and missed opportunities. My solution was an automated market reporting website that aggregates this information and generates daily reports so I can make faster decisions."
      },

            {
              type: "heading",
              text: "Curating Market Context with AI",
              note: "Design Decisions",
            },
      
      {
        type: "text",
        text: "I designed an automated research pipeline that runs parallel web queries across market data, sentiment indicators, economic calendars, and a fixed set of stocks. The core of the project is the [instructions file](https://github.com/jkleejr/buy-side-briefings/blob/deploy/prompts/markets-website.md), which controls how each report is researched and written and defines the JSON schema the website renders from.", //
      },

    
      {
        type: "text",
        text: "Because LLMs don't have long term memory, the agent calibrates itself by reading reports of the last few days before writing. The historical data simulates continuity and allows the report to distinguish between ongoing and new market trends."
      },

      {
        type: "image",
        src: "/projects/buy-side-briefings-authoring-loop.svg",
        max: 700,
        alt: "Authoring loop. A cron trigger starts the agent, which researches the session on the web and then writes two files: a structured verdict JSON and a written report. The JSON is parsed and checked against the schema. If it fails, the agent rewrites it. If it passes, a script stamps the generated-at timestamp from the clock, and the files are committed and pushed.",
      },

      {
        type: "heading",
        text: "Designing a Pre-Market vs. After-Hours Workflow",
        note: "",
      },


      {
        type: "text",
        text: "An investor's mental state changes fundamentally depending on the time of day. The morning report is forward looking and focuses on preparation for pre-market open. The night report is analytical and reflects on the day's performance."
      },

      {
        type: "text",
        text: "I added an AM/PM toggle to visually accommodate different mental states. Switching to another report restructures the page with the right information."
      },

            {
              type: "heading",
              text: "Data Visualization",
              note: "",
            },

            {
        type: "text",
        text: "I used real time market data from Yahoo Finance (delayed quotes) and FRED to visualize price action.",
      },
      // delay only applies during the trading session, since outside market hours the last price is the close for most stocks. us stocks and etfs are delayed by ~15 minutes, crypto is closer to current
      // data for chart comes from Yahoo Finance API

      {
        type: "text",
        text: "The interactive chart allows a quick inspection of tickers with candlestick ranges and some technical tools like volume, RSI, EMA, support/resistance and fibonacci levels."
      },

      {
        type: "image",
        src: "/projects/buy-side-chart-2.png",
        max: 800,
        alt: "The charts panel: Nvidia selected, range and bar controls under it, and a daily candlestick chart zoomed to ninety bars with a hover card on the March 27 bar showing its open, high, low, and volume, over a footer crediting Yahoo Finance and noting quotes are delayed about fifteen minutes",
      },


            {
        type: "text",
        text: "To display the flow of capital, I added a table for short term (1 day) and medium term (50 day) changes of 11 ETFs. "
      },

      {
        type: "image",
        src: "/projects/buy-side-sector-rotation.png",
        max: 800,
        alt: "The sector rotation table: eleven sectors from Energy down to Consumer Discretionary, each with its ETF ticker, today's move, and the fifty day move, the gains in green and the losses in red, with a source line under it noting the quotes are delayed",
      },

      {
        type: "text",
        text: "Instead of using a calendar list, I designed a timeline for upcoming earnings calls up to 90 days out. Solid dots represent confirmed dates and hollow dots are unconfirmed.",
      },

      {
        type: "image",
        src: "/projects/buy-side-earnings-timeline.png",
        max: 800,
        alt: "The earnings timeline: nineteen tickers from MU down to WMT, each with a dot placed along a line running from today past sixty days out and a count of days until it reports, filled dots for confirmed dates and hollow ones for estimates",
      },

      {
        type: "heading",
        text: "Mobile Design",
        note: "",
      },
      {
        type: "text",
        text: "The mobile design keeps the same style as the desktop interface with a few small changes. The headline description is more concise and all other pages were moved into a menu button."
      },

      {
        type: "images",
        // Four phones, two across: one block and not a block per pair, so
        // that on a phone they are one pile of four to swipe through rather
        // than two piles of two. The rows sit the same 16px apart either way.
        columns: 2,
        max: 650,
        stackOnPhone: true,
        items: [
          {
            src: "/projects/buy-side-mobile-today.png",
            alt: "The Today page on a phone: the ticker strip under the nav, the date with an AM/PM toggle set to AM, the morning report's headline on US strikes on Iranian tankers pushing oil to a two-month high while only short rates move, its opening paragraph, a link to the six minute read, and the charts panel starting below",
          },
          {
            src: "/projects/buy-side-mobile-full-read.png",
            alt: "The full read on a phone: a back link to all reports, the date and Morning label, the headline, the time the report was generated, then bulleted takeaways on Brent breaching $100, US Central Command destroying five Iranian tankers, the two-year Treasury yield rising two basis points, and the Treasury's doubled long-end buybacks",
          },
          {
            src: "/projects/buy-side-mobile-full-read-body.png",
            alt: "Further down the full read on a phone: a CNBC source link, a collapsed row for three more sourced points, the Full Read label with a six minute estimate, an italic methodology note, then the first section heading on Brent clearing $100 with its body paragraph and underlined sourced bullets below",
          },
          {
            src: "/projects/buy-side-mobile-pre-open-table.png",
            alt: "The pre-open table on a phone for September 9, 2026: rows for Brent, WTI, the 2-year, 10-year and 30-year Treasuries, S&P 500, Nasdaq 100, Dow and Russell 2000 futures, gold, the dollar index, the VIX and bitcoin, each with its level, change and a short note, with the rows the report keys on highlighted in blue",
          },
        ],
      },

            {
              type: "heading",
              text: "Result",
              note: "Retrospective",
            },
      {
        type: "text",
        text: "This project has changed many times since the start. Initially I used AI to predict the market and send me buy/sell signals based on its research, but I realized that a strictly informational website would help me more. [Buy Side](https://buy-side-briefings.vercel.app/) used to display a lot more data when I was learning the market but I cut it down to the most important resources."
      },

      {
        type: "text",
        text: "Since the website keeps a record of previous reports, it would be interesting to use that data to find sentiment trends. I plan to keep improving the reports and add features I find useful."
      },
    ],
  },
};
