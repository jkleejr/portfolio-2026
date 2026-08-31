"use client";

// ---------------------------------------------------------------------------
// Google Gravity.
//
// Everything on screen gets weight. Hovering something drops it; you can grab
// anything and throw it, and it still works where it lands — the theme toggle
// lying on the floor is the same button it was, so clicking it still switches
// the theme.
//
// What has not been touched is still solid. A word that falls lands on the
// line of text under it and stays there, held up by a paragraph that has not
// been hovered yet; hover that paragraph and the whole lot comes down
// together. The page comes apart in the order you touch it, and the parts of
// it you have not reached are what the rest is resting on.
//
// That is why the world is measured in PAGE coordinates rather than window
// ones, with the scroll subtracted only at the moment of drawing. What is
// standing then genuinely does not move, so a heap resting on a paragraph goes
// on resting on it however far you scroll. The floor is the one thing that
// follows you, and only downwards — see run().
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
import { usePathname } from "next/navigation";
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

type Piece = {
  el: HTMLElement;
  body: MatterType.Body;
  w: number;
  h: number;
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

/**
 * The line-height an inline atom needs so that pinning it does not move its
 * letters, or null if it is not one — anything already laying out as a block
 * keeps the leading it has, and one that has wrapped across two lines was
 * measured across both and has no single line box to correct.
 */
function inlineLeading(el: HTMLElement, rect: DOMRect): number | null {
  const cs = getComputedStyle(el);
  if (cs.display !== "inline") return null;
  if (el.getClientRects().length !== 1) return null;
  const trim =
    parseFloat(cs.paddingTop) +
    parseFloat(cs.paddingBottom) +
    parseFloat(cs.borderTopWidth) +
    parseFloat(cs.borderBottomWidth);
  const content = rect.height - trim;
  return content > 0 ? content : null;
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

  // Text that is in the layout but not on the screen — a line held at zero
  // opacity to reserve the space something else is drawn into, say. Nothing
  // invisible should fall: it would arrive as words out of nowhere.
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

  // Sleeping matters here more than in most simulations: a heap this deep
  // never quite stops solving, and the pieces at the base shuffle against each
  // other for as long as it stands — a jitter that costs a frame's work every
  // frame. Asleep, a settled heap is free and still. matter-js wakes a
  // sleeping body when something hits it; what it cannot know about is support
  // being taken away rather than arriving, which is what disturb() is for.
  const engine = Matter.Engine.create({ enableSleeping: true });
  const world = engine.world;

  // Everything that has been let go of. Only these can be woken — what is
  // still standing is static, and static bodies do not sleep.
  const fallen: MatterType.Body[] = [];

  function makeBody(x: number, y: number, w: number, h: number, disc = false) {
    const shape = {
      restitution: 0.4,
      friction: 0.5,
      frictionAir: 0.012,
    };
    const body = disc
      ? Matter.Bodies.circle(x + w / 2, y + h / 2, w / 2, shape)
      : Matter.Bodies.rectangle(x + w / 2, y + h / 2, w, h, shape);
    // Every piece starts pinned, and pinned is what "still standing" means —
    // solid, holding up whatever lands on it, and going nowhere until it is
    // touched. The flag is the whole state; drop() is the only thing that
    // lifts it.
    //
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
    // An atom that was running inline in a line of text — the breadcrumb's
    // "Home" is the one on the page — needs its leading taken off before it is
    // pinned. The box measured above is the inline one, which is only as tall
    // as the letters; position: fixed turns the element into a block, and a
    // block lays its line out at the full line-height, splitting the extra
    // above and below the letters and dropping them a couple of pixels down
    // their own box. Setting the leading to the height that was measured
    // leaves nothing to split, so the letters stay where they were standing.
    const leading = inlineLeading(el, rect);
    if (leading !== null) el.style.lineHeight = `${leading}px`;
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
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.width,
        rect.height,
        isDisc(el, rect.width, rect.height),
      ),
      w: rect.width,
      h: rect.height,
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
      body: makeBody(left + window.scrollX, top + window.scrollY, w, h),
      w,
      h,
    });
  }

  // Everything is a body from the start, standing pieces included — that is
  // the whole point of them. A word that falls has to land on the line of text
  // below it and stay there, and then go down with that line when it is
  // hovered in turn. What is still standing IS the floor of the page.
  Matter.Composite.add(
    world,
    pieces.map((p) => p.body),
  );

  // The world is the PAGE, not the window: a body's coordinates are where it
  // sits in the document, and the drawing subtracts the scroll at the last
  // moment. This is the fix for nearly everything that was going wrong.
  //
  // Before, the world was the window, so a standing piece had to be dragged
  // through it every time the page scrolled to keep it over the layout it
  // stands for. That made it a moving wall: a flick of the trackpad drove the
  // whole page through the heap at hundreds of pixels a step, and matter-js
  // was told to give it a velocity to match, so it hit like one — which is why
  // a word would shoot off the top of the screen or get slammed down, and why
  // touching anything just after a scroll flung it. In the page's own
  // coordinates a standing piece simply never moves. Scrolling is only ever a
  // change of view, and a heap resting on a paragraph rests on it for good.
  const pageW = root.clientWidth;
  const pageH = root.scrollHeight;
  const reach = () => window.scrollY + window.innerHeight;

  // The floor is the bottom of the deepest screen you have looked at, and it
  // only ever goes down. Down is safe: what is lying on it simply falls the
  // rest of the way, which is what keeps the heap at your feet as you read on
  // down the page. A floor that came back up as you scrolled back would be a
  // wall rising through everything resting on it, and that is the one motion
  // this cannot take. Scroll back up and you leave the heap where it fell, on
  // the page, which is where it belongs.
  let floorAt = reach();
  const ground = Matter.Bodies.rectangle(
    pageW / 2,
    floorAt + WALL / 2,
    pageW + WALL * 2,
    WALL,
    { isStatic: true },
  );
  // The sides run the height of the document, with a screen's slack at each
  // end so nothing can round the end of one.
  const sides = pageH + window.innerHeight * 2;
  const left = Matter.Bodies.rectangle(-WALL / 2, pageH / 2, WALL, sides, {
    isStatic: true,
  });
  const right = Matter.Bodies.rectangle(
    pageW + WALL / 2,
    pageH / 2,
    WALL,
    sides,
    {
      isStatic: true,
    },
  );
  // A lid as well as a floor, at the top of the document. Something thrown
  // hard enough would otherwise leave over the top and never come back — the
  // sides catch it sideways and the floor catches it falling, so the top was
  // the one way out.
  const ceiling = Matter.Bodies.rectangle(
    pageW / 2,
    -WALL / 2,
    pageW + WALL * 2,
    WALL,
    { isStatic: true },
  );
  Matter.Composite.add(world, [ground, left, right, ceiling]);

  /**
   * Wakes whatever has fallen and is lying against `body`.
   *
   * A settled heap sleeps, and matter-js only wakes a sleeping body when
   * something arrives to hit it. Support LEAVING is the opposite of that and
   * goes unnoticed: pull a word out from under a heap and the heap hangs there
   * in the air. So whenever a piece is about to move out from under whatever
   * is on it, the things on it are told first.
   */
  function disturb(body: MatterType.Body) {
    const near = {
      min: { x: body.bounds.min.x - 4, y: body.bounds.min.y - 4 },
      max: { x: body.bounds.max.x + 4, y: body.bounds.max.y + 4 },
    };
    for (const other of Matter.Query.region(fallen, near)) {
      Matter.Sleeping.set(other, false);
    }
  }

  // Something only starts falling once it is touched, so the page comes apart
  // under the cursor rather than all at once.
  //
  // It goes both ways: the piece starts falling, and so does anything that had
  // been resting on it. That is the whole game — a line of text holds up the
  // words that landed on it until the line itself is touched, and then the lot
  // comes down together.
  function drop(piece: Piece) {
    const { body, el } = piece;
    if (!body.isStatic) return;
    disturb(body);
    Matter.Body.setStatic(body, false);
    // And wake it. matter-js counts a body as asleep once it has not moved for
    // a second, and it does not spare the static ones — so everything still
    // standing is asleep by definition, and coming off the pin does not undo
    // that. A sleeping body ignores gravity: without this line the page would
    // come apart for one second and then stop answering the cursor entirely.
    Matter.Sleeping.set(body, false);
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
    fallen.push(body);
    // Lift it over everything still standing, so a piece that comes to rest on
    // top of the page is drawn on top of it too — the heap builds up in front
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

  // In the page's terms, like everything else in the world — otherwise what
  // you grab is off by however far you have scrolled.
  const track = (e: { clientX: number; clientY: number }) => {
    mouse.absolute.x = mouse.position.x = e.clientX + window.scrollX;
    mouse.absolute.y = mouse.position.y = e.clientY + window.scrollY;
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

  // Picking a piece up out of a heap takes it out from under whatever was on
  // it, the same as dropping one does — so the same warning goes out.
  Matter.Events.on(mouseConstraint, "startdrag", (e) => {
    const grabbed = (e as unknown as { body?: MatterType.Body }).body;
    if (grabbed) disturb(grabbed);
  });

  const runner = Matter.Runner.create();
  Matter.Runner.run(runner, engine);

  // Drawing is the one place the window comes into it: the world is in page
  // coordinates, and the scroll is subtracted here, at the last moment, to say
  // where each piece falls on the screen. A standing piece therefore holds
  // still in the page and only appears to move — which is what scrolling is.
  //
  // The scroll is read here rather than on a scroll event so the drawing lands
  // in the same frame as the scroll that caused it; a frame apart and the page
  // visibly drags behind. Read first, write after: one read of the scroll
  // position and then transforms, which do not disturb layout.
  let scrolledX = window.scrollX;
  let scrolledY = window.scrollY;
  let frame = requestAnimationFrame(function paint() {
    const x = window.scrollX;
    const y = window.scrollY;
    const moved = x !== scrolledX || y !== scrolledY;
    scrolledX = x;
    scrolledY = y;

    // Read further down the page than you have been and the floor comes with
    // you, and everything lying on it falls the rest of the way — which needs
    // saying out loud, because a heap that has settled is asleep and the floor
    // going out from under it is exactly the kind of leaving nothing notices.
    if (reach() > floorAt) {
      // Told before it moves, while it is still under them: the floor is
      // support like any other, and it is about to leave. Whatever is resting
      // on the page rather than on the floor is not woken and does not care —
      // it is held up by something that is not going anywhere.
      disturb(ground);
      floorAt = reach();
      Matter.Body.setPosition(ground, {
        x: ground.position.x,
        y: floorAt + WALL / 2,
      });
    }

    for (const piece of pieces) {
      const { el, body, w, h } = piece;
      // A standing piece has not moved and cannot have; there is nothing to
      // write unless the view it is being drawn into has changed.
      if (body.isStatic && !moved) continue;
      el.style.transform =
        `translate3d(${body.position.x - w / 2 - x}px, ${body.position.y - h / 2 - y}px, 0)` +
        ` rotate(${body.angle}rad)`;
    }
    frame = requestAnimationFrame(paint);
  });

  // Keep the sides on the edges of the page when the window changes, and let
  // the floor down to the new screen bottom if that is further than it has
  // been. It is never raised — see above.
  const resize = () => {
    const w = root.clientWidth;
    const h = root.scrollHeight;
    Matter.Body.setPosition(left, { x: -WALL / 2, y: h / 2 });
    Matter.Body.setPosition(right, { x: w + WALL / 2, y: h / 2 });
    Matter.Body.setPosition(ceiling, { x: w / 2, y: -WALL / 2 });
    disturb(ground);
    floorAt = Math.max(floorAt, reach());
    Matter.Body.setPosition(ground, { x: w / 2, y: floorAt + WALL / 2 });
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
  // The switch does not remember that it is on; it remembers WHERE it was
  // thrown, and it is on only while you are still there. Leaving the page ends
  // the game, and this is how, without a single line spent on noticing that
  // you left.
  //
  // It has to end. The switch lives in the layout, so it survives a navigation
  // that the page under it does not: the pieces stand in for a page that has
  // just been replaced, and the new one arrives hidden — gravity hides the real
  // content and draws the stand-ins over it — with nothing standing in for it.
  // That is what made a cover vanish instead of opening. It did open; it opened
  // onto a page held invisible by the simulation of the page before it.
  //
  // Come back to the page you threw it on and it is still thrown, which is the
  // same rule read the other way round: the switch belongs to the page, and
  // walking out of the room does not put the weight back into the world.
  const pathname = usePathname();
  const [thrownAt, setThrownAt] = useState<string | null>(null);
  const on = thrownAt === pathname;
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

  return {
    on,
    toggle: () => setThrownAt((at) => (at === pathname ? null : pathname)),
  };
}
