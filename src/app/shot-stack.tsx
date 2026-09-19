"use client";

// ---------------------------------------------------------------------------
// A row of phone screenshots that becomes a stack on a phone.
//
// Three phones across is a row on a laptop. On a phone the same three are
// either too small to read or, wrapped, three screens of scrolling past
// pictures. So under sm they are piled in one place, the way prints are: the
// first on top, the others behind it and turned a few degrees each way, so a
// corner of every one shows and the pile reads as a pile. A swipe to the left
// sends the top one to the back, a swipe to the right brings the last one
// forward again, and a tap does the same by where it lands: on the right half
// it is a swipe left, on the left half a swipe right. The dots under it say how
// many there are and which is showing.
//
// One set of markup for both. The shots are the same <img> elements at every
// width — the row from sm up is these figures in a flex row, as case-study.tsx
// sets any other row of shots — and the pile is only how they are placed under
// sm. That is why every placement below is written through a custom property
// and read by a class that sm switches off again: an inline transform would
// follow the shots up into the row.
//
// This is the one part of a study that has state, so it is the one part that
// is a client component — see the note at the top of case-study.tsx. It is
// handed the shots as data and none of the writing.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";

type Shot = { src: string; alt: string };

// How far a swipe has to travel to count, in px, and how far a press may
// travel and still be a tap — the same slip press.ts allows a click.
const SWIPE = 48;
const SLOP = 5;
// How long the shot on its way out is given to clear the pile before the
// order changes under it. The transition itself is longer; this is only the
// part of it that has to be over first.
const CLEAR = 200;

// The pile is a phone's layout, and so are the gestures.
const PHONE = "(width < 40rem)";

/**
 * How a shot sits at a given depth in the pile. The top one is square to the
 * page; the ones behind it are turned alternately right and left, a little
 * further each pair down, so their corners come out on both sides rather than
 * all fanning one way. At 4° a phone-shaped shot shows ~19px of corner, which
 * is enough to read as another picture and not as a shadow.
 */
function resting(depth: number): string {
  if (depth === 0) return "rotate(0deg)";
  const turn = Math.min(4 + (Math.ceil(depth / 2) - 1) * 2, 8);
  const side = depth % 2 ? 1 : -1;
  return `translateX(${side * 6}px) rotate(${side * turn}deg)`;
}

