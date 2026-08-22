"use client";

// Switches which design the page shows. Both designs are in the DOM and
// `data-design` on <html> picks one, so the choice survives a reload with no
// flash of the wrong layout — the inline script in layout.tsx applies the
// stored value before first paint.
//
// The label is the number of the design you are currently on, not the one you
// would switch to. Both numbers are rendered and CSS positions the right one,
// for the same reason the theme toggle renders both a sun and a moon: the
// button reads correctly before hydration. That also gives the press its
// animation for free — see .design-roll in globals.css, where flipping
// data-design is what makes the numbers roll past each other.

export function DesignToggle() {
  function toggle(e: React.MouseEvent<HTMLButtonElement>) {
    // The roll is scoped to this class so the number sits still on load and
    // only animates once the button has actually been pressed.
    e.currentTarget.classList.add("design-rolling");

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
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/15 bg-background text-sm font-bold text-foreground transition duration-200 ease-out hover:scale-110 hover:opacity-80"
    >
      <span className="design-roll">
        <span className="design-label-two">2</span>
        <span className="design-label-one">1</span>
      </span>
    </button>
  );
}
