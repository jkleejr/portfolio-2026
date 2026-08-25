"use client";

import { useLayoutEffect } from "react";

// Must match the theme-wave animation duration in globals.css.
const WAVE_MS = 310;

// iOS Safari tints the strips outside the page — the status bar at the top and
// the toolbar at the bottom — from <meta name="theme-color">. Those strips sit
// outside the view transition's snapshot, so they are not covered by the wave
// and a plain theme swap makes them jump instantly while the wave is still
// sweeping. Easing theme-color across the wave's duration keeps them in step.
//
// A CSS transition on the root background cannot do this job: once theme-color
// is present Safari stops sampling the page and follows the meta tag alone.

function themeColorMeta(): HTMLMetaElement {
  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }
  return meta;
}

/** Current --background, resolved to [r, g, b]. */
function backgroundRgb(): [number, number, number] | null {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue("--background")
    .trim();
  const hex = value.replace("#", "");
  const full =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex;
  if (full.length !== 6 || !/^[0-9a-f]{6}$/i.test(full)) return null;
  return [
    parseInt(full.slice(0, 2), 16),
    parseInt(full.slice(2, 4), 16),
    parseInt(full.slice(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
}

function animateThemeColor(
  from: [number, number, number] | null,
  to: [number, number, number] | null,
) {
  const meta = themeColorMeta();
  if (!to) return;
  if (!from || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    meta.setAttribute("content", toHex(to));
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / WAVE_MS);
    const eased = t * t; // ease-in, matching the wave
    const mix = from.map((v, i) => Math.round(v + (to[i] - v) * eased)) as [
      number,
      number,
      number,
    ];
    meta.setAttribute("content", toHex(mix));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

export function ThemeToggle() {
  // Re-apply after React clears the attribute on the dev Strict Mode remount.
  // This is a no-op in production.
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) document.documentElement.setAttribute("data-theme", theme);
    // Arm the root background transition only now, so the theme applied by the
    // inline script before first paint lands instantly instead of fading in.
    document.documentElement.classList.add("theme-ready");
    animateThemeColor(null, backgroundRgb());
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget;
    const from = backgroundRgb();

    const applyTheme = () => {
      const current =
        document.documentElement.getAttribute("data-theme") ?? "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      // Reading the computed value here forces the recalc, so this picks up
      // the theme just applied rather than the one being replaced.
      animateThemeColor(from, backgroundRgb());
    };

    // Replay the icon animation on every click. The class comes off again in
    // onAnimationEnd below — left on, it would re-fire the shake the next time
    // the button re-entered the display tree, since that restarts an
    // element's animations.
    button.classList.remove("theme-toggled");
    void button.offsetWidth;
    button.classList.add("theme-toggled");

    const doc = document as Document & {
      startViewTransition?: (update: () => void) => { ready: Promise<void> };
    };
    if (!doc.startViewTransition) {
      applyTheme();
      return;
    }

    // Circular reveal: the new theme sweeps out from the button. The
    // center is passed to the theme-wave keyframes as percentages so it
    // stays anchored regardless of the snapshot's pixel space.
    const rect = button.getBoundingClientRect();
    const x = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const y = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
    const root = document.documentElement;
    root.style.setProperty("--wave-x", `${x}%`);
    root.style.setProperty("--wave-y", `${y}%`);

    // Aborted transitions (rapid clicks, hidden tab) still apply the
    // theme — the reveal is just skipped.
    doc.startViewTransition(applyTheme).ready.catch(() => {});
  }

  return (
    <button
      onClick={toggle}
      onAnimationEnd={(e) => e.currentTarget.classList.remove("theme-toggled")}
      aria-label="Switch between dark and light mode"
      className="theme-toggle flex h-10 w-10 shrink-0 items-center justify-center text-foreground transition duration-200 ease-out hover:opacity-80"
    >
      {/* Sun — shown in light mode */}
      <svg
        className="theme-icon-sun"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon — shown in dark mode */}
      <svg
        className="theme-icon-moon"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
