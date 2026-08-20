"use client";

import { useLayoutEffect } from "react";

export function ThemeToggle() {
  // Re-apply after React clears the attribute on the dev Strict Mode remount.
  // This is a no-op in production.
  useLayoutEffect(() => {
    const theme = localStorage.getItem("theme");
    if (theme) document.documentElement.setAttribute("data-theme", theme);
  }, []);

  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    const button = e.currentTarget;

    const applyTheme = () => {
      const current =
        document.documentElement.getAttribute("data-theme") ?? "dark";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    };

    // Replay the icon animation on every click
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
      aria-label="Switch between dark and light mode"
      className="fixed right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 bg-background text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
    >
      {/* Sun — shown in light mode */}
      <svg
        className="theme-icon-sun"
        width="18"
        height="18"
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
        width="18"
        height="18"
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
