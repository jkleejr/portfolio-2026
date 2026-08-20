// ---------------------------------------------------------------------------
// Each entry becomes one item in the "What I'm currently working on" list.
// Add, remove, and reorder freely. Layout handles the rest.
//
// icon:   a small square logo shown in the left gutter (~56px). Drop it into
//         /public/projects/ and reference like "/projects/my-app-icon.png".
// images: a row of square thumbnails under the description. Entries without
//         a `src` render as an empty bordered square placeholder.
// link:   rendered inline at the end of the description, e.g. "Open App".
// ---------------------------------------------------------------------------

export type EntryImage = {
  src?: string;
  alt: string;
  href?: string; // overrides the entry-level link for this thumbnail
  crop?: string; // CSS object-position, e.g. "top" or "50% 20%" (default center)
};

export type Entry = {
  title: string;
  titleHref?: string; // makes the title a link, opened in a new tab
  description: string;
  link?: { label: string; href: string };
  icon?: string;
  images?: EntryImage[];
};

export const entries: Entry[] = [
  {
    title: "Loot Check (mobile app)",
    description:
      "Take a picture of any item to identify it and find its resale value from similar items sold online.",
    images: [
      { src: "/projects/loot-check-1.png", alt: "Loot Check home screen", crop: "top" },
      { src: "/projects/loot-check-2.png", alt: "Item photo capture" },
      { src: "/projects/loot-check-3.png", alt: "Resale value estimate", crop: "50% 58%" },
    ],
  },
  {
    title: "Paper Reader (mobile app)",
    description:
    "Upload a PDF and the app will clean up the text by removing unnecessary formatting and citations, and read it aloud in a natural voice.",
    images: [
      { src: "/projects/paper-reader-1.png", alt: "Paper library with playback progress", crop: "top" },
      { src: "/projects/paper-reader-2.png", alt: "Reader view with the sentence being read aloud highlighted", crop: "50% 34%" },
    ],
  },
  {
    title: "Screen Translator (mobile app)",
    description:
    "Translate Korean text to English in real time without having to switch apps. In the background, the app identifies and translates the text in a specified section of the screen. The translation is displayed on the dynamic island interface on iPhone.",
    images: [{ alt: "Screenshot" }],
  },
  {
    title: "SleepTalk (mobile app)",
    description: "Record at night and learn about your sleep talking patterns over time.",
    images: [{ alt: "Screenshot" }],
  },
  {
    title: "Time with Tree",
    titleHref: "https://timewithtree.co.kr/",
    description: "A website for a tree farm in Sejong, South Korea. Customers can learn about the tree farm, look through the catalog, and place an order. Business owners can manage their inventory, customer orders, and email communications through a dashboard only accesible to them.",
    images: [
      { src: "/projects/time-with-tree.png", alt: "Time with Tree homepage" },
      { src: "/projects/time-with-tree-2.jpg", alt: "Tree catalog and shop page" },
    ],
  },
  {
    title: "Buy Side Briefings",
    titleHref: "https://buy-side-briefings.vercel.app/",

    description:
      "A personal investing website with daily stock market reports in the morning and night. The briefings report on major catalysts impacting the market and the stocks I'm currently watching.",
    images: [
      { src: "/projects/buy-side-briefings-1.png", alt: "Morning briefing front page" },
      { src: "/projects/buy-side-briefings-2.png", alt: "S&P 500 candlestick chart" },
      { src: "/projects/buy-side-briefings-3.png", alt: "Full briefing read view" },
    ],

  },
  {
    title: "AI Capital Flow",
    titleHref: "https://ai-capital-flow.vercel.app/",

    description:
      "A visualization of where capital is moving between AI companies. Companies are represented as nodes on an interactive graph and are connected to show the investments between them. Users can navigate the nodes to see more information.",
    images: [
      { src: "/projects/ai-capital-flow-1.png", alt: "AI capital flow graph" },
      { src: "/projects/ai-capital-flow-2.png", alt: "Company node detail view" },
    ],

  },
];
