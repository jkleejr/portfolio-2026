// thumbnail for a project, src or cover image
export type EntryImage = {
  src?: string;
  alt: string;
  crop?: string;
  cover?: string;
  coverCrop?: string;
  coverZoom?: number;
};

// describes project on homepage
export type Entry = {
  title: string; 
  blurb?: string;
  slug: string;
  images?: EntryImage[];
  // demo video shown as the cover on the homepage, in place of images
  video?: string;
};

// Projects shown in order
export const entries: Entry[] = [
  {
    title: "Loot Check",
    blurb:
      "Photograph any item to find its name, potential value, and where to sell it",
    slug: "loot-check",
    video: "/projects/loot-check-shark.mp4",
    images: [
      {
        src: "/projects/loot-check-1.png",
        alt: "Loot Check home screen",
        crop: "50% 15%",
      },
    ],
  },
  {
    title: "Screen Translator",
    blurb:
      "Use the Dynamic Island to translate the text on your screen without switching apps",
    slug: "screen-translator",
    video: "/projects/screen-translator-demo.mp4",
    images: [
      {
        cover: "/projects/screen-translator-watching.png",
        // The phone screen is tall, so this keeps the part near the top and zooms in a little so the recording card fills more of the square.
        coverCrop: "50% 11%",
        coverZoom: 1.06,
        alt: "Screen Translator just after recording starts: the recording card with a red-to-blue glow around it, watching for Korean text, over the display and translation region rows",
      },
    ],
  },
  {
    title: "Paper Reader",
    blurb:
      "Upload a PDF and hear it in a natural voice with citations filtered out",
    slug: "paper-reader",
    video: "/projects/paper-reader-add-and-listen.mp4",
    images: [
      {
        cover: "/projects/paper-reader-cover-highlight.png",
        coverCrop: "left",
        alt: "Reader view with the sentence being read aloud highlighted",
      },
    ],
  },
  {
    title: "Buy Side Briefings",
    blurb:
      "Automated, daily stock market research and reports",
    slug: "buy-side-briefings",
    images: [
      {
        cover: "/projects/buy-side-briefings-swing.png",
        alt: "A candlestick chart on a dark ground: green candles climbing to a peak, then red ones falling away from it",
      },
    ],
  },
];
