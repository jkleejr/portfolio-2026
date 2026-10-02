export type CaseStudyBlock =
  | { type: "heading"; text: string; note?: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; attribution?: string }

  // Screen Translator crop box demo
  | {
      type: "region-demo";
      alt: string;
      max?: number;
      radius?: number;
      shift?: number;
    }

  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      captionCenter?: boolean;
      crop?: string;
      width?: number;
      max?: number;
      height?: number;
    }

  | {
      type: "images";
      items: {
        src: string;
        alt: string;
        fullOnPhone?: boolean;
      }[];
      columns?: 2;
      stackOnPhone?: boolean;
      max?: number;
    }
  // Autoplays muted and looping. Set controls to let a viewer pause, go back or forward
  | {
      type: "video";
      src: string;
      caption?: string;
      captionLeft?: string | string[];
      captionLeftAlign?: "low";
      controls?: boolean;
      captionAlign?: "higher" | "highest";
      captionHiddenOnPhone?: boolean;
      captionLeftHiddenOnPhone?: boolean;
    }
  | { type: "divider" };

export type CaseStudy = {
  title: string;
  href?: string;
  scope?: string;
  role?: string;
  date?: string;
  appStore?: string;
  blocks: CaseStudyBlock[];
};

// outcome + reflection - i wont have team metrics and thats fine. outcomes should show direction, learning, or real world impact.

// note on figma: when good designers show process artifacts, they present them beautifully, cleaned up, on consistent backgrounds, annotated
// dont show raw uncropped screenshots w mismatchced sizes

// thinking process, execution quality, problem solving

// design thinking -empathise, define, ideate, prototype, test

// frame the problem in terms of user friction and business opportunity. state a clear hypothesis or goal.

