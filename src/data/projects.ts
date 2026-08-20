export type EntryImage = {
  src?: string;
  alt: string;
  crop?: string; // CSS object-position, e.g. "top" or "50% 20%" (default center)
};

export type Entry = {
  title: string;
  slug: string; // links this entry to its case study in case-studies.ts
  titleHref?: string; // makes the title a link, opened in a new tab
  description: string;
  link?: { label: string; href: string };
  icon?: string;
  images?: EntryImage[];
};

export const entries: Entry[] = [
  {
    title: "Loot Check (mobile)",
    slug: "loot-check",
    description:
      "Take a picture of any item to identify it and find its resale value from similar items sold online.",
    images: [
      { src: "/projects/loot-check-1.png", alt: "Loot Check home screen", crop: "50% 15%" },
      { src: "/projects/loot-check-2.png", alt: "Item photo capture" },
      { src: "/projects/loot-check-3.png", alt: "Resale value estimate", crop: "50% 58%" },
    ],
  },
  {
    title: "Paper Reader (mobile)",
    slug: "paper-reader",
    description:
    "Upload a PDF to hear the text in a natural voice without unnecessary formatting and citations.",
    images: [
      { src: "/projects/paper-reader-1.png", alt: "Paper library with playback progress", crop: "50% 12%" },
      { src: "/projects/paper-reader-2.png", alt: "Reader view with the sentence being read aloud highlighted", crop: "50% 34%" },
    ],
  },
  {
    title: "Screen Translator (mobile)",
    slug: "screen-translator",
    description:
    "Translate Korean to English text live on your screen. The app runs in the background and identifies text in a specific section of the screen, displaying the translation using the dynamic island on iPhone.",
    images: [
      {
        src: "/projects/screen-translator-1.png",
        alt: "Screen Translator recording, with live Korean-to-English captions",
        crop: "50% 22%",
      },
      {
        src: "/projects/screen-translator-2.png",
        alt: "A Korean headline translated to English in the Dynamic Island, over a live news feed",
        crop: "50% 2%",
      },
    ],
  },
  {
    title: "SleepTalk (mobile)",
    slug: "sleeptalk",
    description: "Record your audio overnight and learn about your sleep talking patterns over time.",
    images: [
      {
        src: "/projects/sleeptalk-1.png",
        alt: "SleepTalk record screen waiting to start listening",
        crop: "50% 41%",
      },
    ],
  },
  {
    title: "Time with Tree",
    slug: "time-with-tree",
    titleHref: "https://timewithtree.co.kr/",
    description: "A website for a tree farm in Sejong, South Korea. Customers can learn about the tree farm, look through the catalog, and place an order. Business owners can manage their inventory, customer orders, and email communications.",
    images: [
      { src: "/projects/time-with-tree.png", alt: "Time with Tree homepage" },
      { src: "/projects/time-with-tree-2.jpg", alt: "Tree catalog and shop page" },
    ],
  },
  {
    title: "Buy Side Briefings",
    slug: "buy-side-briefings",
    titleHref: "https://buy-side-briefings.vercel.app/",

    description:
      "A personal investing website with daily stock market updates. The daily briefings report on the catalysts impacting the market and the stocks I'm watching.",
    images: [
      { src: "/projects/buy-side-briefings-1.png", alt: "Night briefing front page", crop: "24% 50%" },
      { src: "/projects/buy-side-briefings-2.png", alt: "S&P 500 candlestick chart" },
      { src: "/projects/buy-side-briefings-3.png", alt: "Full briefing read view" },
    ],

  },
];