export function ShotStack({
  items,
  max,
  columns,
}: {
  items: Shot[];
  max?: number;
  /** Two across from sm up, where the row is otherwise three. */
  columns?: 2;
}) {
  const n = items.length;
  // Which shot is on top.
  const [top, setTop] = useState(0);
  // How far the top one has been pulled, while a finger is on it.
  const [pull, setPull] = useState<number | null>(null);
  // The shot that is leaving the pile or coming back onto it, and which side.
  const [away, setAway] = useState<{ i: number; side: 1 | -1 } | null>(null);

  const from = useRef<{ id: number; x: number } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const turnTo = (step: 1 | -1) => {
    if (n < 2) return;
    // Forward, the top shot goes off to the left and comes back in at the
    // bottom. Backward, the bottom one comes out to the right and back in on
    // top. Either way it is out to the side when the order changes, so it is
    // never seen passing through the others.
    const i = step === 1 ? top : (top - 1 + n) % n;
    const next = (top + step + n) % n;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTop(next);
      return;
    }
    setAway({ i, side: step === 1 ? -1 : 1 });
    timer.current = setTimeout(() => {
      setTop(next);
      setAway(null);
    }, CLEAR);
  };

  const release = (e: React.PointerEvent, cancelled = false) => {
    const start = from.current;
    if (!start || start.id !== e.pointerId) return;
    from.current = null;
    setPull(null);
    if (cancelled) return;
    const dx = e.clientX - start.x;
    if (Math.abs(dx) <= SLOP) {
      // A tap goes by which half of the pile it landed on. The pile is centred
      // in this element, so its middle is the top shot's middle too.
      const box = e.currentTarget.getBoundingClientRect();
      turnTo(e.clientX < box.left + box.width / 2 ? -1 : 1);
    } else if (dx <= -SWIPE) turnTo(1);
    else if (dx >= SWIPE) turnTo(-1);
  };

  return (
    // Bled out to the edges of the screen under sm, and clipped there: a shot
    // pulled to one side would otherwise widen the page and let it scroll
    // sideways. `clip` and not `hidden`, which would make this a scroll
    // container and cut the turned corners off at its top and bottom too.
    <div className="max-sm:-mx-6 max-sm:overflow-x-clip max-sm:px-6">
      <div
        // pan-y leaves the page's own scroll to the browser and hands a
        // sideways pull here. If the browser decides a pull was a scroll after
        // all it cancels the pointer, and the shot goes back where it was.
        className="mx-auto flex flex-wrap items-start justify-center gap-4 max-sm:grid max-sm:cursor-grab max-sm:touch-pan-y max-sm:select-none max-sm:place-items-center max-sm:gap-0"
        style={max ? { maxWidth: max } : undefined}
        onPointerDown={(e) => {
          if (away || !window.matchMedia(PHONE).matches) return;
          if (e.pointerType === "mouse" && e.button !== 0) return;
          from.current = { id: e.pointerId, x: e.clientX };
          e.currentTarget.setPointerCapture(e.pointerId);
          setPull(0);
        }}
        onPointerMove={(e) => {
          const start = from.current;
          if (start && start.id === e.pointerId) setPull(e.clientX - start.x);
        }}
        onPointerUp={(e) => release(e)}
        onPointerCancel={(e) => release(e, true)}
      >
        {items.map((item, i) => {
          const depth = (i - top + n) % n;
          const place =
            away?.i === i
              ? // Its own width and a third again, which is off the side of
                // any phone, tipping the way it is going.
                `translateX(${away.side * 135}%) rotate(${away.side * 14}deg)`
              : depth === 0 && pull !== null
                ? `translateX(${pull}px) rotate(${pull * 0.05}deg)`
                : resting(depth);
          return (
            <figure
              key={i}
              // Every shot in the one cell of the grid under sm, so the pile is
              // as tall as a shot and no taller; a third of the row from sm up,
              // or half of it — the widths case-study.tsx gives any row.
              // Under a finger the shot follows it exactly, so the transition
              // is dropped for as long as the pull lasts.
              // Each shot in the pile is kept on a layer of its own. A shot is
              // a full-size screenshot drawn down to a phone's width and
              // dimmed, which is a lot to paint; left to itself the browser
              // paints the whole pile again for every frame of a pull, and
              // makes the layers only once a turn has begun, which is the
              // frames a tap drops. On layers a move is the layers moved.
              className={`w-[78%] [grid-area:1/1] [filter:brightness(var(--shot-dim))] [transform:var(--shot-place)] [z-index:var(--shot-z)] max-sm:[will-change:transform,filter] ${
                columns === 2
                  ? "sm:w-[calc((100%_-_1rem)/2)]"
                  : "sm:w-[calc((100%_-_2rem)/3)]"
              } sm:[filter:none] sm:[grid-area:auto] sm:[transform:none] sm:[z-index:auto]`}
              style={
                {
                  "--shot-place": place,
                  "--shot-z": n - depth,
                  // The ones underneath sit back a shade, so the top one reads
                  // as the top one. Only a shade: a dark screenshot on the dark
                  // page has nothing but its edge to be seen by, and dimmed
                  // much further the corners that say there is a pile are gone.
                  "--shot-dim": depth === 0 ? 1 : 0.75,
                  transition:
                    depth === 0 && pull !== null
                      ? "none"
                      : "transform 380ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 380ms ease-out",
                } as React.CSSProperties
              }
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt={item.alt}
                // A picture dragged is the browser's own drag of it, which
                // takes the pointer away mid-swipe.
                draggable={false}
                // A firmer edge in the pile than in the row, for the same
                // reason: it is the edge that separates one dark shot from
                // the one under it.
                className="w-full rounded-xl border border-foreground/30 sm:border-foreground/10"
              />
            </figure>
          );
        })}
      </div>
      {/* How many, and which. Only where there is a pile to count. */}
      {n > 1 && (
        <div aria-hidden className="mt-5 flex justify-center gap-2 sm:hidden">
          {items.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full transition-colors duration-200 ease-out ${
                i === top ? "bg-foreground" : "bg-foreground/25"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
