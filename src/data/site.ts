export const site = {
  // The wordmark across the top of the homepage. The capitals are the
  // typographic choice, and the sizing in design-one.tsx is measured off this
  // exact string in Old London — read the note on the h1 before changing it.
  name: "JOHN LEE",

  // The same name as prose, for the places the browser and other people's
  // servers set it rather than the page: the tab, and link previews.
  titleName: "John Lee",
  role: "Design Engineer",
  // Under the role in the header, as the way to get in touch.
  email: "johnkleejr@gmail.com",

  // Beside Email at the foot of the homepage, in this order. One with no
  // href is left out rather than set as a link to nowhere.
  links: [
    { label: "GitHub", href: "https://github.com/jkleejr" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/john-lee-779329401/" },
  ],

  // Between the links and Email at the foot of the homepage. Clicking it
  // saves the file rather than opening it, under the name given here. The file
  // itself lives in public/, so the href is its path from the site root.
  resume: { label: "Resume", href: "/John_Lee_Resume.pdf", filename: "John_Lee_Resume.pdf" },

  // The last line of the homepage, under the work. Left out entirely when it
  // is empty, rather than leaving a gap at the foot of the page.
  closing: "Open to product design and design engineering roles.",

  // One entry per line: each is set as a paragraph of its own rather than run
  // into the one before it.
  intro: [
    "Product designer and front-end engineer building iOS and AI-native products.",
  ],
};
// "Hi, I design and build in code...",
// "Design engineer and product designer building iOS and AI native products."


/* 9.6.26

project substance + raw ability - 8.5/10
portfolio architecture + shell ux - 5/10
case stydy storytelling + depth - 4/10


focus on:
product strategy
design engineering
visual craft


structure / information architecture

clean codebase


product design:
no evidence of users, testing, previous designs, research


context
problem
research
design approach
solution
reflection



*/