// ---------------------------------------------------------------------------
// Posts on the blog, newest first — the order here is the order they appear.
//
// A post is a title and its paragraphs. `body` is one string per paragraph
// rather than one blob, so the spacing between them belongs to the page and
// not to the writing; a post with an empty body shows its title and nothing
// else, which is what a post looks like before it is written.
//
// Empty for now, so the page it feeds is blank. Adding an entry here is the
// whole of putting one back.
// ---------------------------------------------------------------------------

export type Post = {
  title: string;
  // Written out in full, e.g. "22 August 2026". Shown under the title when a
  // post has one, left out when it does not.
  date?: string;
  body: string[];
};

export const posts: Post[] = [];
