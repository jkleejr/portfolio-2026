// ---------------------------------------------------------------------------
// The chain that says a title leads somewhere off this site.
//
// One definition, drawn in two paths and stroked in currentColor, so the mark
// after a project's name on the homepage and the mark after the title of its
// case study are the same mark — the same weight, the same colour, sharp at
// any size, and following the page through a theme switch.
// ---------------------------------------------------------------------------

export function LinkGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
