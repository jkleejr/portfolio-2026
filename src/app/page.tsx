import { CaseStudyProvider } from "./case-study";
import { DesignOne } from "./design-one";
import { DesignTwo } from "./design-two";
import { Blog } from "./blog";

// Both designs render; `data-design` on <html> decides which one is visible
// (see globals.css). Keeping them side by side means the alternative can be
// reworked freely without any risk to design one, and the switch is instant.
//
// The blog sits alongside them on the same terms, under `data-view` rather
// than `data-design` — it is not a third design, it replaces whichever design
// is showing and hands you back to it.
//
// One provider wraps them all, so a case study opens the same way from either
// design.
export default function Home() {
  return (
    <CaseStudyProvider>
      <div data-design-panel="one">
        <DesignOne />
      </div>
      <div data-design-panel="two">
        <DesignTwo />
      </div>
      <div data-view-panel="blog">
        <Blog />
      </div>
    </CaseStudyProvider>
  );
}
