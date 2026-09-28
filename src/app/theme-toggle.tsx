"use client";

// The light/dark switch at the foot of the homepage, first in the row of
// links. The choice is kept in localStorage under "theme" and put back before
// first paint by the inline script in layout.tsx, so a reload never flashes
// the other palette.
//
// Which icon shows is left to CSS off data-theme (.theme-icon-* in
// globals.css) rather than React state: the server cannot know what was
// stored, so rendering the icon from state would draw the wrong one until
// hydration.

// --background in globals.css, for the browser's own bars — see themeColor in
// layout.tsx.
const THEME_COLOR = { light: "#ffffff", dark: "#0a0a0a" };

// The strips the browser paints outside the page — on a phone the status bar
// at the top and Safari's toolbar at the foot — take their colour from the
// html element's background and from theme-color, and both sit outside the
// view transition's snapshot. Left alone they would flip the moment the
// palette does, a full shade ahead of the page fading under them. So the html
// background is animated here over the fade's own 0.6s ease-in-out (see
// ::view-transition-* in globals.css), and theme-color is written from it on
// every frame, so the whole screen turns together.
function fadeBars(
  root: HTMLElement,
  meta: Element | null,
  from: string,
  to: string,
) {
  const fade = root.animate(
    { backgroundColor: [from, to] },
    { duration: 600, easing: "ease-in-out" },
  );
  if (!meta) return;
  const tick = () => {
    if (fade.playState !== "running") {
      meta.setAttribute("content", to);
      return;
    }
    meta.setAttribute("content", getComputedStyle(root).backgroundColor);
    requestAnimationFrame(tick);
  };
  tick();
}

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    const meta = document.querySelector('meta[name="theme-color"]');
    const apply = () => {
      root.setAttribute("data-theme", next);
      meta?.setAttribute("content", THEME_COLOR[next]);
    };
    try {
      localStorage.setItem("theme", next);
    } catch {}

    // A cross-fade from the old palette to the new one: the browser snapshots
    // the page either side of the switch and fades between the two (the
    // timing is ::view-transition-* in globals.css). One fade covers every
    // colour on the page at once, where a transition on each element would
    // have to be kept in step by hand. Where the browser has no view
    // transitions, or motion is not wanted, the switch is instant.
    if (
      !document.startViewTransition ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      apply();
      return;
    }
    document.startViewTransition(() => {
      apply();
      fadeBars(
        root,
        meta,
        THEME_COLOR[next === "dark" ? "light" : "dark"],
        THEME_COLOR[next],
      );
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark mode"
      className="flex cursor-pointer items-center self-center transition-colors duration-200 ease-out hover:text-accent"
    >
      {/* Sun, shown in light mode. */}
      <svg
        className="theme-icon-sun size-5 sm:size-[22px]"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      {/* Moon, shown in dark mode. */}
      <svg
        className="theme-icon-moon size-[19px] sm:size-[21px]"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  );
}
