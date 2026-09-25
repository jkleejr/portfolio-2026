"use client";

// ---------------------------------------------------------------------------
// The Translation region card from Screen Translator, as a working copy.
//
// It stood in the study as a screenshot. Here the box on the phone can be
// dragged about, resized from the handle at its corner, and set by the two
// presets under the phone or the menu at the top right — the way it works in
// the app. The box never leaves the phone.
//
// Drawn to the screenshot it replaces (public/projects/screen-translator-
// region-card.png, a 2x capture 837px across) and measured off it: every size
// below is that capture's pixels through u(), a fraction of the card's width,
// so the whole card scales with its box like the picture did. The card is its
// own size container, and cqw is a hundredth of it.
//
// The box is kept as fractions of the phone — where its corner sits and how
// big it is — so nothing about it depends on the size it is drawn at. The
// card is always the app's dark UI, whatever theme the page is in, as the
// screenshot was.
// ---------------------------------------------------------------------------

import { useRef, useState } from "react";

/** A size off the 837px capture, as a share of the card's width. */
const u = (px: number) => `${(px / 8.37).toFixed(3)}cqw`;

type Box = { x: number; y: number; w: number; h: number };
type Mode = "custom" | "subtitle" | "full";

// Where the screenshot has it: the width of the phone, from under the island
// to about a third of the way down. The phone is 297 x 638 in the capture,
// the box's top edge 111 below the phone's and its height 160.
const START: Box = { x: 0, y: 111 / 638, w: 1, h: 160 / 638 };

const PRESETS: Record<Exclude<Mode, "custom">, Box> = {
  // The strip across the lower part of the screen that subtitles sit in.
  subtitle: { x: 0, y: 0.68, w: 1, h: 0.2 },
  full: { x: 0, y: 0, w: 1, h: 1 },
};

const LABEL: Record<Mode, string> = {
  custom: "Custom",
  subtitle: "Subtitle band",
  full: "Full screen",
};

// The smallest the box is let shrink to, as fractions of the phone — about
// the height of a line of text and a third of the width.
const MIN_W = 0.3;
const MIN_H = 0.08;
// How far one press of an arrow key moves or resizes it.
const STEP = 0.02;

const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

// The app's colours, off the capture.
const CARD = "#242426";
const ACCENT = "#8cdcff";
const TEXT = "#b5b5bb";

