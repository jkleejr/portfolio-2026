// ---------------------------------------------------------------------------
// The homepage: the name, the intro, the list of projects, and the links at
// the bottom. The same page is served at / and, with one study open, at
// /[slug] — see [slug]/page.tsx.
// ---------------------------------------------------------------------------

import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { caseStudies } from "@/data/case-studies";
import { StudyBody, poster } from "./case-study";
import { mediaSize } from "./media-size";
import { ProjectList, ProjectSection } from "./project-study";
import { ProjectThumbnail } from "./project-thumbnail";
import { CopyEmail } from "./copy-email";

export function DesignOne() {
  // The bottom padding is trimmed on a phone so the page fits the screen.
  //
  // The top padding is the same 1.5rem at every width, the air the page keeps
  // at all of its edges. The name is the first thing under it and nothing is
  // pinned above the name any more, so there is no row for the padding to
  // clear — where the name has to get under the apple button it does so with a
  // margin of its own, see the h1.
  return (
    <main className="relative pb-8 pt-6 sm:pb-28">
      {/* The name, set in the blackletter — see .fraktur in globals.css, which
          carries the face and pins the weight. It is the one thing on the page
          that is not in the column: it holds the page's top left corner and
          runs most of the width of the window from there, rather than lining
          up with the covers below it. It is the only thing up there on the
          left — the role that used to be pinned in that corner is the first
          words of the intro now.

          From 1280px it starts at the very top, on the same line as the apple
          button in the opposite corner. There is room for both: the name is
          87% of the band, and with the apple and the name each held --edge in
          from their sides, at 1280px some 15px is left between the name's box
          and the apple and more between its ink and the apple — about what
          the page had at 900px when --edge was 1.5rem. Under 1280px there is
          not, so the name takes --top-row plus a gap as a top margin and sits
          under the apple instead. Reading the row's height from the variable
          rather than writing 44px here means the two cannot fall out of step.
          Widen --edge and this breakpoint has to move up with it.

          The left padding is the page's --edge and 0.0375em more, because
          that is how far the J's swash hangs out to the left of where the
          face says the letter starts — measured, off the ink. With it the
          swash stops on the same line the intro and the notes in the margin
          start on, where set flush the name stood 10px out into the margin
          at full size. In em, so it holds at every size the name is set at.

          One row at every width, which is why whitespace-nowrap carries no
          breakpoint. It is also why the name is out here rather than in the
          column: "JOHN LEE" is far wider than the column's 628px at any
          display size worth using, so in there it always broke in two.

          Which makes the window what the size has to fit, and the whole
          string, not its longest word. There is no give to spare: nowrap
          cannot break, so going over does not wrap, it scrolls the page
          sideways.

          4.71em of text against the window less the padding is the whole sum,
          which makes the padding worth as much as the size. There is none on
          the right for that reason: set from the left, the name needs only
          its own left margin, and with nothing reserved at the other end
          15.5% holds down to a 200px window. What is left over at the right
          is a margin all the same — about 1.5rem of it on a 390px phone.

          15.5% of --page, the band the page is laid out in, rather than of
          the window: the two are the same up to about 1557px, and past that
          the band stops growing and is centred, so the name holds at 15rem
          and the whole page goes with it as one block. That is where the
          ceiling comes from — it is the band's cap in globals.css, not a
          number here.

          The other cost is worth naming. Letting the name break gave the
          phone a much larger one — only "JOHN" at 2.62em had to fit, which
          allowed 28vw, so a 375px screen ran 105px where one row runs 69px.
          One row is the ask; this is what it takes.

          These numbers are cut to Old London and do not carry over to another
          face. Two measurements move them: "JOHN LEE" is 4.71em wide in it,
          which sets the vw, and its capitals ink only 0.80em tall inside the
          em, which is why the ceiling is as high as 18rem — a face with taller
          capitals reaches the same apparent size at a smaller number. Measure
          both before swapping the face; neither is guessable from the look of
          it.

          leading-none because a single row of capitals has nothing to collide
          with, and this face inks only 0.80em inside a 1em box.

          The bottom margin is the room between the name and the intro under
          it — the intro's own margin collapses into this one, so this is the
          whole of it. Measured from the ink again: the capitals stop ~16px
          short of the box's bottom at full size and the intro's ink starts
          ~8px into its line, so 3.5rem is ~80px of black. A phone shows less,
          in step with its smaller name.

          data-gravity="letters" is for when the apple is pressed: the name
          comes apart a character at a time rather than as "JOHN" and "LEE",
          so each letter waits for its own hover. It is the only thing on the
          page marked that way, and the reason is the size — at 18rem a word
          is a slab, and two of them falling barely reads as the page coming
          apart. Everywhere else the text is small enough that whole words are
          the finer-grained answer, not the coarser one. */}
      <h1
        data-gravity="letters"
        className="fraktur mb-12 mt-[calc(var(--top-row)+1.5rem)] whitespace-nowrap pl-[calc(var(--edge)+0.0375em)] text-[length:var(--name-size)] leading-none sm:mb-14 min-[80rem]:mt-0"
      >
        {site.name}
      </h1>

      {/* The writing at the top of the page, which is the intro. It is set from
          the page's left edge, under the name and on the line the name's ink
          starts on, rather than in the column with the projects: the name
          holds that corner, and a line about whose name it is reads as part of
          it there, where out in the middle it read as the first of the
          projects. --edge is the page's margin — the same the notes in
          the margin further down start at.

          Not held to the column's measure: the sentence runs on toward the
          right margin rather than breaking early, and only wraps where the
          page itself runs out.

          The apple button is in the opposite corner at every width, so the
          header doesn't need to leave room for it — see "The page on a
          phone" in globals.css. */}
      <header className="px-[var(--edge)]">
        {/* Who that is. A paragraph per line of site.intro, so a sentence that
            should start fresh does, rather than being wrapped into the one
            above it. A step up from the page's other lines — still far
            short of the name, so only the name leads.

            One margin at every width. */}
        {site.intro.length > 0 && (
          <div className="mt-8 space-y-3">
            {site.intro.map((line) => (
              <p key={line} className="text-[30px] font-black leading-relaxed text-foreground">
                {line}
              </p>
            ))}
          </div>
        )}
      </header>

      {/* Every project's cover, side by side in one row that scrolls sideways
          when it runs past the window, and under it, when one is pressed,
          that project's study — see ProjectList and CoverStrip. Pressing a
          cover opens its study; pressing it again closes it.

          A cover is the project's demo video, or its first picture where it
          has no video. The study leaves that one out when it opens here, as
          the cover above it is already showing it. The studies are rendered
          here, on the server, and handed to the list as markup: what is in
          the browser's bundle is the switch, not the writing. See
          project-study.tsx. */}
      <ProjectList
        studies={Object.fromEntries(
          entries.flatMap((entry) => {
            const study = caseStudies[entry.slug];
            return study
              ? [[entry.slug, <StudyBody key={entry.slug} study={study} inline cover={entry.media} />]]
              : [];
          }),
        )}
      >
        {entries.map((entry) => (
          <ProjectSection
            key={entry.slug}
            slug={entry.slug}
            hasStudy={!!caseStudies[entry.slug]}
          >
            {entry.media ? (
              <ProjectThumbnail
                slug={entry.slug}
                media={{
                  src: entry.media,
                  poster: poster(entry.media),
                  ...mediaSize(entry.media),
                }}
              />
            ) : (
              (entry.images ?? []).slice(0, 1).map((image) => (
                <ProjectThumbnail key={entry.slug} image={image} slug={entry.slug} />
              ))
            )}
          </ProjectSection>
        ))}
      </ProjectList>

      <div className="mx-auto w-[var(--column)] max-w-[calc(100%-3rem)]">

        {/* What the work was leading to, and the way to answer it. From sm up
            these are not in the column at all: they sit in the band's two
            bottom corners, closing it the way the intro and the apple button
            open it at the top.

            They are pinned to main rather than to the initial containing
            block, which is why main is relative. An absolute box with no
            positioned ancestor resolves bottom against the first viewport, so
            on a page this long it would land somewhere up in the projects
            instead of at the end of them. main's box is the whole document
            at the band's width, and bottom-6 sits inside its pb-28.

            Still in flow below sm, where pb-8 is not deep enough to hold a
            pinned line clear of the last project row. The wrapper keeps that
            phone layout and does nothing else — with both children out of
            flow from sm up it has no height, so its margin goes too.

            The closing line stops short of the right-hand corner by the width
            of the links and a gap, so on a narrow window it wraps upward
            rather than running under them. */}
        <div className="mt-16 flex flex-col gap-7 sm:mt-0 sm:block">
          {site.closing && (
            <p className="text-xl font-medium leading-relaxed text-foreground sm:absolute sm:bottom-6 sm:left-[var(--edge)] sm:right-100 min-[70rem]:right-[37rem]">
              {site.closing}
            </p>
          )}
          {/* The other places to find him, his resume, then the way to write
              to him. One line, so it is the line that is pinned and not each
              link. The arrow after LinkedIn and Resume says they open in a
              new tab: a no-break space so it never starts a line of its own,
              and hidden from a screen reader, which would read it out as a
              direction. */}
          <nav className="flex gap-5 self-end text-lg font-medium sm:gap-6 sm:text-xl text-foreground sm:absolute sm:bottom-6 sm:right-[var(--edge)]">
            {site.links.map(
              (link) =>
                link.href && (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="transition-colors duration-200 ease-out hover:text-accent"
                  >
                    {link.label}
                    <span aria-hidden className="text-[0.75em]">{"\u00a0"}↗</span>
                  </a>
                ),
            )}
            {/* Opens the PDF in a new tab, where the browser shows it, rather
                than saving it to the computer. */}
            <a
              href={site.resume.href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors duration-200 ease-out hover:text-accent"
            >
              {site.resume.label}
              <span aria-hidden className="text-[0.75em]">{"\u00a0"}↗</span>
            </a>
            {/* Two ways to the address, one at a time. Where the row has room
                for it (from 70rem, 1120px — the closing line makes way for the
                longer row there, right-[37rem] above) it reads "Email", and
                pressing it copies the address — see copy-email.tsx. Under
                that, on a phone above all, it is the word, and opens a mail
                app the way it always did. */}
            <a
              href={`mailto:${site.email}`}
              className="transition-colors duration-200 ease-out hover:text-accent min-[70rem]:hidden"
            >
              Email
            </a>
            <CopyEmail
              email={site.email}
              className="hidden transition-colors duration-200 ease-out hover:text-accent min-[70rem]:inline"
            >
              Email
            </CopyEmail>
          </nav>
        </div>
      </div>
    </main>
  );
}
