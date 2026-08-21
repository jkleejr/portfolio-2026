import { CaseStudyProvider } from "./case-study";
import { DesignOne } from "./design-one";
import { DesignTwo } from "./design-two";

// Both designs render; `data-design` on <html> decides which one is visible
// (see globals.css). Keeping them side by side means the alternative can be
// reworked freely without any risk to design one, and the switch is instant.
//
// One provider wraps both, so a case study opens the same way from either.
export default function Home() {
  return (
    <CaseStudyProvider>
      <div data-design-panel="one">
        <DesignOne />
      </div>
      <div data-design-panel="two">
        <DesignTwo />
      </div>
    </CaseStudyProvider>
  );
}
