// ---------------------------------------------------------------------------
// Design one — the original layout.
//
// Moved here unchanged when the design switcher landed. The switcher renders
// this and DesignTwo side by side and shows one at a time, so edits to the
// alternative never touch this file.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { ProjectThumbnail } from "./project-thumbnail";
import { AppStoreBadge, SiteBadge } from "./title-badge";

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen. That
  // is not only spacing: a page that overflows by even a few dozen pixels hands
  // every upward swipe to the browser as a scroll, and the ribbons lose the
  // gesture — see "Touch behaviour" in globals.css.
  //
  // The top padding drops the name to where the intro under it used to start —
  // 1.5rem plus the 112px the name, the role and the gap below them took up
  // back when all three were in flow — and the whole page follows it down. It
  // still has to clear the role, which is now pinned in the top left corner.
  // Only from sm up: on a phone the name spans the window at the top and the
  // role stays under it in flow, so there is nothing to clear.
  return (
    <main className="relative pb-8 pt-6 sm:pb-28 sm:pt-34">
      {/* The name, set in the blackletter — see .fraktur in globals.css, which
          carries the face and pins the weight. It is the one thing on the page
          that is not in the column: it runs the width of the window and is
          centred in that, rather than lining up with the covers below it.

          It is one row from sm up and two on a phone, which is why every
          value below is set twice. The reason it had to leave the column is
          the row: "JOHN LEE" is far wider than the column's 628px at any
          display size worth using, so in there it always broke in two.

          Which makes the window, not the column, what the size has to fit.
          These numbers are cut to Old London and do not carry over to another
          face. It is the narrower and the shorter of the two loaded — on
          "JOHN LEE" it measures 4.71em against Fette UNZ Fraktur's 5.60em,
          and its capitals ink 0.80em tall against Fette's 0.96em. Both
          differences push the same way, so it carries more size: Fette ran
          15vw/14rem on the row and 24vw/9rem on the phone.

          The row is 17vw: 4.71em of it is 80vw of text, and the rest clears
          px-6 down to about a 250px window. Raising it pushes the line off the
          page, where nowrap has no give and the overflow becomes a sideways
          scroll.

          Below sm the nowrap comes off and the space is left to break, which
          can only ever give two lines. That makes "JOHN", at 2.62em, the line
          that has to fit rather than the whole 4.71em string — room enough to
          go up to 28vw, so the name reads far larger on a phone than shrinking
          it to hold one row would have allowed.

          The ceilings, 16.5rem and 10.5rem, are the sizes at which this face's
          short capitals stand as tall as Fette's did at 14rem and 9rem. Set to
          the same numbers it would have read smaller.

          px-6 is what the wrap measures against, and it matches the 3rem the
          sizing above assumes. Without it the break would be computed against
          the full window and the letters could reach the screen edge.

          One leading, where the face before it needed two: this one can set
          solid on two lines. Its caps ink from -0.131em to +0.670em, so "LEE"
          under "JOHN" needs 0.787em between baselines to avoid touching, and a
          1em box clears that on its own. Fette needed the phone opened out to
          1.1 to get the same clearance.

          data-gravity="letters" is for when the apple is pressed: the name
          comes apart a character at a time rather than as "JOHN" and "LEE",
          so each letter waits for its own hover. It is the only thing on the
          page marked that way, and the reason is the size — at 16.5rem a word
          is a slab, and two of them falling barely reads as the page coming
          apart. Everywhere else the text is small enough that whole words are
          the finer-grained answer, not the coarser one. */}
      <h1
        data-gravity="letters"
        className="fraktur mb-16 px-6 text-center text-[clamp(2rem,28vw,10.5rem)] leading-none sm:mb-24 sm:whitespace-nowrap sm:text-[clamp(2rem,17vw,16.5rem)]"
      >
        {site.name}
      </h1>

      {/* Everything the page says is one column — a cover, and the writing
          beside it — and the column sits in the middle of the window rather
          than against its left edge. The maximum is what keeps a margin on a
          phone, where the column is wider than the screen. */}
      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">
        {/* The writing at the top of the page. The name is no longer in here
            — it is above, spanning the window — and the role is pinned to the
            page's top left corner from sm up, opposite the buttons. What is
            left in flow is the intro.

            No measure of its own: the header runs the width of the whole
            column, so the intro breaks where the last word of a project's
            line does, out at the right edge of the page's writing.

            The buttons are in the corner opposite at every width now, so the
            header no longer reserves the height a row of them used to sit in
            — see "The page on a phone" in globals.css. */}
        <header>
          {/* The role sits in the top left corner of the page, opposite the
              buttons in layout.tsx and pinned the same way — left-6 top-6
              against the initial containing block, since nothing between here
              and the root is positioned.

              Only from sm up. The name above is centred on the window and set
              to fill most of it — on a phone it comes within about 30px of
              either edge — so that corner is underneath it, and pinning at
              every width would lay the role over the name's first letter.
              Below sm it stays in flow, under the name, which is where the
              header had it. sm:mt-0 because the flow margin still applies
              once it is out of flow, and would push it 12px below the buttons
              it is meant to line up with. */}
          <p className="mt-3 text-lg font-medium text-foreground sm:absolute sm:left-6 sm:top-6 sm:z-20 sm:mt-0">
            {site.role}
          </p>
          {/* Who that is. A paragraph per line of site.intro, so a sentence that
              should start fresh does, rather than being wrapped into the one
              above it. Set exactly as the role above it — same size, same
              weight, same colour — so the two read as one block under the
              name, and only the name leads.

              One margin at every width, now that nothing is pinned between
              the role and this. */}
          {site.intro.length > 0 && (
            <div className="mt-8 space-y-3">
              {site.intro.map((line) => (
                <p key={line} className="text-lg font-medium leading-relaxed text-foreground">
                  {line}
                </p>
              ))}
            </div>
          )}
        </header>

        {/* One row per project: its cover, and beside that the name and the one
            line that says what the thing is. Nothing here is a press target any
            more — the writing for a project is on the page beside it rather than
            behind it.

            The covers hold the left of the column and the writing the right of
            it, on the same two lines the header above them keeps.

            One number for the room above the first row and the room between
            every row after it. The two are not measured from the same kind of
            edge — the gap under the intro starts at the bottom of a line of
            text, which carries a few pixels of leading below the letters,
            where the gaps between projects start at the hard bottom edge of a
            cover — so the first will read as a touch the larger of the two.
            Held equal on purpose all the same.

            Beside at every width, and centred on the cover rather than hung
            from its top edge — a title and a line under it are shorter than
            the picture beside them, and hung from the top they leave the row
            bottom-heavy. A phone fits the row by shrinking the cover and the
            gap rather than by stacking the two; see "The page on a phone" in
            globals.css. */}
        <div className="mt-16 flex flex-col items-start gap-16">
          {entries.map((entry) => (
            <article
              key={entry.slug}
              className="flex items-center gap-[var(--cover-gap)]"
            >
              {(entry.images ?? []).map((image, i) => (
                <ProjectThumbnail
                  key={`${entry.slug}-${i}`}
                  image={image}
                  slug={entry.slug}
                  href={entry.srcHref}
                />
              ))}
              {/* The writing takes whatever the cover leaves on a phone, and
                  its own measure from sm up, where there is room for it.
                  min-w-0 is what lets it be narrower than its longest line —
                  without it a flex item refuses to shrink past its content and
                  pushes the row off the side of the screen. */}
              <div className="min-w-0 flex-1 sm:w-[var(--text-width)] sm:flex-none sm:shrink-0">
                <h2 className="text-xl font-semibold leading-snug">
                  {entry.title}
                  {entry.appStore !== undefined && (
                    <AppStoreBadge href={entry.appStore} label={entry.title} />
                  )}
                  {entry.titleHref && (
                    <SiteBadge href={entry.titleHref} label={entry.title} />
                  )}
                </h2>
                {entry.blurb && (
                  <p className="mt-3 text-base leading-relaxed">
                    {entry.blurb}
                  </p>
                )}
                {entry.date && (
                  <p className="mt-2 text-base leading-relaxed">
                    Date: {entry.date}
                  </p>
                )}
                {entry.tools && (
                  <p className="mt-1 text-base leading-relaxed">
                    Tools: {entry.tools}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* What the work was leading to, and the way to answer it. From sm up
            these are not in the column at all: they sit in the page's two
            bottom corners, closing it the way the role and the buttons open it
            at the top.

            They are pinned to main rather than to the initial containing
            block, which is why main is relative. An absolute box with no
            positioned ancestor resolves bottom against the first viewport, so
            on a page this long it would land somewhere up in the projects
            instead of at the end of them. main's box is the whole document,
            and bottom-6 sits inside its pb-28.

            Still in flow below sm, where pb-8 is not deep enough to hold a
            pinned line clear of the last project row. The wrapper keeps that
            phone layout and does nothing else — with both children out of
            flow from sm up it has no height, so its margin goes too. */}
        <div className="mt-16 flex flex-col gap-4 sm:mt-0 sm:block">
          {site.closing && (
            <p className="text-lg font-medium leading-relaxed text-foreground sm:absolute sm:bottom-6 sm:left-6">
              {site.closing}
            </p>
          )}
          <a
            href={`mailto:${site.email}`}
            className="self-end text-lg font-medium text-foreground transition-opacity duration-200 ease-out hover:opacity-70 sm:absolute sm:bottom-6 sm:right-6"
          >
            Contact
          </a>
        </div>
      </div>
    </main>
  );
}
