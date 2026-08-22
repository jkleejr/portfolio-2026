export type EntryImage = {
  src?: string;
  alt: string;
  crop?: string; // CSS object-position, e.g. "top" or "50% 20%" (default center)
  // Shown on the homepage in place of `src` — for a project whose thumbnail
  // reads better as a logo than as one of its screens. The page the thumbnail
  // opens still shows `src`, and a cover is used as-is, without `crop`.
  cover?: string;
  // A dot painted over the cover that drifts toward the pointer. The cover
  // image has to have it erased — see screen-translator-logo-4-base.png. All
  // lengths are percentages of the thumbnail, so they hold at any size.
  coverDot?: {
    x: number; // centre, % from the left
    y: number; // centre, % from the top
    size: number; // diameter, % of the thumbnail's width
    color: string;
    // How far it drifts, as a share of the thumbnail's width. For a dot inside
    // a ring, the largest value that keeps it enclosed is the ring's inner
    // radius minus the dot's radius.
    travel: number;
  };
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
        cover: "/projects/loot-check-logo-5.png",
        alt: "Loot Check home screen",
        crop: "50% 15%",
        title: "Loot Check",
        description: "",
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
        cover: "/projects/paper-reader-logo-4.png",
        alt: "Reader view with the sentence being read aloud highlighted",
        crop: "50% 34%",
        title: "Paper Reader",
        description: "",
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
        cover: "/projects/screen-translator-logo-4-base.png",
        // Measured off the artwork the dot was erased from.
        coverDot: {
          x: 56.93,
          y: 56.45,
          size: 26.66,
          color: "#ff3b30",
          // 263px inner radius - 136.5px dot radius = 126.5px, which is 12.35%
          // of the 1024px artwork and has the dot flush against the ring. A
          // hair under that, so it stops just before contact.
          travel: 12.1,
        },
        alt: "A Korean headline translated to English in the Dynamic Island, over a live news feed",
        crop: "50% 2%",
        title: "Screen Translator",
        description: "",
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
        cover: "/projects/sleeptalk-logo-2.png",
        alt: "SleepTalk record screen waiting to start listening",
        crop: "50% 41%",
        title: "SleepTalk",
        description: "",
      },
    ],
  },
  {
    title: "",
    slug: "time-with-tree",
    platform: "web",
    srcHref: "https://timewithtree.co.kr/",
    images: [
      {
        src: "/projects/time-with-tree.png",
        cover: "/projects/time-with-tree-logo-3.png",
        alt: "Time with Tree homepage",
      },
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
        cover: "/projects/buy-side-briefings-logo-2.png",
        alt: "Night briefing front page",
        crop: "24% 50%",
        title: "Buy Side Briefings",
      },
    ],

  },
];
