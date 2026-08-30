"use client";

// ---------------------------------------------------------------------------
// Google Gravity.
//
// Everything on screen gets weight. Hovering something drops it; you can grab
// anything and throw it, and it still works where it lands — the theme toggle
// lying on the floor is the same button it was, so clicking it still switches
// the theme.
//
// Two kinds of thing fall, for one reason:
//
//   Atoms   Buttons, links, images. These are the REAL elements, pinned to the
//           viewport and moved by transform. They keep their handlers, so they
//           stay usable after they land. They are never reparented — React
//           still owns those nodes, and only their inline style is touched.
//
//   Words   Plain text, which cannot be moved without rewriting the document.
//           Each word is copied into an overlay and the original is made
//           transparent. Nothing is lost: text has nothing to click.
//
// The engine is loaded on demand, so the ~90KB of matter-js never reaches
// anyone who does not press the button.
//
// The switch is the apple in the corner stack — this exports the machinery and
// a hook, and AppleButton owns the state. The apple falls with everything else
// rather than staying anchored: it keeps its handler wherever it lands, so it
// is still the way out.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState, type RefObject } from "react";
import type MatterType from "matter-js";

// Walls sit this far outside the viewport so fast-moving bodies cannot tunnel
// through them between physics steps.
const WALL = 400;

// Anything interactive or drawn falls as one piece rather than word by word.
// The marker is for a box that is neither — a frame with an image and its
// paintwork inside — which should still come away whole rather than shedding
// what it holds. Distinct from the `atom` value, which marks a root to sweep
// (see below) and not a piece itself.
const ATOMS = 'a, button, img, [data-gravity="piece"]';

type WordStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacing: string;
  color: string;
  textTransform: string;
  // The box the copy falls as, so it matches the line the word came out of.
  // Where the glyphs sit inside that box is measured and corrected for when
  // the copy is placed — see the placement pass in run().
  lineHeight: string;
};

type Snapshot = { text: string; left: number; top: number; css: WordStyle };

// Mouse.setElement attaches these handlers and matter-js offers no teardown
// for them. They exist at runtime but are absent from the type definitions.
type MouseWithHandlers = MatterType.Mouse & {
  mousemove: EventListener;
  mousedown: EventListener;
  mouseup: EventListener;
  mousewheel: EventListener;
};

// matter-js 0.20 takes a third argument on Body.setPosition: move the body
// with a velocity to match instead of teleporting it there. It is in the
// library but not in its type definitions.
type SetPosition = (
  body: MatterType.Body,
  position: MatterType.Vector,
  updateVelocity?: boolean,
) => void;

type Piece = {
  el: HTMLElement;
  body: MatterType.Body;
  w: number;
  h: number;
  // Where it sits on the PAGE, not in the window. A piece that has not been
  // let go of yet is held at this spot as the page scrolls under it, so it
  // travels with the layout it is standing in for. Once it falls it belongs to
  // the window instead, and this is not read again.
  pageX: number;
  pageY: number;
};

/**
 * A disc: square, and rounded until its corners are gone. It falls as a circle
 * rather than a box, because a box lands on whichever corner is pointing down
 * and spends the bounce toppling over it instead — which is why the apple came
 * down dead some presses and bounced on others.
 */
function isDisc(el: HTMLElement, w: number, h: number): boolean {
  if (Math.abs(w - h) > 1) return false;
  const radius = getComputedStyle(el).borderTopLeftRadius;
  // Tailwind's rounded-full is an infinite length, which browsers report back
  // in their own way — as the word, or as a number too large to parse into
  // anything meaningful. Either way it is as round as a corner gets.
  if (/inf/i.test(radius)) return true;
  const value = parseFloat(radius);
  if (!Number.isFinite(value)) return false;
  return radius.endsWith("%") ? value >= 50 : value >= w / 2 - 0.5;
}

/** Something that occupies space, and so has somewhere to fall from. */
function drawn(r: DOMRect): boolean {
  return Boolean(r.width && r.height);
}

/**
 * The colours the theme currently resolves to. A word copy painted in one of
 * them is given the variable rather than the value, so words already lying on
 * the floor still follow a theme switch.
 */
function themeColors() {
  const probe = document.createElement("span");
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  document.body.appendChild(probe);
  probe.style.color = "var(--foreground)";
  const foreground = getComputedStyle(probe).color;
  probe.style.color = "var(--muted)";
  const muted = getComputedStyle(probe).color;
  probe.remove();
  return { foreground, muted };
}

