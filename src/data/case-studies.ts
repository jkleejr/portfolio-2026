export type CaseStudyBlock =
  | { type: "heading"; text: string }
  | { type: "text"; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "image"; src: string; alt: string; caption?: string; crop?: string }
  | {
      type: "images";
      items: { src: string; alt: string; crop?: string }[];
      caption?: string;
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
        caption: "Finding the potential value of my shark painting",
      },
      {
        type: "text",
        text: "Existing apps looked poorly designed and required a subscription to use. My solution was a fast, accurate, and free identifying app.",
      },
      {
        type: "text",
        text: "I used Claude Sonnet 4.6 to identify the item, find the price, and write the listing due to its high accuracy and low API costs at ~$0.013 per scan. I considered Kimi K3, but the costs were similar and I wanted the results to be as trustworthy as possible.",
      },
      {
        type: "text",
        text: "Vision models aren't 100% accurate so I designed for uncertainty. Users can type in what you know to steer Claude toward the right product and low confidence results are labeled 'best guess'.",
      },
      {
        type: "text",
        text: "The 'where to sell' table predicts how much could be made after marketplace fees to help users decide where to list. I wanted to automate the listing process, but most marketplaces don't offer a public listing API, so the app writes a title and description for copy and paste.",
      },
      {
        type: "text",
        text: "backend, using a server to safely store my API key, 1 call is made per scan.",
      },
      // 2 key decisions....
      // claude sonnet 4.6 because its cheap enough to run per scan and still accurate.
      // costs me about $0.013 per scan.
      // thought about the users and making a subscription too but decided i would make it free to use since the cost is low

      // SERVER SIDE UPDATES ARE LIVE IMMEDIATELY
      // the backend is the code that does the actual work. when I tap identify, my phone sends. the photo to resell-it-backend.vercel.app/api/analyze, that computer talks to Claude, and it sends back the finisehd JSON - title, price, marketplace, description.
      // why does the backend exist?
      // because of my API Key.
      // talking to claude costs money and requires a secret key. if that key were inside the app, anyone could pull it out of the downloaded app file - and spend my money
      // so the key lives in exactly one place: on the server. the app has no idea it exists. the app can only call your endpoints, and your server decides whether to spend money on that request. that's also where the 60 scans per day limit is enforced.
      // Vercel is the compnay that runs that computer for you.
      // "deploying" for this project just means: uploading your current code files to Vercel, replacing what was there before.
      // the instructions that produce the description are a file on the server - lib/analyze.ts, containing the prompt that tells Claude "write 1-3 factual sentences..."
      // that file is not in the app and never has been in the app.
      // running "vercel --prod" replaces the old file with the new one on their machines. the very next scan anyone does goes through the new instructions

      // How is Loot Check valuing items?
      // right now the model estimates it, there is no lookup.
      // the price comes from the same API call that identifies the item. Claude looks at the photo and returns a dollar range as one field in the JSON, alongside the title and category. nothing queries eBay, or any pricing database, at any point.
      // one field in the schema: estimatedValueUSD: {low: 5, high: 9}
      // one rule in the prompt that governs it: the RESALE value - what this item would realistically sell for SECONDHAND today - is not the original retail/store price, a used item is normally well below retail. Base it on the item type, brand, and apparent condition.
      // without this rule a vision model quotes roughly what the thing costs new, which is useless to a seller. There's a second rule too: if the photo is blurry or ambiguous, give a wide range - so uncertainty shows up as a wider spread rather than a confidently wrong number.
      // what happens to the number after that: everything downstream is arithmetic, no AI
      // 1. the server clamps it - negatives become zero, and if high somehow came back below low, they're equalised. whole dollars only.
      // 2. your phone computes the midpoint (toPrice() in mobile/pricing.ts):
      // median = round ((low + high) / 2)
      // thats the big $110 style number on the price card. the low - high range is the smaller line under it.
      // 3. the midpoint anchors the marketplace table. each platform's payout is the median minus that platform's published fees:
      // net = anchor x (1 - feePct) - flatFee
      // the fee percentages are hardcoded constraints in the app, they're fixed 
      
      // ULTIMATELY, the number/estimated resale value is a well informed guess from a model that has seen an enormous amount of resale listings, constrained by a prompt that pushes it toward secondhand pricing and told to widen the range when unsure. It is not derived from what anything actually sold for.
      // thats why the app says "estimated resale value" and nothing more

      // One API call is being made per scan, not per photo. if i add 4 photos of the same item, they all go into a single request as 4 images attached to 1 message. 1 call.
      // 1 call returns all 12 fields:
        // identification - title, category, brand, condition, specificity
        // price - estimatedValueUSD {low, high}
        // Routing - recommendedPlatform, recommendationReason, expectedSpeed
        // Copy - listingDescription, keywords, searchQuery
      // identify, price, title, description, and which marketplace to sell on and why - all one round trip to Claude
      // more photos costs more, but not more calls. each image is roughly 1,900 tokens, so a 4 photo scan is pricier than a 1 photo scan. but its 1 request either way. the photos are capped at 4


      // right now, the flow is : photo -> Claude -> done. one call, one round trip.

      // if i wanted to get sales data online to make the price estimation more accurate....

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
            src: "/projects/loot-check-logo-sneaker.png",
            alt: "A shoe icon in a blue tag",
          },
          {
            src: "/projects/loot-check-logo-scan-white-on-blue.png",
            alt: "The same tag and brackets reversed, white on a solid blue tile",
          },
          {
            src: "/projects/loot-check-logo-scan-blue-on-white.png",
            alt: "A price tag with its hole punched out, set inside camera scan brackets, blue on white",
          },
        ],
      },
      {
        type: "text",
        text: "Loot Check is on the app store. The next step for this project is marketing and finding users. Depending on the cost, I would use a cheaper AI model or consider subscriptions for the most active users.",
      },

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
        caption: "Adding a new paper from files",
        captionLeft: [
          "Text cleanup and audio generation for a 12 page paper took ~40 seconds",
          "Audio is generated as the user needs it, reducing costs and initial wait time",
        ],
      },
      
      {
        type: "text",
        text: "I designed the app around users paying for their own API usage due to the costs of audio generation at ~$1-3 per paper. To keep it simple for users, one API key had to identify text and generate audio. Gemini 3.1 flash was the best option for both of these tasks since it could clean up the text and had TTS with 8 voices.",
      },
      {
        type: "text",
        text: "How it works:",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "PDFKit pulls text from the PDF and fixes spacing.",
          "Text is split into sections, each getting its own Gemini call to filter out citations, captions, etc. while prose is unchanged.",
          "NLTokenizer splits the script into sentences, which are grouped as ~750 character chunks, ~45 seconds of speech.",
          "Each group is sent to Gemini TTS, comes back as raw audio data, is wrapped in a WAV, and cached.",
          "Highlighted sentences are estimated from audio length and character count, and resets at the end of every group to reduce mistiming."
        ],
        // extract
        // identify
        // clean
        // segment
        // narrate
        // display
      },
      {
        type: "text",
        text: "Because Gemini only returns audio, the app has to estimate when each sentence is being spoken. Audio clips arrive as 24,000 samples per second, so the total seconds in a group can be calculated (total samples / 24,000 = total seconds). At this point the app knows the total seconds, the number of sentences, but not how long each sentence could take. It splits the group proportionally by text, so a sentence with 5% of the group's characters is assumed to take 5% of the audio. (characters in each sentence / group total characters = % of group text) then (% of group text x total seconds = how long each sentence could take). As the audio plays, the app tracks the time and highlights a sentence based on the estimated duration. However, it's not always accurate.",
      },

      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-library-error.png",
            alt: "My Papers with a paper that failed to process, its error in red beside a retry button, while the other papers keep their progress",
          },
          {
            src: "/projects/paper-reader-error-state.png",
            alt: "The same failure opened up, with the Gemini error it came back with, a line pointing to the API key in Settings, and a Try Again button",
          },
        ],
      },
      {
        type: "text",
        text: "When processing fails, the paper enters an error state and shows the exact error.",
      },
      {
        type: "text",
        text: "A sample paper with narration is included into the app so users can test before setting up an API key.",
      },

      
      // (total samples / 24,000 = total seconds)
      // (characters in each sentence / group total characters = % of group text)
      // (% of group text x total seconds = how long each sentence could take)
      // as the audio for that group plays, the app tracks how many seconds have passed to estimate the current sentence. but its not always accurate because some sentences take longer than others due to punctuation

      // splits proportionally by text, so a sentence with 30% of the group's characters is assumed to take 30% of the audio.
      // as playback runs, the app tracks elapsed time against these estimates to decide which sentence to highlight.


      // 24000 samples per second is the same as 24000 numbers for every second of sound
        // knows the number of sentences from splitting the script into sentences using Apple NLTokenizer, producing a numbered list of sentences through the whole paper

        //Gemini sends back the audio and nothing else — no note saying when each sentence is spoken
        // The audio is a list of numbers, 24,000 for every second of sound, count them and you have the clip's exact length.
        // the app also knows which sentences went into that clip, it just doesnt know where each one falls inside it. so it splits the time by text; a sentence with a third of the characters gets a third of the seconds.
        // as the clip plays, the app keeps track of how many seconds have gone by and looks up which sentence that lands in. that's the one it highlights.
        // the split is only an estimate, so the highlight can drift slightly, but the moment a clip ends is exact and it re-syncs there


      // display - longer sentences get a longer share of each group's audio. the highlight follows that estimate, and resets to exact at the end of every group.
      // gemini returns no timings so the app estimates them. each sentence takes a share of the group's audio in proportion to its length. that drifts slightly, but a group's end is an exact moment, so the highlight is corrected every 45 seconds and the error never builds up
      // a "timing" would be the API telling you when something is spoken, a list like: "Hello there.." starts at 3.87s
      // Gemini's TTS response comes back as the audio, as base64 sound data, and an audio format label
      // so the app has to derive everything itself: the total length by counting samples, and the position of each sentence inside that length by the character count estimate. thats why the highlight works the way it does, its sentence level rather than word level
      // group is 5-8 sentences that were sent to gemini and came back as one clip, about 45 seconds long.
      // the app knows that clip's length precisely, not from a stopwatch but by counting: the clip is a list of sound samples, 24,000 of them per second, so a million samples means 41.7 seconds.
      // what the app doesn't know is where each sentence sits inside those 45 seconds. Gemini doesn't say.
      // so it divides the clip by text length
      // the sentence "The paper is TradingAgents..." has 192 characters, 31% share of the clip, and took 14.29 seconds. 192 characters out of 623 is 31% of the text, so its assumed to take 31% of the time. the shares always sum to the clip's real length. 
      // the highlight follows that estimate. 4 times a second, the app adds the elapsed time to a running total, multiplied by your playback speed, so at 1.5x the total climbs 1.5 seconds per real second. then it walks down the list: past 3.87, past 14.29, and so on, until it finds which sentence that total lands in. That's the one that gets highlighted.
      // so nothing is listening to the audio. It's arithmetic on a clock and a list of numbers. 
      // the estimate drifts because people don't read at an even pace, a sentence full of commas takes longer. halfway through a group, the highlight might be half a second ahead of the voice. 
      // then the clip ends, that moment is not estimated. the audio system finishes playing the last sample and tells the app so. the app then highlights the first sentence of the next group as the next sample/group starts to play.
      // a 40 minute paper is roughly 50 groups. without the reset, every small error would stack onto the last, and by the end of the highlight could end up being minutes from the voice. 
      // with this, each estimate only has to survive about 45 seconds before it starts at the beginning of the next group. 
      // 

      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-api-key.png",
            alt: "The Gemini API key screen: why the app asks for a key, a link to get one, what a paper costs to narrate, where the key is kept, what leaves the device, and the field to paste it in",
          },
          {
            src: "/projects/paper-reader-settings.png",
            alt: "Settings: the Gemini API key, the text and voice models, and the narration voice",
          },
        ],
      },

      // the user's Gemini API key is safely stored in the iOS keychain. it can't be read by other apps, is encryptoed by the rest of the OS tied to the device's hardware.
      // where it goes:
      // generativelanguage.googleapis.com over HTTPS, in a request header (x-goog-api-key), not in the URL, which matters because URLs get logged by proxies and headers generally don't. There's one URLSession in the entire app and one destination host.
      // the key is never printed to a log, never written into a paper's JSON, never attached to an error message, and never sent anywhere else.
      // So who has access?
      // only the user and Google. thats it. Theres no paper reader server, so theres nothing for anyone to have access to - the requests go from the user's phone straight to Google, billed to their account. Its the user's key, on their device, talking to Google.
      // users can wipe it any time with Remove API Key in Settings, which deletes it from the Keychain outright 

      // but what happens if the user deletes the app without removing their key?
      // iOS does not erase Keychain items when you delete an app. your papers, audio, and settings all go - those live in the app's container - but the keychain entry typically survives, orphaned. so reinstalling paper reader would find the key already there
      // however, no other app can read it so access to the key is scoped to the app's identity, so an orphaned item isn't exposed to anything else on the phone.
      // the best action is to revoke the key at aistudio.google.com/apikey if the user is worried about an orphaned key



      {
        type: "text",
        text: "The user's API key is safely secured in the iOS Keychain, unaccessible to other apps.",
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

      // while the user is listening to one chunk, the next one finishes. users can pay as they listen

      // Gemini TTS sends back an audio file for each group of sentences, but the question is how to know which sentence is currently being said to highlight it on the user's screen
      // the trick: guess by length. if one sentence has 50 letters and the next has 150, the second one probably takes about 3 times as long to say.
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
      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-library.png",
            alt: "My Papers: the papers added so far, each with how much of it has been listened to, and a player docked at the bottom",
          },
          {
            src: "/projects/paper-reader-follow-along.png",
            alt: "A paper being read aloud with the current sentence highlighted, how much has been listened to, and playback controls",
          },
        ],
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/paper-reader-logo-4.png",
            alt: "Lines of a page on cream, with the line being read aloud marked in yellow highlighter and a play triangle at its end",
          },
          {
            src: "/projects/paper-reader-logo-blue-soft.png",
            alt: "The same icon with the unread lines dropped to gray, so the highlighted one carries the only black text",
          },
        ],
      },
      {
        type: "text",
        text: "If I continued Paper Reader, I would integrate an API key into the app, minimize costs, and charge per paper. Since there are many TTS products like Speechify and Blinkist that address similar problems, I shipped this project and moved on.",
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
        text: "My first idea was to generate text over the current display, but iOS does not allow an app to draw over another app. To get around this, I used a ReplayKit broadcast extension to receive pixels of what's on screen, and showed the translation using the dynamic island and floating window."
      },
      {
        type: "text",
        text: "AI:"
      },
      // first, focusing this app on live captions translations, and trying to make that process as seamless as i can.
      // audio later
      {
        type: "list",
        ordered: true,
        items: [
          "Apple Vision reads the screen",
          "Apple Speech transcribes audio",
          "DeepL for translating text",
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
        type: "images",
        items: [
          {
            src: "/projects/time-with-tree-logo-v1.png",
            alt: "A birch tree drawn in outline, its branches carrying leaves in two greens",
          },
          {
            src: "/projects/time-with-tree-logo-v4.png",
            alt: "The mark on its own, three leaves over two bands of field",
          },
          {
            src: "/projects/time-with-tree-logo-v3.png",
            alt: "A later lockup: leaves rising out of a field, beside the same name set in a heavier face",
          },
        ],
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
        text: "Buy Side Briefings is a personal website with daily reports on the stock market. The goal is to create a trustworthy source of information that informs readers on the latest events.",
      },
      { type: "heading", text: "Old design" },
      {
        type: "text",
        text: "",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-evening-brief.png",
        alt: "The evening brief: a market sentiment scale over the night's headline and the paragraph that argues it, key points underneath, and a rail of index levels and market hours down the left",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-terminal.png",
        alt: "The terminal dashboard: a live quote strip over index tiles, a row of running stats, and today's playbook of long and short calls with their stops and targets beside an open risk panel",
      },
      // One to a row rather than a grid: these are pages seen on a desktop,
      // and three across the column would leave them too small to read.

      // current design
      { type: "heading", text: "Current design" },

      {
        type: "text",
        text: "",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-today.png",
        alt: "The Today page: a live ticker strip under the nav, the night briefing's headline and the paragraph that argues it, and the chart panel opening underneath",
      },
      {
        type: "image",
        src: "/projects/buy-side-site-briefing.png",
        alt: "A single briefing: the night's headline over three key points, each one repeated underneath with the source it came from and a link out to it",
      },

      // mobile design
      { type: "heading", text: "Mobile design" },
      {
        type: "images",
        items: [
          {
            src: "/projects/buy-side-mobile-today.png",
            alt: "The Today page on a phone: the ticker strip under the nav, an AM and PM switch beside the night briefing, its headline and the paragraph that argues it, and the chart panel opening underneath",
          },
          {
            src: "/projects/buy-side-mobile-briefing.png",
            alt: "A briefing opened on a phone: the night's headline over three key points, each repeated underneath with the outlet it came from, and the rest folded away behind a line of sourced points",
          },
        ],
      },
      {
        type: "images",
        items: [
          {
            src: "/projects/buy-side-mobile-methodology.png",
            alt: "The full read on a phone, opening on the methodology note that lists every source behind the night's numbers",
          },
          {
            src: "/projects/buy-side-mobile-full-read.png",
            alt: "Further down the full read: what happened today, holding the morning brief's calls against how the session actually closed",
          },
        ],
      },
    ],
  },
};
