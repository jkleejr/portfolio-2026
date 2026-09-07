"use client";

// ---------------------------------------------------------------------------
// A stack of cards, the top one draggable.
//
// After React Bits' <Stack />, cut down to what the covers need. The cards
// sit fanned behind one another; drag the top one far enough and it goes to
// the back, drag it less and it springs home. A short press is not a drag and
// is left to whatever wraps the stack — on the homepage that is the button
// that opens the study, so a click still means what it did.
//
// Nothing here knows what a card is. The cover hands in its own picture, and
// the study's shots behind it — see project-thumbnail.tsx.
// ---------------------------------------------------------------------------

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type StackCard = { id: string; content: ReactNode };

// How far the top card has to travel to go to the back, as a share of its
// own width. A share rather than pixels so the same pull works on the 200px
// cover and the 104px one on a phone.
const THROW = 0.4;

// A degree or two off square for the cards behind, so the pile reads as one
// rather than as a single card with a thick edge. Fixed per card, not random:
// a value drawn on every render jitters, and one drawn on the server does not
// match the one drawn in the browser.
const WOBBLE = [-3, 2, -1, 3, -2];

const SPRING = { type: "spring", stiffness: 260, damping: 20 } as const;

/**
 * Whether gravity is on — see gravity.tsx, which flags it on <html>. While it
 * is, the physics owns every cover, and a second drag under it would fight
 * the throw.
 */
function useGravityOn() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const read = () => setOn(root.classList.contains("gravity-on"));
    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return on;
}

/**
 * A finger rather than a mouse. A card that can be dragged any way takes the
 * whole touch, and the page under it stops scrolling; on a touch screen the
 * drag is held to sideways so a swipe down the covers is still a swipe.
 */
function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const read = () => setCoarse(query.matches);
    read();
    query.addEventListener("change", read);
    return () => query.removeEventListener("change", read);
  }, []);
  return coarse;
}

function DragCard({
  children,
  onSendToBack,
  drag,
}: {
  children: ReactNode;
  onSendToBack: () => void;
  drag: boolean | "x";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // The card tips toward the pull, as if lifted by that corner.
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function onDragEnd(_: unknown, info: PanInfo) {
    const limit = (ref.current?.offsetWidth ?? 200) * THROW;
    if (Math.abs(info.offset.x) > limit || Math.abs(info.offset.y) > limit) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (!drag) {
    return (
      <motion.div ref={ref} className="absolute inset-0" style={{ x: 0, y: 0 }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0"
      style={{ x, y, rotateX, rotateY }}
      drag={drag}
      // Held to where it sits, with give: it follows the hand part of the way
      // and springs back if let go short of the throw.
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      onDragEnd={onDragEnd}
    >
      {children}
    </motion.div>
  );
}

export function Stack({
  cards,
  className = "",
  ...rest
}: {
  cards: StackCard[];
  className?: string;
} & Omit<React.HTMLAttributes<HTMLDivElement>, "children">) {
  // The order is the state; the cards themselves come in fresh every render,
  // so a card whose content changes — a film starting under the pointer —
  // still draws in the place it was sent to. A card that has gone from the
  // set is dropped from the order, and one that is new to it goes on top,
  // which keeps the two in step without an effect to do it.
  const [order, setOrder] = useState(() => cards.map((c) => c.id));
  const byId = new Map(cards.map((c) => [c.id, c]));
  const kept = order.filter((id) => byId.has(id));
  const fresh = cards.map((c) => c.id).filter((id) => !kept.includes(id));
  const stack = [...kept, ...fresh];

  const gravity = useGravityOn();
  const coarse = useCoarsePointer();
  const drag = gravity ? false : coarse ? "x" : true;

  const sendToBack = (id: string) =>
    setOrder((prev) => [id, ...prev.filter((other) => other !== id)]);

  return (
    // The depth the tip is drawn in. Last in the order is drawn last, and so
    // on top.
    <div
      className={`relative ${className}`}
      style={{ perspective: 600 }}
      {...rest}
    >
      {stack.map((id, index) => {
        const card = byId.get(id)!;
        const depth = stack.length - 1 - index;
        const wobble = depth
          ? WOBBLE[cards.findIndex((c) => c.id === id) % WOBBLE.length]
          : 0;
        return (
          <DragCard key={id} onSendToBack={() => sendToBack(id)} drag={drag}>
            <motion.div
              className="h-full w-full"
              initial={false}
              animate={{
                rotateZ: depth * 4 + wobble,
                scale: 1 - depth * 0.06,
                transformOrigin: "90% 90%",
              }}
              transition={SPRING}
            >
              {card.content}
            </motion.div>
          </DragCard>
        );
      })}
    </div>
  );
}
