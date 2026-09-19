export type EntryImage = {
  src?: string;
  alt: string;
  crop?: string; // CSS object-position, e.g. "top" or "50% 20%" (default center)
  // Shown on the homepage in place of `src` — for a project whose thumbnail
  // reads better as a logo than as one of its screens. A cover ignores `crop`,
  // which frames that shot rather than this one, and it is the ONLY thing the
  // homepage draws: an entry that has a cover never shows its `src` anywhere,
  // since a study's page is built from its own blocks in case-studies.ts. Give
  // an entry one or the other, not both, or the shot is dead weight in public/.
  cover?: string;
  // How the cover sits in the square, for one that is not square itself and
  // loses something to the middle crop. CSS object-position, "left" or
  // "50% 20%". Centred when unset.
  coverCrop?: string;
  // Enlarge the cover in its square, about the middle of the square — for one
  // whose edges hold something the thumbnail should not show. 1 is the cover
  // as it is; 1.1 crops about a twentieth off every side. Applied over
  // `coverCrop`, so the framing it sets is what gets enlarged.
  coverZoom?: number;
  // A few seconds of film that plays under the pointer, on loop, in place of
  // the cover — for a project whose picture is a frame of something moving.
  // The still is what loads and what is drawn until then, so this costs
  // nothing to anyone who does not hover it, and nothing at all on a touch
  // screen, where there is no hovering to do.
  coverVideo?: string;
  // A dot painted over the cover that drifts toward the pointer. The cover
  // image has to have it erased. All lengths are percentages of the
  // thumbnail, so they hold at any size.
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
  title: string; // shown beside the cover on the homepage
  // The one line under that title. Brief on purpose: it is what someone reads
  // while deciding whether to open the study, not a summary of it.
  blurb?: string;
  // When it was made, under the blurb. The word "Date" is set by the page, so
  // this is only what follows it — a year, or as much of one as is worth
  // saying.
  date?: string;
  // What it was built with, under the date, and set the same way.
  tools?: string;
  slug: string; // links this entry to its case study in case-studies.ts
  // On the App Store: the mark goes after the title, here and on the study.
  // The value is the listing it opens; an empty string shows the mark without
  // a link, for a project that has shipped but whose URL is not written down
  // yet. Leave the field out entirely for anything not on the store.
  appStore?: string;
  platform?: "mobile" | "web"; // design two only: labels the entry and sets
  // the aspect ratio its screenshots are shown at
  // The project's own site. A chain mark after the title on the homepage opens
  // it, in a tab of its own.
  titleHref?: string;
  srcHref?: string; // clicking a thumbnail opens this URL in a new tab
  // instead of the case study
  link?: { label: string; href: string };
  icon?: string;
  images?: EntryImage[];
};



export const entries: Entry[] = [
  {
    title: "Screen Translator",
    blurb:
      "Translate the text on screen without having to switch apps by using the Dynamic Island",
      //Live translation of whatever is on screen, running in the background from the Dynamic Island.
      // translate text on screen without having to switch apps.
      // Live translation of whatever is on screen without having to switch apps
    slug: "screen-translator",
    platform: "mobile",
    images: [
      {
        src: "/projects/screen-translator-2.png",
        cover: "/projects/screen-translator-watching.png",
        // A tall phone screen in a square: held just under the Dynamic Island
        // so the title, the glowing recording card and the first two settings
        // rows fill it, and the empty space under them stays out. Enlarged a
        // touch so the card takes more of the square; the title and the
        // Translation region row still clear the top and bottom edges.
        coverCrop: "50% 11%",
        coverZoom: 1.06,
        alt: "Screen Translator just after recording starts: the recording card with a red to blue glow around it, watching for Korean text, over the display and translation region rows",
        crop: "50% 2%",
        title: "Screen Translator",
        description: "",
      },
    ],
  },
  {
    title: "Loot Check",
    blurb:
      "Photograph any item to find its name, potential value, and where to sell it",
    slug: "loot-check",
    appStore: "https://apps.apple.com/us/app/loot-check/id6785767104",
    platform: "mobile",
    images: [
      {
        src: "/projects/loot-check-1.png",
        alt: "Loot Check home screen",
        crop: "50% 15%",
        title: "Loot Check",
        description: "",
      },
    ],
  },
  {
    title: "Paper Reader",
    blurb:
      "Upload a PDF and hear it in a natural voice with citations filtered out",
    slug: "paper-reader",
    platform: "mobile",
    images: [
      {
        cover: "/projects/paper-reader-cover-highlight.png",
        coverCrop: "left",
        alt: "Reader view with the sentence being read aloud highlighted",
        title: "Paper Reader",
        description: "",
      },
    ],
  },
  {
    title: "Buy Side Briefings",
    blurb:
      "Automated, daily stock market research and reports",
    slug: "buy-side-briefings",
    titleHref: "https://buy-side-briefings.vercel.app/",
    platform: "web",
    images: [
      {
        cover: "/projects/buy-side-briefings-swing.png",
        alt: "A candlestick chart on a dark ground: green candles climbing to a peak, then red ones falling away from it",
      },
    ],
  },
];
