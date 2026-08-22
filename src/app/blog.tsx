// ---------------------------------------------------------------------------
// The blog.
//
// A view of its own rather than a third design: `data-view` on <html> swaps it
// in for whichever design is showing, the same way `data-design` picks between
// the two designs. The pencil in the corner is what brings you here and what
// takes you back, and on this page it is the only button left.
//
// Posts come from src/data/posts.ts and read straight down the page, newest
// first, with the gap between them set here rather than by anything in the
// writing. At this length there is nothing a list of links would do that this
// does not; the moment scrolling past one to reach another becomes a chore is
// the moment to add an index.
// ---------------------------------------------------------------------------

import { posts } from "@/data/posts";

export function Blog() {
  return (
    // On a phone the corner stack is a row across the top, so the reading
    // column starts below it — the same 10.5rem the gallery starts at on
    // design one. From sm up the stack is a column off to the right and the
    // margin is what keeps the text clear of it.
    <main className="space-y-16 pb-16 pt-[10.5rem] sm:pt-6">
      {posts.map((post) => (
        <article key={post.title} className="mx-6 max-w-[68ch] sm:mr-24">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          {post.date && (
            <p className="mt-1 text-sm text-muted">{post.date}</p>
          )}
          {post.body.map((paragraph, i) => (
            <p
              key={i}
              className="mt-5 text-lg leading-relaxed text-foreground"
            >
              {paragraph}
            </p>
          ))}
        </article>
      ))}
    </main>
  );
}
