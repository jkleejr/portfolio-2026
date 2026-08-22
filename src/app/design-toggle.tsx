"use client";

// Switches which design the page shows. Both designs are in the DOM and
// `data-design` on <html> picks one, so the choice survives a reload with no
// flash of the wrong layout — the inline script in layout.tsx applies the
// stored value before first paint.
//
// The label names the design you are currently on, not the one you would
// switch to. Both labels are rendered and CSS shows the right one, for the
// same reason the theme toggle renders both a sun and a moon: the button reads
// correctly before hydration.

export function DesignToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.getAttribute("data-design") === "two" ? "one" : "two";
    root.setAttribute("data-design", next);
    localStorage.setItem("design", next);
    window.scrollTo({ top: 0 });
  }

  return (
    <button
      onClick={toggle}
      aria-label="Switch between the two portfolio designs"
      className="fixed left-6 top-6 z-20 flex h-10 items-center rounded-full border border-foreground/15 bg-background px-4 text-sm font-semibold text-foreground transition duration-200 ease-out hover:scale-105 hover:opacity-80"
    >
      <span className="design-label-two">Design 2</span>
      <span className="design-label-one">Design 1</span>
    </button>
  );
}
