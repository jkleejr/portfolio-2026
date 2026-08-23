import { CaseStudyProvider } from "./case-study";
import { DesignOne } from "./design-one";

// The provider wraps the page so a thumbnail anywhere in it opens its case
// study the same way.
export default function Home() {
  return (
    <CaseStudyProvider>
      <DesignOne />
    </CaseStudyProvider>
  );
}
