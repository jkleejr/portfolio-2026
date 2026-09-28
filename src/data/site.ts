export const site = {
  name: "JOHN LEE", // oldlondon font
  titleName: "John Lee",
  role: "Design Engineer",
  email: "johnkleejr@gmail.com",

  links: [
    { label: "GitHub", href: "https://github.com/jkleejr" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/john-lee-779329401/" },
  ],

  // Between the links and Email at the foot of the homepage. Clicking it
  // saves the file rather than opening it, under the name given here. The file
  // itself lives in public/, so the href is its path from the site root.
  resume: { label: "Resume", href: "/John-Lee-Resume.pdf" },

  // The last line of the homepage, under the work. Left out entirely when it
  // is empty, rather than leaving a gap at the foot of the page.
  closing: "Open to product design and design engineering roles.",

  // One entry per line: each is set as a paragraph of its own rather than run
  // into the one before it.
  intro: [
    "Product designer building iOS and AI native products.",
  ],
};
// "Hi, I design and build in code...",
// "Design engineer and product designer building iOS and AI native products."
