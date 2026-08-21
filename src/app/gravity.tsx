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
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import type MatterType from "matter-js";

// Walls sit this far outside the viewport so fast-moving bodies cannot tunnel
// through them between physics steps.
const WALL = 400;

// Anything interactive or drawn falls as one piece rather than word by word.
const ATOMS = "a, button, img";

type WordStyle = {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  letterSpacing: string;
  color: string;
  textTransform: string;
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

function onScreen(r: DOMRect): boolean {
  return !(
    r.bottom < 0 ||
    r.top > window.innerHeight ||
    r.right < 0 ||
    r.left > window.innerWidth ||
    !r.width ||
    !r.height
  );
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
      onScreen(el.getBoundingClientRect()) &&
      !found.some((other) => other !== el && other.contains(el)),
  );
}

/**
 * Every word of visible text in `root` that is not already inside an atom,
 * with the position it currently occupies. Words off screen are skipped:
 * scrolling is locked while gravity runs, so they could never be reached.
 */
function snapshotWords(root: HTMLElement, atoms: HTMLElement[]): Snapshot[] {
  const out: Snapshot[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const styles = new Map<Element, WordStyle>();
  const range = document.createRange();
  const theme = themeColors();

  let node = walker.nextNode() as Text | null;
  while (node) {
    const parent = node.parentElement;
    const text = node.nodeValue ?? "";
    const inAtom = parent ? atoms.some((a) => a.contains(parent)) : false;

    if (parent && !inAtom && /\S/.test(text)) {
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
        if (!onScreen(r)) continue;
        out.push({ text: match[0], left: r.left, top: r.top, css });
      }
    }

    node = walker.nextNode() as Text | null;
  }

  return out;
}

/** Builds the whole simulation. The returned function tears it back down. */
function run(Matter: typeof MatterType, exit: () => void): () => void {
  const design = document.documentElement.getAttribute("data-design") ?? "one";
  const panel = document.querySelector<HTMLElement>(
    `[data-design-panel="${design}"]`,
  );
  if (!panel) return () => {};

  // The floating toggles are outside the page content but still on screen, so
  // they fall too. The gravity button itself stays anchored — it is the way
  // out, and chasing it across the floor to switch the effect off is a joke
  // that only lands once.
  const floating = [
    ...document.querySelectorAll<HTMLElement>('[data-gravity="atom"]'),
  ];

  const atoms = collectAtoms([panel, ...floating]);
  const words = snapshotWords(panel, atoms);
  if (!atoms.length && !words.length) return () => {};

  // Measured before anything moves: pinning the atoms reflows the page.
  const atomRects = atoms.map((el) => el.getBoundingClientRect());

  const overlay = document.createElement("div");
  overlay.className = "gravity-overlay";
  document.body.appendChild(overlay);
  document.documentElement.classList.add("gravity-on");

  const engine = Matter.Engine.create();
  const world = engine.world;

  function makeBody(x: number, y: number, w: number, h: number) {
    const body = Matter.Bodies.rectangle(x + w / 2, y + h / 2, w, h, {
      restitution: 0.4,
      friction: 0.5,
      frictionAir: 0.012,
    });
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
      body: makeBody(rect.left, rect.top, rect.width, rect.height),
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
  for (const word of words) {
    const el = document.createElement("span");
    el.className = "gravity-word";
    el.textContent = word.text;
    Object.assign(el.style, word.css);
    overlay.appendChild(el);
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.transform = `translate3d(${word.left}px, ${word.top}px, 0)`;
    pieces.push({ el, body: makeBody(word.left, word.top, w, h), w, h });
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
  Matter.Composite.add(world, [ground, left, right]);

  // Something only starts falling once it is touched, so the page comes apart
  // under the cursor rather than all at once.
  function drop(body: MatterType.Body) {
    if (!body.isStatic) return;
    Matter.Body.setStatic(body, false);
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.15);
  }

  const listeners: Array<() => void> = [];
  for (const piece of pieces) {
    const wake = () => drop(piece.body);
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

  let frame = requestAnimationFrame(function paint() {
    for (const { el, body, w, h } of pieces) {
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
  };
  window.addEventListener("resize", resize);

  // Switching design swaps the page out from under the simulation, so gravity
  // stands down rather than animating elements that are no longer shown.
  const watcher = new MutationObserver(exit);
  watcher.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-design"],
  });

  return () => {
    cancelAnimationFrame(frame);
    watcher.disconnect();
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
    document.documentElement.classList.remove("gravity-on");
  };
}

export function Gravity() {
  const [on, setOn] = useState(false);
  const teardown = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!on) return;
    let cancelled = false;

    import("matter-js").then((mod) => {
      if (cancelled) return;
      teardown.current = run(mod.default, () => setOn(false));
    });

    return () => {
      cancelled = true;
      teardown.current?.();
      teardown.current = null;
    };
  }, [on]);

  return (
    <button
      onClick={() => setOn((v) => !v)}
      aria-pressed={on}
      aria-label="Turn gravity on and off"
      title={on ? "Turn gravity off" : "Turn gravity on — then hover anything"}
      className={`fixed right-6 top-[4.5rem] z-40 flex h-10 w-10 items-center justify-center rounded-full border transition duration-200 ease-out hover:scale-110 hover:opacity-80 ${
        on
          ? "border-transparent bg-foreground text-background"
          : "border-foreground/15 bg-background text-foreground"
      }`}
    >
      {/* A figure mid-fall. Drawn as a mask filled with currentColor, so it
          inverts with the button instead of needing a second asset. */}
      <span className="gravity-icon" aria-hidden />
    </button>
  );
}
