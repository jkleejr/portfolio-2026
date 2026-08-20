import { site } from "@/data/site";
import { entries } from "@/data/projects";
import { CaseStudyProvider, ProjectThumbnail } from "./case-study";

const BUTTON_ICONS: Record<string, React.ReactNode> = {
  // LinkedIn "in" mark in brand blue
  linkedin: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="#0a66c2" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
  // GitHub mark in the current text color
  github: (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
};

export default function Home() {
  return (
    <CaseStudyProvider>
      <main className="mx-auto max-w-[820px] px-6 pb-28 pt-20 md:pt-28">
        {/* Intro */}
        <h1 className="text-2xl font-bold">{site.name}</h1>
        <p className="mt-1 text-lg font-medium text-foreground">{site.role}</p>

        <p className="mt-8 max-w-[68ch] text-lg leading-relaxed text-foreground">
          {site.bio}
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          {site.buttons.map((button) => {
            const icon = "icon" in button ? BUTTON_ICONS[button.icon] : null;
            return (
              <a
                key={button.label}
                href={button.href}
                target="_blank"
                rel="noreferrer"
                aria-label={button.label}
                className={`flex items-center justify-center rounded-lg border border-foreground/15 bg-foreground/[0.04] font-semibold text-foreground transition duration-200 ease-out hover:scale-105 hover:opacity-80 ${
                  icon ? "px-3.5 py-2.5" : "px-5 py-2.5"
                }`}
              >
                {icon ?? button.label}
              </a>
            );
          })}
        </div>

        {/* Currently working on */}
        <h2 className="mt-24 text-lg font-bold">{site.sectionHeading}</h2>

        <div className="mt-12 space-y-16">
          {entries.map((entry) => (
            <div
              key={entry.title}
              className="grid grid-cols-[3.5rem_1fr] gap-x-5 md:ml-2"
            >
              <div>
                {entry.icon && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.icon}
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover"
                  />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold">
                  {entry.titleHref ? (
                    <a
                      href={entry.titleHref}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4 hover:opacity-80"
                    >
                      {entry.title}
                    </a>
                  ) : (
                    entry.title
                  )}
                </h3>
                <p className="mt-2 max-w-[62ch] text-lg leading-relaxed text-foreground">
                  {entry.description}
                  {entry.link && (
                    <>
                      {" "}
                      <a
                        href={entry.link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-foreground underline underline-offset-4 hover:opacity-80"
                      >
                        {entry.link.label}
                      </a>
                    </>
                  )}
                </p>
                {entry.images && entry.images.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-4">
                    {entry.images.map((image, i) => (
                      <ProjectThumbnail
                        key={i}
                        image={image}
                        slug={entry.slug}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </CaseStudyProvider>
  );
}
