export type EntryImage = {
  src?: string;
  alt: string;
  crop?: string; // CSS object-position, e.g. "top" or "50% 20%" (default center)
  // A screenshot with a title of its own gets its own page in the overlay —
  // the shot, its title, and its description — instead of opening the whole
  // case study for the project it belongs to.
  title?: string;
  description?: string;
};

export type Entry = {
  title: string;
  slug: string; // links this entry to its case study in case-studies.ts
  platform?: "mobile" | "web"; // design two only: labels the entry and sets
  // the aspect ratio its screenshots are shown at
  titleHref?: string; // makes the title a link, opened in a new tab
  srcHref?: string; // clicking a thumbnail opens this URL in a new tab
  // instead of the case study
  link?: { label: string; href: string };
  icon?: string;
  images?: EntryImage[];
};

// gallery of screenshots and each one has text

export const entries: Entry[] = [
  {
    title: "",
    slug: "loot-check",
    platform: "mobile",
    images: [
      {
        src: "/projects/loot-check-1.png",
        alt: "Loot Check home screen",
        crop: "50% 15%",
        title: "Loot Check",
        description: "TODO — what this screen shows and why it looks the way it does.",
      },
    ],
  },
  {
    title: "",
    slug: "paper-reader",
    platform: "mobile",
    images: [
      {
        src: "/projects/paper-reader-2.png",
        alt: "Reader view with the sentence being read aloud highlighted",
        crop: "50% 34%",
        title: "Paper Reader",
        description: "TODO — what this screen shows and why it looks the way it does.",
      },
    ],
  },
  {
    title: "",
    slug: "screen-translator",
    platform: "mobile",
    images: [
      {
        src: "/projects/screen-translator-2.png",
        alt: "A Korean headline translated to English in the Dynamic Island, over a live news feed",
        crop: "50% 2%",
        title: "Screen Translator",
        description: "TODO — what this screen shows and why it looks the way it does.",
      },
    ],
  },
  {
    title: "",
    slug: "sleeptalk",
    platform: "mobile",
    images: [
      {
        src: "/projects/sleeptalk-1.png",
        alt: "SleepTalk record screen waiting to start listening",
        crop: "50% 41%",
        title: "SleepTalk",
        description: "TODO — what this screen shows and why it looks the way it does.",
      },
    ],
  },
  {
    title: "",
    slug: "time-with-tree",
    platform: "web",
    srcHref: "https://timewithtree.co.kr/",
    images: [
      { src: "/projects/time-with-tree.png", alt: "Time with Tree homepage" },
    ],
  },
  {
    title: "",
    slug: "buy-side-briefings",
    platform: "web",
    srcHref: "https://buy-side-briefings.vercel.app/",
    images: [
      {
        src: "/projects/buy-side-briefings-1.png",
        alt: "Night briefing front page",
        crop: "24% 50%",
        title: "Buy Side Briefings",
      },
    ],

  },
];
