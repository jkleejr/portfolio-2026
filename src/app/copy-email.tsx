"use client";

// ---------------------------------------------------------------------------
// The email in the footer. Pressing it copies the address rather than opening
// a mail app, and a small "Copied ✓" appears just above the pointer to say it
// worked, then fades.
//
// The note is only shown once the copy has actually succeeded. It is put on
// <body> rather than beside the button, so nothing the footer sits in (the
// gravity effect moves these links around) can shift where it lands. A press
// from the keyboard has no pointer to follow, so the note sits over the
// button instead.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// How long the note stays before it fades.
const HOLD = 1000;

// True in the browser and false on the server, where there is no <body> to
// put the note on yet.
const noop = () => () => {};
const useInBrowser = () =>
  useSyncExternalStore(noop, () => true, () => false);

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers, or a page that is not allowed the clipboard: the old way.
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  }
}

export function CopyEmail({
  email,
  className,
  children,
}: {
  email: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [note, setNote] = useState<{ x: number; y: number; shown: boolean }>({
    x: 0,
    y: 0,
    shown: false,
  });
  const mounted = useInBrowser();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // detail is 0 for a press from the keyboard, which has no pointer.
    const box = e.currentTarget.getBoundingClientRect();
    const at =
      e.detail > 0
        ? { x: e.clientX, y: e.clientY }
        : { x: box.left + box.width / 2, y: box.top };
    if (!(await copy(email))) return;
    // Kept on the screen: a press at the far edge of a phone would otherwise
    // hang half the note off it. 44px is half the note and a margin.
    at.x = Math.min(Math.max(at.x, 44), window.innerWidth - 44);
    clearTimeout(timer.current);
    setNote({ ...at, shown: true });
    timer.current = setTimeout(
      () => setNote((n) => ({ ...n, shown: false })),
      HOLD,
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        aria-label={`Copy email address, ${email}`}
        className={`cursor-pointer ${className ?? ""}`}
      >
        {children}
      </button>
      {/* Said out loud separately: a screen reader announces this when its
          words change, and the note on screen keeps its words while it fades. */}
      <span role="status" className="sr-only">
        {note.shown ? "Email address copied" : ""}
      </span>
      {mounted &&
        createPortal(
          <div
            aria-hidden
            data-show={note.shown}
            className="copied-note"
            style={{ left: note.x, top: note.y }}
          >
            Copied
            {/* A check in place of the exclamation mark, drawn rather than
                typed so it is the same shape in every font. */}
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="copied-check"
            >
              <path d="M3 8.5l3.2 3.2L13 5" />
            </svg>
          </div>,
          document.body,
        )}
    </>
  );
}