/** The outermost interactive or drawn elements — nested ones fall with them. */
function collectAtoms(roots: HTMLElement[]): HTMLElement[] {
  const found: HTMLElement[] = [];
  for (const root of roots) {
    if (root.matches(ATOMS)) found.push(root);
    found.push(...root.querySelectorAll<HTMLElement>(ATOMS));
  }
  return found.filter(
    (el) =>
      drawn(el.getBoundingClientRect()) &&
      !found.some((other) => other !== el && other.contains(el)),
  );
}

/**
 * Every word of visible text in `root` that is not already inside an atom,
 * with the position it currently occupies. The whole page is taken, not just
 * the part in view: the page still scrolls while gravity runs, so a word below
 * the fold is one scroll away from being reached.
 */
function snapshotWords(root: HTMLElement, atoms: HTMLElement[]): Snapshot[] {
  const out: Snapshot[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const styles = new Map<Element, WordStyle>();
  const range = document.createRange();
  const theme = themeColors();

  // Text that is in the layout but not on the screen. A line of the homepage
  // that has not finished writing itself keeps a full-strength copy of itself
  // underneath at zero opacity, to hold the space the finished line will take
  // — see typed-line.tsx. Nothing invisible should fall.
  const faded = new Map<Element, boolean>();
  const invisible = (el: Element) => {
    let value = faded.get(el);
    if (value === undefined) {
      value = getComputedStyle(el).opacity === "0";
      faded.set(el, value);
    }
    return value;
  };

  let node = walker.nextNode() as Text | null;
  while (node) {
    const parent = node.parentElement;
    const text = node.nodeValue ?? "";
    const inAtom = parent ? atoms.some((a) => a.contains(parent)) : false;

    if (parent && !inAtom && !invisible(parent) && /\S/.test(text)) {
      let css = styles.get(parent);
      if (!css) {
        const cs = getComputedStyle(parent);
        const color =
          cs.color === theme.foreground
            ? "var(--foreground)"
            : cs.color === theme.muted
              ? "var(--muted)"
              : cs.color;
        css = {
          fontFamily: cs.fontFamily,
          fontSize: cs.fontSize,
          fontWeight: cs.fontWeight,
          fontStyle: cs.fontStyle,
          letterSpacing: cs.letterSpacing,
          color,
          textTransform: cs.textTransform,
          lineHeight: cs.lineHeight,
        };
        styles.set(parent, css);
      }

      // A Range around each word gives its true box even mid-line, which
      // measuring the element could not.
      for (const match of text.matchAll(/\S+/g)) {
        const at = match.index ?? 0;
        range.setStart(node, at);
        range.setEnd(node, at + match[0].length);
        const r = range.getBoundingClientRect();
        if (!drawn(r)) continue;
        out.push({ text: match[0], left: r.left, top: r.top, css });
      }
    }

    node = walker.nextNode() as Text | null;
  }

  return out;
}

/**
 * Builds the whole simulation. The returned function tears it back down.
 *
 * `trigger` is the button that switched gravity on. It is the one piece the
 * pointer has certainly just been on, so it does not wait to be hovered — it
 * lets go under the press that started everything.
 */
function run(
  Matter: typeof MatterType,
  trigger: HTMLElement | null,
): () => void {
  const panel = document.querySelector<HTMLElement>("main");
  if (!panel) return () => {};

  const root = document.documentElement;

  // Hold the page's height open. Pinning the atoms takes them out of flow, and
  // without this the page would collapse to a fraction of itself: the scroll
  // range would go with it, the scrollbar would disappear, and the widening
  // that followed would slide the layout sideways in the instant before it was
  // measured. Held first, so nothing below has ever seen a different page.
  const heldHeight = panel.style.height;
  panel.style.height = `${panel.offsetHeight}px`;

  // Hide the page BEFORE measuring anything, so the swap from real content to
  // pieces happens where nobody can see it.
  root.classList.add("gravity-on");

  // The corner stack is outside the page content but still on screen, so it
  // falls too — the apple included. An atom keeps its own handler, so the
  // apple works wherever it comes to rest and is still the way out.
  const floating = [
    ...document.querySelectorAll<HTMLElement>('[data-gravity="atom"]'),
  ];

  const atoms = collectAtoms([panel, ...floating]);
  const words = snapshotWords(panel, atoms);
  if (!atoms.length && !words.length) {
    root.classList.remove("gravity-on");
    panel.style.height = heldHeight;
    return () => {};
  }

  const atomRects = atoms.map((el) => el.getBoundingClientRect());

  const overlay = document.createElement("div");
  overlay.className = "gravity-overlay";
  document.body.appendChild(overlay);

  // Where a word goes once it has been knocked loose. A second layer rather
  // than a z-index on the word itself: the overlay is fixed, which makes a
  // stacking context of it, and nothing inside can be lifted over anything
  // outside. Loose things belong over the page they came out of.
  const loose = document.createElement("div");
  loose.className = "gravity-overlay gravity-overlay-loose";
  document.body.appendChild(loose);

  const engine = Matter.Engine.create();
  const world = engine.world;

  function makeBody(x: number, y: number, w: number, h: number, disc = false) {
    const shape = {
      restitution: 0.4,
      friction: 0.5,
      frictionAir: 0.012,
    };
    const body = disc
      ? Matter.Bodies.circle(x + w / 2, y + h / 2, w / 2, shape)
      : Matter.Bodies.rectangle(x + w / 2, y + h / 2, w, h, shape);
    // Pinned only AFTER construction. Body.setStatic snapshots mass and
    // inertia so it can restore them on release, but it skips the snapshot
    // when the body is already static — which passing `isStatic: true` as a
    // construction option makes it. Waking such a body restores mass:
    // Infinity, every force divides to NaN, and it never moves again.
    Matter.Body.setStatic(body, true);
    return body;
  }

  const pieces: Piece[] = [];

  // Atoms: the real elements, taken out of flow where they already sit.
  const restores = atoms.map((el, i) => {
    const rect = atomRects[i];
    const before = el.getAttribute("style");
    el.classList.add("gravity-atom");
    el.style.position = "fixed";
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    el.style.margin = "0";
    el.style.transform = `translate3d(${rect.left}px, ${rect.top}px, 0)`;
    pieces.push({
      el,
      body: makeBody(
        rect.left,
        rect.top,
        rect.width,
        rect.height,
        isDisc(el, rect.width, rect.height),
      ),
      w: rect.width,
      h: rect.height,
      pageX: rect.left + window.scrollX,
      pageY: rect.top + window.scrollY,
    });
    return () => {
      el.classList.remove("gravity-atom");
      if (before === null) el.removeAttribute("style");
      else el.setAttribute("style", before);
    };
  });

  // Words: copies, since text cannot be moved without rewriting the document.
  // Every copy is added first and only then measured, so the whole set costs
  // one layout rather than one apiece.
  const copies = words.map((word) => {
    const el = document.createElement("span");
    el.className = "gravity-word";
    el.textContent = word.text;
    Object.assign(el.style, word.css);
    overlay.appendChild(el);
    return { word, el };
  });

  // Line each copy up with the word it stands for, by the glyphs rather than
  // by the box around them. A span's box is its line box, and the text sits
  // inside it under half the leading — so placing the box where the glyphs
  // were drops every word by that much, and the page appears to sag the
  // moment gravity comes on. A copy left at the overlay's origin measures its
  // own glyphs against its own box, which is the offset to take back out,
  // whatever the font and the line height work out to.
  const glyphs = document.createRange();
  const placed = copies.map(({ word, el }) => {
    const text = el.firstChild;
    let left = word.left;
    let top = word.top;
    if (text) {
      glyphs.selectNodeContents(text);
      const inset = glyphs.getBoundingClientRect();
      left -= inset.left;
      top -= inset.top;
    }
    return { el, left, top, w: el.offsetWidth, h: el.offsetHeight };
  });

  for (const { el, left, top, w, h } of placed) {
    el.style.transform = `translate3d(${left}px, ${top}px, 0)`;
    pieces.push({
      el,
      body: makeBody(left, top, w, h),
      w,
      h,
      pageX: left + window.scrollX,
      pageY: top + window.scrollY,
    });
  }

  Matter.Composite.add(
    world,
    pieces.map((p) => p.body),
  );

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const ground = Matter.Bodies.rectangle(
    vw / 2,
    vh + WALL / 2,
    vw + WALL * 2,
    WALL,
    { isStatic: true },
  );
  const left = Matter.Bodies.rectangle(-WALL / 2, vh / 2, WALL, vh * 3, {
    isStatic: true,
  });
  const right = Matter.Bodies.rectangle(vw + WALL / 2, vh / 2, WALL, vh * 3, {
    isStatic: true,
  });
  // A lid as well as a floor. Something thrown hard enough would otherwise
  // leave over the top of the window and never come back — the walls catch it
  // sideways and the floor catches it falling, so the top was the one way out.
  const ceiling = Matter.Bodies.rectangle(
    vw / 2,
    -WALL / 2,
    vw + WALL * 2,
    WALL,
    { isStatic: true },
  );
  Matter.Composite.add(world, [ground, left, right, ceiling]);

  // Something only starts falling once it is touched, so the page comes apart
  // under the cursor rather than all at once.
  function drop(piece: Piece) {
    const { body, el } = piece;
    if (!body.isStatic) return;
    Matter.Body.setStatic(body, false);
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
    // Lift it over everything still standing, so a piece that comes to rest on
    // top of the page is drawn on top of it too — the pile builds up in front
    // of the layout rather than getting lost inside it.
    if (el.parentElement === overlay) loose.appendChild(el);
    else el.classList.add("gravity-loose");
  }

  // The press is the trigger's own hover, so it falls immediately rather than
  // sitting still under the cursor that just pressed it and waiting to be
  // entered again.
  //
  // And it is tipped as it goes, not pushed. It still drops straight down the
  // line it was sitting on; what varies is which way it is leaning and how it
  // is turning while it does. That is what the floor answers: a body turning
  // on impact drags against the floor it lands on, and the friction between
  // them turns the spin into a push — left if it leans left, right if it
  // leans right. Dropped square and still, the apple has nothing sideways to
  // give and the floor has nothing sideways to return, which is why it came
  // straight back up its own path every press. The bounce is loosened a
  // little too, so no two presses give back quite the same height.
  const pressed = trigger ? pieces.find((piece) => piece.el === trigger) : null;
  if (pressed) {
    pressed.el.style.willChange = "transform";
    drop(pressed);
    // Which way it leans is a coin toss; how far is anywhere from a slight
    // lean to a good one. The floor of the range is what keeps it from ever
    // coming down square — a spread that reaches zero would give a dead drop
    // as often as a lively one, and a dead drop is the thing this is for.
    const way = Math.random() < 0.5 ? -1 : 1;
    const tilt = way * (0.05 + Math.random() * 0.14); // 3 to 11 degrees
    Matter.Body.setAngle(pressed.body, tilt);
    Matter.Body.setAngularVelocity(pressed.body, tilt * 0.6);
    pressed.body.restitution = 0.35 + Math.random() * 0.2;
  }

  const listeners: Array<() => void> = [];
  for (const piece of pieces) {
    // will-change is set here rather than in the stylesheet: it promotes the
    // element to its own compositor layer, which costs subpixel text
    // rendering, and until a piece is touched it is not going anywhere. Hinting
    // everything up front made the whole page visibly change texture the
    // moment the button was pressed.
    const wake = () => {
      piece.el.style.willChange = "transform";
      drop(piece);
    };
    piece.el.addEventListener("mouseenter", wake);
    piece.el.addEventListener("mousedown", wake);
    piece.el.addEventListener("touchstart", wake, { passive: true });
    listeners.push(() => {
      piece.el.removeEventListener("mouseenter", wake);
      piece.el.removeEventListener("mousedown", wake);
      piece.el.removeEventListener("touchstart", wake);
    });
  }

  const mouse = Matter.Mouse.create(overlay) as MouseWithHandlers;

  // Matter's own listeners only see events inside the element they are bound
  // to, which would miss the atoms — those sit above the overlay so they stay
  // clickable. Driving the mouse from the window in the capture phase catches
  // everything, whatever it lands on, and never swallows a click.
  overlay.removeEventListener("mousemove", mouse.mousemove);
  overlay.removeEventListener("mousedown", mouse.mousedown);
  overlay.removeEventListener("mouseup", mouse.mouseup);
  overlay.removeEventListener("wheel", mouse.mousewheel);
  overlay.removeEventListener("touchmove", mouse.mousemove);
  overlay.removeEventListener("touchstart", mouse.mousedown);
  overlay.removeEventListener("touchend", mouse.mouseup);

  const track = (e: { clientX: number; clientY: number }) => {
    mouse.absolute.x = mouse.position.x = e.clientX;
    mouse.absolute.y = mouse.position.y = e.clientY;
  };
  const onMove = (e: MouseEvent) => track(e);
  const onDown = (e: MouseEvent) => {
    track(e);
    mouse.button = e.button;
  };
  const onUp = (e: MouseEvent) => {
    track(e);
    mouse.button = -1;
  };
  const onTouch = (e: TouchEvent) => {
    const touch = e.touches[0] ?? e.changedTouches[0];
    if (touch) track(touch);
    mouse.button = e.type === "touchend" ? -1 : 0;
  };
  const touchOpts = { capture: true, passive: true } as const;
  window.addEventListener("mousemove", onMove, true);
  window.addEventListener("mousedown", onDown, true);
  window.addEventListener("mouseup", onUp, true);
  window.addEventListener("touchstart", onTouch, touchOpts);
  window.addEventListener("touchmove", onTouch, touchOpts);
  window.addEventListener("touchend", onTouch, touchOpts);

  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.18, damping: 0.1, render: { visible: false } },
  });
  Matter.Composite.add(world, mouseConstraint);

  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  // The page still scrolls while this runs, and the pieces answer to it in two
  // different ways. One that has not been let go of is standing in for content
  // that is still part of the layout, so it travels with the page: its body is
  // moved to wherever its place on the page now sits in the window. One that
  // has fallen has come loose of the page and belongs to the window, where the
  // floor it landed on is the bottom of the screen — it is left where it lies.
  //
  // The carrying happens here rather than on a scroll event so that it lands
  // in the same frame as the drawing that follows it; a frame apart and the
  // page would visibly drag behind the scroll. Read first, write after: the
  // whole loop is one read of the scroll position and then transforms, which
  // do not disturb layout.
  const carry = Matter.Body.setPosition as SetPosition;
  let scrolledX = window.scrollX;
  let scrolledY = window.scrollY;
  let frame = requestAnimationFrame(function paint() {
    const x = window.scrollX;
    const y = window.scrollY;
    const moved = x !== scrolledX || y !== scrolledY;
    scrolledX = x;
    scrolledY = y;

    for (const piece of pieces) {
      const { el, body, w, h } = piece;
      if (moved && body.isStatic) {
        // Moved WITH its velocity, not teleported. A carried piece is solid
        // the whole way — nothing loose may pass through the page — and the
        // velocity is what lets it push what it meets aside and carry what is
        // resting on it, instead of the two overlapping and the engine firing
        // them apart.
        carry(
          body,
          {
            x: piece.pageX - x + w / 2,
            y: piece.pageY - y + h / 2,
          },
          true,
        );
      }
      el.style.transform =
        `translate3d(${body.position.x - w / 2}px, ${body.position.y - h / 2}px, 0)` +
        ` rotate(${body.angle}rad)`;
    }
    frame = requestAnimationFrame(paint);
  });

  // Keep the floor and walls on the viewport edges when the window changes.
  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    Matter.Body.setPosition(ground, { x: w / 2, y: h + WALL / 2 });
    Matter.Body.setPosition(left, { x: -WALL / 2, y: h / 2 });
    Matter.Body.setPosition(right, { x: w + WALL / 2, y: h / 2 });
    Matter.Body.setPosition(ceiling, { x: w / 2, y: -WALL / 2 });
  };
  window.addEventListener("resize", resize);

  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("resize", resize);
    window.removeEventListener("mousemove", onMove, true);
    window.removeEventListener("mousedown", onDown, true);
    window.removeEventListener("mouseup", onUp, true);
    window.removeEventListener("touchstart", onTouch, true);
    window.removeEventListener("touchmove", onTouch, true);
    window.removeEventListener("touchend", onTouch, true);
    for (const off of listeners) off();
    for (const restore of restores) restore();
    Matter.Runner.stop(runner);
    Matter.Engine.clear(engine);
    overlay.remove();
    loose.remove();
    root.classList.remove("gravity-on");
    // Last, and only once the atoms are back in flow to hold the page up on
    // their own: releasing the height first would collapse the page under
    // whatever scroll position the page is now at.
    panel.style.height = heldHeight;
  };
}

/**
 * Runs the simulation for as long as it is switched on, and loads the engine
 * the first time it is.
 *
 * `trigger` points at the button that switched it on, so the simulation can
 * drop that button on the press rather than making you go back and hover the
 * thing you just clicked.
 */
export function useGravity(trigger: RefObject<HTMLElement | null>): {
  on: boolean;
  toggle: () => void;
} {
  const [on, setOn] = useState(false);
  const teardown = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!on) return;
    let cancelled = false;

    import("matter-js").then((mod) => {
      if (cancelled) return;
      teardown.current = run(mod.default, trigger.current);
    });

    return () => {
      cancelled = true;
      teardown.current?.();
      teardown.current = null;
    };
    // `trigger` is a ref object, which React keeps stable, so listing it
    // satisfies the rule without ever re-running the effect.
  }, [on, trigger]);

  return { on, toggle: () => setOn((v) => !v) };
}
