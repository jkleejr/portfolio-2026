// ---------------------------------------------------------------------------
// The App Store mark, which sits after the name of a project that shipped.
//
// Sized in em rather than pixels, so it is the same fraction of whatever
// line it follows.
// ---------------------------------------------------------------------------

import Image from "next/image";

/**
 * The App Store mark on its own, for a link that already says where it goes —
 * a study's title that opens the listing carries this in place of its chain.
 */
export function AppStoreMark({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/app-store.png"
      alt=""
      width={135}
      height={128}
      className={`inline-block h-[0.85em] w-auto ${className}`}
      aria-hidden
    />
  );
}
