"use client";

// ---------------------------------------------------------------------------
// A paragraph beside a picture that wraps round it when it has to.
//
// The picture is floated to one side and the paragraph runs beside it. While
// the paragraph is the shorter of the two it is let down to sit centred on
// the picture, as the paragraphs set beside a picture in a grid are — see the
// image case in case-study.tsx. Once it runs longer, on a narrower window, it
// starts level with the picture's top and the rest of it carries on under
// the picture at the column's full width, the way a float lets text do.
//
// Which of the two it is depends on how the lines break, so it is measured:
// the paragraph's height without the drop — with its heading, if it has
// one — against the picture's, whenever
// the column changes width. The writing and the picture are rendered on the
// server and handed in; this only places them.
//
// On a phone there is no room beside it: the paragraph comes first and the
// picture under it, as a paragraph and a picture would.
// ---------------------------------------------------------------------------

import { useLayoutEffect, useRef, useState } from "react";

export function BesideWrap({
  heading,
  text,
  figure,
  width,
  right,
}: {
  /** A heading over the paragraph, centred on the picture with it. */
  heading?: React.ReactNode;
  text: React.ReactNode;
  figure: React.ReactNode;
  /** How wide the picture is drawn, as a CSS length. */
  width: string;
  /** Float the picture to the right of the paragraph rather than the left. */
  right?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const fig = useRef<HTMLElement>(null);
  const para = useRef<HTMLDivElement>(null);
  const [drop, setDrop] = useState(0);

  useLayoutEffect(() => {
    const b = box.current;
    const f = fig.current;
    const p = para.current;
    if (!b || !f || !p) return;
    const measure = () => {
      // Side by side only where the figure is floated — from sm up.
      if (getComputedStyle(f).float === "none") return setDrop(0);
      const was = p.style.paddingTop;
      p.style.paddingTop = "0px";
      const free = p.getBoundingClientRect().height;
      p.style.paddingTop = was;
      setDrop(Math.max(0, (f.getBoundingClientRect().height - free) / 2));
    };
    measure();
    const watch = new ResizeObserver(measure);
    watch.observe(b);
    watch.observe(f);
    return () => watch.disconnect();
  }, []);

  return (
    <div ref={box} className="max-sm:flex max-sm:flex-col-reverse max-sm:gap-5 sm:flow-root">
      <figure
        ref={fig}
        className={`max-w-full sm:mb-2 sm:max-w-[50%] ${right ? "sm:float-right sm:ml-10" : "sm:float-left sm:mr-10"}`}
        style={{ width }}
      >
        {figure}
      </figure>
      <div ref={para} style={{ paddingTop: drop }}>
        {heading}
        <p className="text-lg leading-relaxed text-body">{text}</p>
      </div>
    </div>
  );
}