export function RegionDemo({ label }: { label: string }) {
  const [box, setBox] = useState<Box>(START);
  const [mode, setMode] = useState<Mode>("custom");
  // While a hand is on the box it follows the pointer exactly; the eased
  // transition is only for a preset carrying it somewhere.
  const [dragging, setDragging] = useState(false);
  const phone = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    kind: "move" | "resize";
    x: number;
    y: number;
    from: Box;
    pw: number;
    ph: number;
  } | null>(null);

  function preset(next: Mode) {
    setMode(next);
    if (next !== "custom") setBox(PRESETS[next]);
  }

  function start(kind: "move" | "resize", e: React.PointerEvent) {
    if (e.button !== 0 || !phone.current) return;
    // The handle sits on the box; a press on it is a resize and not also a
    // move.
    e.stopPropagation();
    e.preventDefault();
    const rect = phone.current.getBoundingClientRect();
    drag.current = {
      kind,
      x: e.clientX,
      y: e.clientY,
      from: box,
      pw: rect.width,
      ph: rect.height,
    };
    // Held to this element so a drag that outruns the box, or leaves the
    // card, keeps steering it.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setDragging(true);
    setMode("custom");
  }

  function move(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.x) / d.pw;
    const dy = (e.clientY - d.y) / d.ph;
    const f = d.from;
    setBox(
      d.kind === "move"
        ? {
            ...f,
            x: clamp(f.x + dx, 0, 1 - f.w),
            y: clamp(f.y + dy, 0, 1 - f.h),
          }
        : {
            ...f,
            w: clamp(f.w + dx, MIN_W, 1 - f.x),
            h: clamp(f.h + dy, MIN_H, 1 - f.y),
          },
    );
  }

  function end() {
    drag.current = null;
    setDragging(false);
  }

  // Arrow keys move the box, and with shift held resize it from the corner
  // the handle is on.
  function key(e: React.KeyboardEvent) {
    const arrows: Record<string, [number, number]> = {
      ArrowLeft: [-STEP, 0],
      ArrowRight: [STEP, 0],
      ArrowUp: [0, -STEP],
      ArrowDown: [0, STEP],
    };
    const a = arrows[e.key];
    if (!a) return;
    e.preventDefault();
    setMode("custom");
    setBox((b) =>
      e.shiftKey
        ? {
            ...b,
            w: clamp(b.w + a[0], MIN_W, 1 - b.x),
            h: clamp(b.h + a[1], MIN_H, 1 - b.y),
          }
        : {
            ...b,
            x: clamp(b.x + a[0], 0, 1 - b.w),
            y: clamp(b.y + a[1], 0, 1 - b.h),
          },
    );
  }

  const ease = dragging
    ? undefined
    : "left 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), top 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1)";

  return (
    <div
      role="group"
      aria-label={label}
      className="relative select-none overflow-hidden"
      style={{
        containerType: "inline-size",
        aspectRatio: "837 / 984",
        background: CARD,
        color: ACCENT,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* The heading: the crop mark and the card's name. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute"
        style={{ left: u(39), top: u(47), width: u(44), height: u(44) }}
      >
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </svg>
      <div
        className="absolute whitespace-nowrap font-semibold leading-none"
        style={{ left: u(106), top: u(49), fontSize: u(37) }}
      >
        Translation region
      </div>

      {/* The mode, and a menu of the three. A native select laid over the
          label, invisible, so it opens the platform's own menu — on a phone
          the wheel or the sheet, as the app's would. */}
      <div
        className="absolute flex items-center leading-none"
        style={{ right: u(36), top: u(56), fontSize: u(26), gap: u(20) }}
      >
        <span className="font-medium">{LABEL[mode]}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 26 14"
          fill="none"
          stroke="#fff"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ width: u(26), height: u(14) }}
        >
          <path d="M2 2l11 10L24 2" />
        </svg>
        <select
          aria-label="Translation region"
          value={mode}
          onChange={(e) => preset(e.target.value as Mode)}
          className="absolute inset-0 cursor-pointer opacity-0"
        >
          <option value="custom">Custom</option>
          <option value="subtitle">Subtitle band</option>
          <option value="full">Full screen</option>
        </select>
      </div>

      <p
        className="absolute m-0"
        style={{
          left: u(38),
          right: u(36),
          top: u(123),
          fontSize: u(26),
          lineHeight: u(36),
          color: TEXT,
        }}
      >
        Resize the box to choose a section of the screen. Only text inside
        the box is translated.
      </p>

      {/* The phone, and the box on it. */}
      <div
        ref={phone}
        className="absolute"
        style={{
          left: u(270),
          top: u(218),
          width: u(297),
          height: u(638),
          borderRadius: u(46),
          border: `${u(3)} solid #4d4c4e`,
          background: "#171717",
          boxSizing: "border-box",
        }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black"
          style={{ top: u(16), width: u(87), height: u(20) }}
        />
      </div>
      {/* In the card rather than in the phone so the handle, which hangs off
          the box's corner, can stand past the phone's edge — it is placed
          against the phone's box all the same. */}
      <div
        className="absolute"
        style={{ left: u(270), top: u(218), width: u(297), height: u(638) }}
      >
        <div
          tabIndex={0}
          role="application"
          aria-roledescription="movable box"
          aria-label={`Box covering ${Math.round(box.w * 100)}% of the width and ${Math.round(box.h * 100)}% of the height of the screen. Arrow keys move it; shift and the arrow keys resize it.`}
          onPointerDown={(e) => start("move", e)}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onKeyDown={key}
          className={`absolute touch-none outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          style={{
            left: `${box.x * 100}%`,
            top: `${box.y * 100}%`,
            width: `${box.w * 100}%`,
            height: `${box.h * 100}%`,
            border: `${u(5)} solid ${ACCENT}`,
            borderRadius: u(22),
            // The capture's fill over the screen, which is a paler blue than the
            // border at a quarter.
            background: "rgba(159, 215, 243, 0.25)",
            boxSizing: "border-box",
            transition: ease,
          }}
        >
          <div
            aria-hidden="true"
            onPointerDown={(e) => start("resize", e)}
            onPointerMove={move}
            onPointerUp={end}
            onPointerCancel={end}
            className="absolute flex cursor-nwse-resize touch-none items-center justify-center rounded-full"
            style={{
              right: u(-31),
              bottom: u(-31),
              width: u(58),
              height: u(58),
              background: ACCENT,
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#141414"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: u(34), height: u(34) }}
            >
              <path d="M7 7l10 10M17 9v8H9" />
            </svg>
          </div>
        </div>
      </div>

      {/* The presets. The one in force is set on a tint, as the app marks
          it; a box dragged by hand is neither. */}
      <div
        className="absolute flex items-center"
        style={{ left: u(36), top: u(881), height: u(66), gap: u(6) }}
      >
        <PresetButton
          on={mode === "subtitle"}
          onClick={() => preset("subtitle")}
          icon={
            <svg
              viewBox="0 0 32 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: u(32), height: u(30) }}
            >
              <path d="M5 2h22a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H14l-6 6v-6H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z" />
              <path d="M9 10h6M18 10h5M9 15h9M21 15h2" />
            </svg>
          }
        >
          Subtitle band
        </PresetButton>
        <PresetButton
          on={mode === "full"}
          onClick={() => preset("full")}
          icon={
            <svg
              viewBox="0 0 28 28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ width: u(28), height: u(28) }}
            >
              <path d="M3 11V3h8M3 3l8.5 8.5M25 17v8h-8M25 25l-8.5-8.5" />
            </svg>
          }
        >
          Full screen
        </PresetButton>
      </div>
    </div>
  );
}

function PresetButton({
  on,
  onClick,
  icon,
  children,
}: {
  on: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className="flex h-full cursor-pointer items-center whitespace-nowrap rounded-full leading-none transition-colors duration-200 ease-out"
      style={{
        paddingLeft: u(30),
        paddingRight: u(30),
        gap: u(24),
        fontSize: u(28),
        background: on ? "rgba(140, 220, 255, 0.23)" : "transparent",
      }}
    >
      {icon}
      {children}
    </button>
  );
}
