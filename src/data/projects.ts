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
  // A few seconds of film that plays under the pointer, on loop, in place of
  // the cover — for a project whose picture is a frame of something moving.
  // The still is what loads and what is drawn until then, so this costs
  // nothing to anyone who does not hover it, and nothing at all on a touch
  // screen, where there is no hovering to do.
  coverVideo?: string;
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
  // The cards behind the cover on the homepage, front to back. Every cover
  // is the top of a stack — drag it aside and the next card is under it. Left
  // unset, the stack is the study's own shots, in the order they appear in
  // it; set it to choose them, or to give a project whose study has no
  // pictures something to show.
  stack?: { src: string; alt: string; crop?: string }[];
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
    title: "Loot Check",
    blurb:
      "Photograph any item to find its name, value, and where to sell it",
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
      "Upload a PDF to hear it in a natural voice, citations filtered out",
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
    title: "Screen Translator",
    blurb:
      "Translate the text on screen without having to switch apps",
      //Live translation of whatever is on screen, running in the background from the Dynamic Island.
      // translate text on screen without having to switch apps.
      // Live translation of whatever is on screen without having to switch apps
    slug: "screen-translator",
    platform: "mobile",
    images: [
      {
        src: "/projects/screen-translator-2.png",
        cover: "/projects/screen-translator-logo-4-base.png",
        coverDot: {
          x: 56.93,
          y: 56.45,
          size: 26.66,
          color: "#ff3b30",
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
    title: "Buy Side Briefings",
    blurb:
      "Automated daily stock market reports",
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
  {
    title: "Time with Tree",
    blurb:
      "Website for a birch tree farm in South Korea",
    slug: "time-with-tree",
    titleHref: "https://timewithtree.co.kr/",
    platform: "web",
    images: [
      {
        cover: "/projects/time-with-tree-water.png",
        coverVideo: "/projects/time-with-tree-water.mp4",
        alt: "Rain on a branch: pale green leaves along a stem, each rimmed with water, against a dark window and a lit wall behind",
        // spacing from the last project to the bottom of the page is 112 px on desktop, 32 px on phone
  },
    ],
  },
];
