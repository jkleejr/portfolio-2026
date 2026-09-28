// This describes one picture for a project. Each line below is a setting the
// picture can have; a "?" after the name means that setting is optional.
export type EntryImage = {
  // The picture file to show.
  src?: string;
  // A written description of the picture, read aloud to people who can't see it.
  alt: string;
  // Which part of the picture stays visible when it gets cropped, like "top"
  // or "50% 20%". If you leave it out, the middle is kept.
  crop?: string;
  // A different picture to show on the homepage instead of `src`, like a logo.
  // Use either `cover` or `src` for a project, not both.
  cover?: string;
  // Which part of the cover stays visible when it's cropped to a square, like
  // "left" or "50% 20%". If you leave it out, the middle is kept.
  coverCrop?: string;
  // Zooms in on the cover. 1 means no zoom, and 1.1 zooms in a little so the
  // edges get cut off.
  coverZoom?: number;
  // A short video that plays in place of the cover while the mouse is over it.
  // On phones there's no mouse, so the still cover stays.
  coverVideo?: string;
  // A dot drawn on top of the cover that moves a little toward the mouse.
  // All the numbers are percentages of the picture, so it works at any size.
  coverDot?: {
    x: number; // how far from the left edge the dot's center is
    y: number; // how far from the top edge the dot's center is
    size: number; // how wide the dot is
    color: string; // the dot's color
    // How far the dot is allowed to move toward the mouse.
    travel: number;
  };
  // If a picture has its own title, clicking it opens just that picture with
  // its title and description, instead of the whole case study.
  title?: string;
  description?: string;
};

// This describes one project on the homepage: its name, its text and its
// pictures.
export type Entry = {
  title: string; // the project's name, shown next to its picture
  // One short line under the name that tells people what the project is.
  blurb?: string;
  // When the project was made, like "2026". The page adds the word "Date".
  date?: string;
  // What the project was made with. The page shows it under the date.
  tools?: string;
  slug: string; // a short ID that connects this project to its case study page
  // A link to the app's App Store page. It adds an App Store icon next to the
  // name. Leave it empty ("") to show the icon without a link.
  appStore?: string;
  platform?: "mobile" | "web"; // whether it's a phone app or a website. Not
  // used anywhere on the site right now
  // A link to the project's own website. It adds a link icon next to the
  // name, and the site opens in a new tab.
  titleHref?: string;
  srcHref?: string; // a website that opens in a new tab when you click the
  // picture, instead of opening the case study
  link?: { label: string; href: string }; // not used on the site right now
  icon?: string; // not used on the site right now
  images?: EntryImage[]; // the project's pictures (the "[]" means a list)
};



// This is the actual list of projects, in the order they show on the homepage.
export const entries: Entry[] = [
  {
    title: "Screen Translator",
    blurb:
      "Use the Dynamic Island to translate the text on your screen without switching apps",
      //Live translation of whatever is on screen, running in the background from the Dynamic Island.
      // translate text on screen without having to switch apps.
      // Live translation of whatever is on screen without having to switch apps
    slug: "screen-translator",
    platform: "mobile",
    images: [
      {
        src: "/projects/screen-translator-2.png",
        cover: "/projects/screen-translator-watching.png",
        // The phone screen is tall, so this keeps the part near the top and
        // zooms in a little so the recording card fills more of the square.
        coverCrop: "50% 11%",
        coverZoom: 1.06,
        alt: "Screen Translator just after recording starts: the recording card with a red-to-blue glow around it, watching for Korean text, over the display and translation region rows",
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