export const caseStudies: Record<string, CaseStudy> = {
  "loot-check": {
    title: "Loot Check",
    appStore: "https://apps.apple.com/us/app/loot-check/id6785767104",
    date: "Jun 2026–Present",
    role: "Product Design",
    scope: "App Store",
    blocks: [
      {
        type: "heading",
        text: "Problem",
        note: "Overview",
      },
      {
        type: "text",
        text: "Price discovery for used items is time consuming and full of small frictions: identifying the exact item, finding the fair market price, and comparing what you'd keep after platform fees."
      },
      {
        type: "heading",
        text: "Solution",
        note: "",
      },
      {
        type: "text",
        text: "A free appraisal app that uses Claude to value an item, compare payouts from different marketplaces, and suggest the best option to sell it."
      },

      {
        type: "video",
        src: "/projects/loot-check-shark.mp4",
        controls: true,
        caption: "Finding the potential value of a painting",
      },

      {
        type: "heading",
        text: "System Architecture",
        note: "System Design",
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
        max: 760,
        alt: "Architecture diagram. The iOS app uploads a photo to a single analyze endpoint on Vercel, which calls Claude Sonnet 5.5 to identify and price the item and Upstash Redis for daily caps and search allowances. A JSON response returns to the app as an item valuation with payouts from marketplaces.",
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
        text: "I chose Claude Sonnet 5.5 due to its low costs and high accuracy at ~$0.024 per scan. I considered slightly cheaper options like Sonnet 4.6, but I wanted the results to be as trustworthy as possible.",
      },
      // Sonnet 4.6 ~$0.013 per scan
      // Sonnet 5.5 ~$0.024
      // input grew since the instructions got longer, and output grew because the AI writes more - returns a ranked list of marketplaces

      {
        type: "text",
        text: "A key product decision was determining how items were valued. Using a web search for every scan increased accuracy, but because it raised API costs by 3-4x and quadrupled the total latency from ~6 to ~25 seconds, I chose to rely on Sonnet's pre-trained data for most items.",
      },

      {
        type: "heading",
        text: "Price Discovery",
        note: "Product Scope",
      },

      {
        type: "text",
        text: "The project started with resale pricing, but the most interesting use case was showing the app something original like a painting that wasn't listed before. That grew the idea into a price discovery tool for both used and original items.",
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
        max: 760,
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
        text: "While most scans took ~6 seconds, a scan with web searches took ~14 to 27 seconds in testing, so I capped searches at 45 seconds and the loading state displays an estimated wait time. If the first API call times out, it automatically tries again with the remaining time. If both attempts fail, no price estimate is shown and the user can retry or start over.",
      },

      {
        type: "heading",
        text: "Designing for Model Uncertainty",
        note: "User Testing",
      },

      {
        type: "text",
        text: "Early testing with friends and family quickly showed the limits of using Sonnet 4.6 in the first prototype. When testing items like jewelry and bracelets, the vision model struggled to identify some brands and gave very inaccurate prices. Watching them experience this problem led to two key design decisions:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Optional Keyword Hints: Letting users enter a brand or description before scanning to guide the vision model.",
          "Confidence Ratings (Best Guess, Certain): Being open when Sonnet's confidence is low so users don't trust a wrong estimate, and allowing them to take another photo or retry.",
        ],
      },

      {
        type: "images",
        columns: 2,
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
        text: "Results with low confidence are labeled \"best guess,\" and users have the option to add another photo and retry.",
      },

      {
        type: "images",
        columns: 2,
        max: 792,
        items: [
          {
            src: "/projects/loot-check-best-guess.png",
            fullOnPhone: true,
            alt: "A result card for a Ceramic Table Lamp, tagged Home Decor, Good, and a yellow \"Best guess\" label, with the brand shown as unknown and search keywords under it",
          },
          {
            src: "/projects/loot-check-generic-match.png",
            fullOnPhone: true,
            alt: "A warning card on a result titled \"Not sure of the exact product.\" It suggests adding a close-up of the brand logo or label, or adding a hint and identifying again for more accurate results, and offers an \"Add a photo & retry\" button.",
          },
        ],
      },

       {
        type: "heading",
        text: "UI Design",
        note: "Interaction Flow",
      },

      {
        type: "text",
        text: "I designed Loot Check to get from photo to price in three steps. Taking a photo is the main action on the home screen. The results show the photo above the title so the user can check it's the right item, followed by an estimated price range. The 'Where to sell' section compares what the user would pocket after fees on each marketplace and highlights the best option."
      },

      {
        type: "images",
        columns: 2,
        max: 650,
        stackOnPhone: true,
        items: [
          {
            src: "/projects/loot-check-ui-home.png",
            alt: "The Loot Check home screen: the title, a line saying to snap something you want to sell, a green 1,584 items scanned globally badge, Take a photo and Choose from library buttons, and a History list of Calbee Jagapokkuru potato snacks at $4, an Akai MPK Mini at $55, a '47 Brand LA Dodgers cap at $20, and a Louis Vuitton chain bracelet at $300",
          },
          {
            src: "/projects/loot-check-ui-photo-added.png",
            alt: "The home screen after a photo is added: a thumbnail of an Akai MIDI keyboard beside an empty slot for a second photo, an optional detail field with a tip to include the brand logo or label, and Identify, Add from library, and Start over buttons",
          },
          {
            src: "/projects/loot-check-ui-result.png",
            alt: "The result for the photo: the Akai keyboard at the top, then Akai Professional MPK Mini 25-Key USB MIDI Keyboard Controller, Black, tagged Electronics, Good, and Certain, its brand and search keywords, and an estimated resale value of $55 that resells for $40 to $70, marked as an exact product match",
          },
          {
            src: "/projects/loot-check-ui-where-to-sell.png",
            alt: "Further down the result: the $55 estimate, then Where to Sell recommending eBay because buyers search it by exact model, with a list of what you'd pocket after fees on eBay at $48 marked Best, Reverb at $50, Facebook Marketplace at $55, Mercari at $50, and OfferUp at $55",
          },
        ],
      },

      {
        type: "heading",
        text: "Privacy",
        note: "",
      },

      {
        type: "text",
        text: "Privacy choices also impacted the design. Photos are sent to Claude to identify the item, but past scans, photos, and results are saved only on the user's device. Considering the user's privacy, I decided to keep an anonymous record of each scan, like how the price was worked out and how confident the estimate was to find ways to improve the app.",
      },

      {
        type: "heading",
        text: "Results",
        note: "Reflection",
      },

      {
        type: "text",
        text: "Loot Check is live on the [App Store](https://apps.apple.com/us/app/loot-check/id6785767104). The app gained 200+ organic downloads and ~14K App Store impressions in the first two months, with 1,375 items scanned. Requests didn't get lost, keys stayed secure, and there were no runaway API costs or crashes.",
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
        text: "I wanted to automate the listing process, but because marketplaces don't have a public listing API, the app creates a title and description to copy and paste. The next steps are continuing to test the app and learning which use cases provide the most value.",
      },
    ],
  },

  "paper-reader": {
    title: "Paper Reader",
    date: "Jul–Aug 2026",
    role: "Product Design & Audio UX",
    scope: "iOS Prototype",
    blocks: [
      {
        type: "heading",
        text: "Problem",
        note: "Overview",
      },

      {
        type: "text",
        text: "A friend was listening to a research paper while walking and got \"[1] et al., pp. 234-256\" read aloud in a robot voice.",
      },

      {
        type: "heading",
        text: "Solution",
        note: "",
      },

      {
        type: "text",
        text: "A text-to-speech app that parses text from a .PDF file, removes unnecessary information, and reads it aloud in a natural voice. I designed it around a user paying for their own API usage due to the costs of audio generation at ~$1-3 per paper. Gemini 3.1 Flash was the best option because it could clean up text and had text-to-speech with eight voices.",
      },

      {
        type: "video",
        src: "/projects/paper-reader-add-and-listen.mp4",
        controls: true,
        captionAlign: "highest",
        caption: "Add a new paper from files",
        captionHiddenOnPhone: true,
        captionLeft: [
          "Audio is generated as the user listens, lowering initial cost and wait time",
        ],
      },

      {
        type: "heading",
        text: "Generating Audio in Groups",
        note: "Latency UX",
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
        text: "Generating audio for the entire paper was unnecessary if someone only wanted to listen briefly. I organized text from a paper into groups of about 750 characters, which made ~50 seconds of audio. Making groups shorter would require more API requests and could reach Gemini's free-tier rate limit, while making groups longer would increase the initial wait time. At 50 seconds, the first group takes ~20 seconds to generate and the next group loads in the background.",
      },

      {
        type: "heading",
        text: "Highlighting",
        note: "Visual Sync",
      },

      // Apple PDFKit extracts the text from the paper
      // Apple NLTokenizer splits text
      {
        type: "text",
        text: "Because Gemini only returns audio and no timestamps, the app has to estimate which sentence is being spoken to highlight it. I used Apple's NLTokenizer to find the end of each sentence instead of splitting text on periods, so abbreviations like \"et al.\" or \"Fig. 1\" don't break sentences. The app groups the sentences, sends them to Gemini TTS, and receives an audio clip. Since the app knows the duration of the clip, it divides a group's audio proportionally by character count, so a sentence with 5% of a group's characters is assumed to take 5% of the audio. As audio plays, the app tracks the time passed and highlights a sentence based on its estimate. This is not always accurate, so sentences are re-synced at the start of every group to minimize errors.",
      },

      {
        type: "image",
        src: "/projects/paper-reader-highlight.mp4",
        width: 420,
        alt: "A close read of the narration: the sentence being spoken sits in a pale blue block, the lines on either side of it in gray, and the block moves on to the next sentence as the page scrolls",
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
        text: "I added a sample paper so users can try the app before setting up a key.",
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


      {
        type: "heading",
        text: "Results",
        note: "Reflection",
      },

      {
        type: "text",
        text: "Reflecting on this project, I realized that I prioritized avoiding API costs over delivering a good user onboarding experience, which impacted the whole design. Requiring users to bring their own Gemini API key kept the app free for me to host but created unacceptable friction. Studying other startups, I learned that customers prefer predictable pricing. But token costs vary with usage, which makes that difficult.",
      },

      {
        type: "text",
        text: "If I continued this idea, I would manage keys on the backend and cover the initial costs for onboarding, charge per paper, or switch to a cheaper TTS model. In the current market, products like Speechify dominate consumer text-to-speech and solve the same problems, so it would be difficult to monetize this idea without a valuable use case.",
      },
    ],
  },

  "screen-translator": {
    title: "Screen Translator",
    date: "Sep 2026",
    role: "Interaction Design",
    scope: "iOS Prototype",
    blocks: [
      {
        type: "heading",
        text: "Problem",
        note: "Overview",
      },
      {
        type: "text",
        text: "Constantly switching apps to translate Korean is time-consuming and makes learning words less efficient due to context switching.",
      },
      {
        type: "heading",
        text: "Solution",
        note: "",
      },
      {
        type: "text",
        text: "A screen recording app that displays real-time Korean to English translations on the Dynamic Island and allows users to save sentences for learning.",
      },

      {
        type: "video",
        src: "/projects/screen-translator-demo.mp4",
        controls: true,
        captionAlign: "higher",
        // A no-break space keeps "see translations" together on the second line.
        caption: "Long press the Dynamic Island to see translations",
        captionLeft: "Choose a section of the screen to translate",
        captionLeftAlign: "low",
        captionLeftHiddenOnPhone: true,
      },

      {
        type: "heading",
        text: "System Constraints",
        note: "Limitations",
      },

      {
        type: "text",
        text: "My first idea was to generate text over the current display, but iOS does not allow an app to draw over another app. To get around this, I used ReplayKit to broadcast video frames, Apple Vision OCR to extract Korean text, the DeepL API for translations, and ActivityKit to update the island.  I chose the Dynamic Island to display translations since it stays visible in every app."
      },

      {
        type: "text",
        text: "Because iOS controls how and when the Dynamic Island is displayed, I designed for states I couldn't choose and updates I couldn't guarantee."
      },

      {
        type: "text",
        text: "The island has three states: minimal, compact, and expanded. iOS treats Live Activities as occasional status updates rather than a live display, so I could not keep the expanded state on screen, and the user has to long press the island to see the translation. I also had to design UI elements around the front-facing camera in the top-center area of the screen."
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
        max: 455,
        height: 204,
        crop: "top",
        alt: "The minimal Dynamic Island over the top of the Naver News site: the island shrunk to a Korean flag, a red recording dot in its own circle beside it, and the blue news header with its section tabs under the status bar",
        caption: "Minimal state (active while recording)",
        captionCenter: true,
      },

      {
        type: "image",
        src: "/projects/screen-translator-island-compact.jpg",
        max: 455,
        height: 204,
        alt: "The compact Dynamic Island on the home screen above the FaceTime, Calendar, Photos, and Camera icons: a Korean flag, an arrow, and a US flag at the left, and the start of the Korean line being read at the right",
        caption: "Compact state (after recording stops)",
        captionCenter: true,
      },

      {
        type: "image",
        src: "/projects/screen-translator-island-expanded.mp4",
        max: 480,
        height: 215,
        alt: "The Dynamic Island over the top of a Korean news article, growing from the compact island beside the clock into the expanded state: a Korean-to-US flag pair and a pin, Waiting for captions, then three lines of Korean from the article with their English translation under them in gray",
        caption: "Expanded state (long press for full translation)",
        captionCenter: true,
      },

      {
        type: "heading",
        text: "Translation Models",
        note: "",
      },

      {
        type: "text",
        text: "I used DeepL for sentence translations and Claude Opus 5 for word definitions. DeepL was excellent for full sentences, but unreliable for individual words. Opus 5 was more accurate for words because it could define each word as it's used in the context of the sentence."
      },

      {
        type: "text",
        text: "I benchmarked Opus 5 against DeepL on sentence translations. Opus 5 had a median latency of 2.07 seconds vs. 0.73 seconds for DeepL, and was about 5x more expensive ($0.0031 vs. $0.0006 per sentence)."
      },

      {
        type: "heading",
        text: "Translation Region",
        note: "Design Decisions",
      },

      {
        type: "text",
        text: "Translating the entire screen was impractical because of the limited space to display the text. To improve accuracy and prevent clutter, I added an interactive crop box for selecting a specific area of the screen to align the app with the user's intent."
      },

      {
        type: "region-demo",
        max: 400,
        radius: 34,
        shift: 6,
        alt: "The Translation region card: a crop icon and title with a Custom dropdown at the right, a note that only text inside the box is translated, a phone outline with a blue box dragged over the top of its screen and a resize handle at the corner, and Subtitle band and Full screen presets along the bottom",
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

       // had claude do a benchmark test with claude and deepl
      // using claude for sentence translations had higher latency and was more expensive than deepl
      // claude was about 3x slower
      // claude - median 2070 ms - 2.07 s per sentence
      // deepl - median 727 ms - 0.73 s
      // cost is $0.0006 per sentence DeepL and $0.0031 claude opus 5 for a sentence of ~25 Korean characters

      {
        type: "heading",
        text: "First UI Design",
        note: "UI Iteration",
      },

      {
        type: "text",
        text: "I tested the island and floating window in the first prototype to see which display felt better to use. Because I didn't need to see the translation of every sentence, I focused on the Dynamic Island and making it feel as seamless as possible."
      },

      {
        type: "images",
        max: 983,
        stackOnPhone: true,
        items: [
          {
            src: "/projects/screen-translator-2.png",
            alt: "The Dynamic Island expanded over a Korean news feed, holding the headline and its English translation",
          },
          {
            src: "/projects/screen-translator-floating-window.png",
            alt: "The floating window over the Naver News front page: a red recording dot in the Dynamic Island, the Politics tab's headline list, and a dark caption panel at the bottom holding the first headline in Korean, its English translation, and the start of the next one",
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
        max: 983,
        stackOnPhone: true,
        items: [
          {
            src: "/projects/screen-translator-captions-idle.png",
            alt: "The Translate tab before a session: a card with a gray circle and the words Tap the circle to start screen recording, then rows for Select display set to Island, Translation region set to Custom, API Keys, and Debug log",
          },
          {
            src: "/projects/screen-translator-recording.png",
            alt: "The Translate tab while recording: the Dynamic Island holding a red recording dot, the card retitled Recording with a note that captions follow you between apps, a red-to-blue glow around it, and two Korean sentences from a court ruling with their English under each",
          },
          {
            src: "/projects/screen-translator-captions-sheet.png",
            alt: "The Live captions sheet: a count of thirteen and a Done button, then each caption as a card with its Korean line, its English under it, and a pin at the corner, the first one pinned in blue and the rest hollow",
          },
        ],
      },

      {
        type: "heading",
        text: "Results",
        note: "Reflection",
      },

      {
        type: "text",
        text: "The biggest lesson from this project was learning to design with system constraints. Every decision had to account for iOS limitations, which pushed me to find different solutions. It was difficult to make the user experience feel seamless when there was so much out of my control, like the Dynamic Island's current state and when Live Activities update."
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
    date: "May–Sep 2026",
    role: "Information Architecture",
    scope: "Web App",
    href: "https://buy-side-briefings.vercel.app/",
    blocks: [
      {
        type: "heading",
        text: "Problem",
        note: "Overview", // title text on the left side
      },

      {
        type: "text",
        text: "Understanding the stock market requires aggregating data from multiple sources: stock exchanges, financial news outlets, SEC filings, and social media. This is a fragmented workflow due to context switching and information overload, leading to uncertainty and missed opportunities."
      },
      // Stock prices change constantly, and it takes time and judgment to find the right information.

      {
        type: "heading",
        text: "Solution",
        note: "",
      },

      {
        type: "text",
        text: "My solution was an automated market reporting website that aggregates information and generates daily reports so retail investors can quickly understand current events and make faster decisions."
      },

      {
        type: "image",
        src: "/projects/buy-side-site-today-5.png",
        max: 1000,
        alt: "The Today page with the toggle on AM: a live ticker strip under the nav, then the morning report of Monday, September 14, filed at 8:21 AM ET, its headline on frontier AI labs calling for a slowdown and chip stocks dropping before the open, the paragraph that argues it, a link out to the full six-minute read, and the charts panel opening underneath",
      },

      {
        type: "heading",
        text: "Curating Market Context with AI",
        note: "Data Pipeline",
      },

      {
        type: "text",
        text: "I designed an automated research pipeline that runs parallel web queries across market data, sentiment indicators, economic calendars, and a fixed set of stocks. The core of the project is the [instructions file](https://github.com/jkleejr/buy-side-briefings/blob/deploy/prompts/markets-website.md), which controls how each report is researched and written and defines the JSON schema the website renders from.", //
      },

      {
        type: "text",
        text: "Because LLMs don't have long-term memory, the agent calibrates itself by reading reports from the last few days before writing. The historical data simulates continuity and allows the report to distinguish between ongoing and new market trends."
      },

      {
        type: "image",
        src: "/projects/buy-side-briefings-authoring-loop.svg",
        max: 760,
        alt: "Authoring loop. A cron trigger starts the agent, which researches the session on the web and then writes two files: a structured verdict JSON and a written report. The JSON is parsed and checked against the schema. If it fails, the agent rewrites it. If it passes, a script stamps the generated-at timestamp from the clock, and the files are committed and pushed.",
      },

      {
        type: "heading",
        text: "Designing a Pre-Market vs. After-Hours Workflow",
        note: "Temporal UX",
      },

      {
        type: "text",
        text: "An investor's mental state changes fundamentally depending on the time of day. The morning report is forward-looking and focuses on preparation before the market opens. The night report is analytical and reflects on the day's performance."
      },

      {
        type: "text",
        text: "I added an AM/PM toggle to visually accommodate different mental states. Switching to another report restructures the page with the right information."
      },

      {
        type: "heading",
        text: "Data Visualization",
        note: "Data Design",
      },

      {
        type: "text",
        text: "I used market data from Yahoo Finance (delayed quotes) and FRED to visualize price action.",
      },
      // delay only applies during the trading session, since outside market hours the last price is the close for most stocks. us stocks and etfs are delayed by ~15 minutes, crypto is closer to current
      // data for chart comes from Yahoo Finance API

      {
        type: "text",
        text: "The interactive chart allows a quick inspection of tickers with candlestick ranges and some technical tools like volume, RSI, EMA, support/resistance, and Fibonacci levels."
      },

      {
        type: "image",
        src: "/projects/buy-side-chart-2.png",
        max: 800,
        alt: "The charts panel: Nvidia selected, range and bar controls under it, and a daily candlestick chart zoomed to ninety bars with a hover card on the March 27 bar showing its open, high, low, and volume, over a footer crediting Yahoo Finance and noting quotes are delayed about fifteen minutes",
      },

      {
        type: "text",
        text: "Instead of using a calendar list, I designed a timeline for upcoming earnings calls up to 90 days out. Solid dots represent confirmed dates, and hollow dots represent unconfirmed ones.",
      },

      {
        type: "image",
        src: "/projects/buy-side-earnings-timeline.png",
        max: 800,
        alt: "The earnings timeline: nineteen tickers from MU down to WMT, each with a dot placed along a line running from today past sixty days out and a count of days until it reports, filled dots for confirmed dates and hollow ones for estimates",
      },

      {
        type: "heading",
        text: "Mobile UI Design",
        note: "",
      },
      {
        type: "text",
        text: "The mobile design keeps the same style as the desktop interface with a few small changes. The headline description is more concise, and all other pages live in a menu button."
      },

      {
        type: "images",
        columns: 2,
        max: 650,
        stackOnPhone: true,
        items: [
          {
            src: "/projects/buy-side-mobile-today.png",
            alt: "The Today page on a phone: the ticker strip under the nav, Friday, September 25 with an AM/PM toggle set to AM, the morning report's headline on Iran making its Hormuz offer public as oil, bond yields and rate-hike bets ease before the open, its opening paragraph, a link to the six-minute read, and the charts panel starting below",
          },
          {
            src: "/projects/buy-side-mobile-full-read.png",
            alt: "The full read on a phone: a back link to Today, the date and Morning label, the headline, the time the report was generated, then bulleted takeaways on Iran's foreign minister saying Hormuz will be open in seven days if Washington accepts conditions, October hike odds falling to 71%, oil slipping about 1% after Thursday's gain, and the thirty-year Treasury yield",
          },
          {
            src: "/projects/buy-side-mobile-full-read-body.png",
            alt: "Further down the full read on a phone: the Full Read label with a six-minute estimate, an italic methodology note, then the first section heading on Iran putting a seven-day Hormuz plan on the record as oil, yields and rate-hike odds ease, with its body paragraph and underlined sourced bullets below",
          },
          {
            src: "/projects/buy-side-mobile-what-changed.png",
            alt: "The What Changed Since Last Report section on a phone: a paragraph comparing last night's read with the overnight moves, then bulleted points with bold blue leads on the offer's terms being harder than reported, lower oil easing the rate path, the global bond relief, and a correction to Thursday's thirty-year close, with the Movers heading starting below",
          },
        ],
      },

      {
        type: "heading",
        text: "Results",
        note: "Reflection",
      },
      {
        type: "text",
        text: "This project has changed many times since the start. Initially I used AI to predict the market and send me buy/sell signals based on its research, but I realized that a strictly informational website would help me more. [Buy Side](https://buy-side-briefings.vercel.app/) used to display a lot more data when I was learning the market, but I cut it down to the most important resources."
      },

      {
        type: "text",
        text: "Since the website keeps a record of previous reports, it would be interesting to use that data to find sentiment trends. I plan to keep improving the reports and add features I find useful."
      },
    ],
  },
};

