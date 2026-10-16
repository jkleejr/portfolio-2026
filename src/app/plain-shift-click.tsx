"use client";

// ---------------------------------------------------------------------------
// A shift-click on a link is a plain click.
//
// Left to itself the browser opens a shift-clicked link in a new window, and
// the site's own presses — a cover, a project's name, the way home, the
// Projects / About switch — stand aside for it as they do for a click meant
// for a new tab. Shift on its own is not that: it is held for other reasons,
// and a press that throws up a new window reads as the page misbehaving. So
// the click is caught on its way in and pressed again without the shift,
// which the link and whatever handles it take as an ordinary press — a study
// opening, a page changing, a link with a tab of its own opening in one.
//
// Command and control are left alone: a click with either is a deliberate
// ask for a new tab.
// ---------------------------------------------------------------------------

import { useEffect } from "react";

export function PlainShiftClick() {
  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (!e.shiftKey || e.metaKey || e.ctrlKey || e.altKey || e.button !== 0) return;
      const link = (e.target as Element).closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      e.preventDefault();
      e.stopPropagation();
      // The same click, where it was — a cover reads how far the pointer
      // moved to tell a press from a drag — with the shift let go.
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          detail: e.detail,
          screenX: e.screenX,
          screenY: e.screenY,
          clientX: e.clientX,
          clientY: e.clientY,
          button: 0,
          buttons: e.buttons,
        }),
      );
    };
    document.addEventListener("click", click, true);
    return () => document.removeEventListener("click", click, true);
  }, []);
  return null;
}
