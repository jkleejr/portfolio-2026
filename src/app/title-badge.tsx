// ---------------------------------------------------------------------------
// The marks that sit after the name of a project: the App Store, for one that
// shipped, and a chain link, for one with a site of its own.
//
// Sized in em rather than pixels, so it is the same fraction of whatever
// heading it follows — smaller after a project's name on the homepage than
// after the title of its case study, and in step with both if either changes.
//
// It links when there is somewhere to send people and is a plain mark when
// there is not, which is the state a project sits in between being on the
// store and having its link written down.
// ---------------------------------------------------------------------------

import Image from "next/image";
import { LinkGlyph } from "./link-glyph";

/**
 * The anchor both marks are hung in. Opens in a tab of its own, and says where
 * it goes rather than leaving a screen reader to read out an image.
 */
function MarkLink({
  href,
  label,
  gap = "ml-2",
  children,
}: {
  href: string;
  label: string;
  /** The space between the last word and the mark. */
  gap?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className={`${gap} inline-block transition duration-200 ease-out hover:opacity-80`}
    >
      {children}
    </a>
  );
}

/**
 * The project's own site. The same chain the title of its case study carries,
 * from the one definition — an icon that is nearly the same as another reads
 * as a mistake, and a drawn glyph holds its weight where a picture of one
 * thickens as it is scaled down.
 */
export function SiteBadge({ href, label }: { href: string; label: string }) {
  // Sat a little tighter to the title than the App Store mark: the chain is
  // drawn in outline and reads as further off the last word than a filled mark
  // at the same distance.
  return (
    <MarkLink href={href} label={`${label} website`} gap="ml-1.5">
      {/* An inline box rests its bottom edge on the baseline, which puts the
          glyph's centre near the middle of the title's capitals. This lifts it
          a hair off that — the ink reads low at this size, since the chain
          runs corner to corner and leaves its box emptiest at the top. */}
      <LinkGlyph className="inline-block h-[0.7em] w-[0.7em] -translate-y-[0.03em]" />
    </MarkLink>
  );
}

export function AppStoreBadge({
  href,
  label,
}: {
  /** The listing. Undefined or empty renders the mark without a link. */
  href?: string;
  /** The project's name, for what a screen reader says. */
  label: string;
}) {
  const mark = (
    <Image
      src="/app-store.png"
      alt=""
      width={135}
      height={128}
      // Raised off the baseline to sit level with the letters rather than
      // stand on them. An inline box rests its bottom edge on the baseline, so
      // a 0.85em mark next to caps about 0.7em tall hangs low by half the
      // difference — which is what this takes back, centring the two.
      className="inline-block h-[0.85em] w-auto -translate-y-[0.08em]"
      aria-hidden
    />
  );

  if (!href) return <span className="ml-2 inline-block">{mark}</span>;

  return (
    <MarkLink href={href} label={`${label} on the App Store`}>
      {mark}
    </MarkLink>
  );
}
