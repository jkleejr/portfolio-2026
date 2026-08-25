"use client";

// ---------------------------------------------------------------------------
// ImageTrail, from React Bits (reactbits.dev/animations/image-trail), the
// JavaScript + CSS variant ported to TypeScript. Vendored rather than
// installed, for the same reason as Ribbons: it is a copy-paste component,
// not a package.
//
// Changes from upstream:
//   * "use client" and TypeScript types — upstream ships plain JS for Vite.
//   * `items` dropped from the effect's dependencies. Upstream lists it, so a
//     caller passing an inline array tears the whole trail down and rebuilds
//     it on every render. The images are read from the DOM after React has
//     rendered them, so the class only needs rebuilding when `variant` does.
//   * the pointer listeners moved from the container to the window, the same
//     change Ribbons needed: the trail is mounted in a pointer-events:none
//     overlay so it can draw over the page without swallowing clicks, and an
//     element that takes no pointer events sees no mousemove either.
//   * Styles live in globals.css under "Photo gallery trail" rather than the
//     component's own ImageTrail.css, to keep this app on one stylesheet. The
//     class names are prefixed `image-trail__` there and here — upstream's
//     bare `.content` is too generic to drop into a shared stylesheet.
//
// All eight variants are kept, so the gallery can be re-pointed at any of them
// by changing one prop.
// ---------------------------------------------------------------------------

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

function lerp(a: number, b: number, n: number): number {
  return (1 - n) * a + n * b;
}

type Point = { x: number; y: number };

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect): Point {
  let clientX = 0;
  let clientY = 0;
  if ("touches" in e && e.touches.length > 0) {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  } else if ("clientX" in e) {
    clientX = e.clientX;
    clientY = e.clientY;
  }
  return { x: clientX - rect.left, y: clientY - rect.top };
}

function getMouseDistance(p1: Point, p2: Point): number {
  return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}

class ImageItem {
  DOM: { el: HTMLElement; inner: HTMLElement | null };
  defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
  rect: DOMRect | null = null;
  resize: () => void;

  constructor(el: HTMLElement) {
    this.DOM = {
      el,
      inner: el.querySelector(".image-trail__img-inner"),
    };
    this.getRect();
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener("resize", this.resize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  destroy() {
    window.removeEventListener("resize", this.resize);
  }
}

/**
 * Everything the eight variants share: the image list, the pointer tracking,
 * and the rAF loop that fires showNextImage() once the pointer has travelled
 * far enough. Each variant supplies only its own showNextImage().
 */
abstract class ImageTrailBase {
  container: HTMLElement;
  images: ImageItem[];
  imagesTotal: number;
  rafId: number | null = null;
  destroyed = false;
  // Starts before the list rather than on it: nextImage() advances first and
  // then reads, so a 0 here would skip the first item and open the trail on
  // the second. -1 makes the order photos are listed in the order they show.
  imgPosition = -1;
  zIndexVal = 1;
  activeImagesCount = 0;
  isIdle = true;
  threshold = 80;
  /** How hard the trailing point chases the pointer; variants 6 and 7 lead. */
  ease = 0.1;
  mousePos: Point = { x: 0, y: 0 };
  lastMousePos: Point = { x: 0, y: 0 };
  cacheMousePos: Point = { x: 0, y: 0 };
  private handlePointerMove: (e: MouseEvent | TouchEvent) => void;
  private initRender: (e: MouseEvent | TouchEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.images = [
      ...container.querySelectorAll<HTMLElement>(".image-trail__img"),
    ].map((img) => new ImageItem(img));
    this.imagesTotal = this.images.length;

    this.handlePointerMove = (e) => {
      this.mousePos = getLocalPointerPos(e, container.getBoundingClientRect());
    };
    // The loop only starts once the pointer has been somewhere, so the first
    // image appears at the cursor rather than flying in from the corner.
    this.initRender = (e) => {
      this.mousePos = getLocalPointerPos(e, container.getBoundingClientRect());
      this.cacheMousePos = { ...this.mousePos };
      this.rafId = requestAnimationFrame(() => this.render());
      window.removeEventListener("mousemove", this.initRender);
      window.removeEventListener("touchmove", this.initRender);
    };

    window.addEventListener("mousemove", this.handlePointerMove);
    window.addEventListener("touchmove", this.handlePointerMove);
    window.addEventListener("mousemove", this.initRender);
    window.addEventListener("touchmove", this.initRender);
  }

  render() {
    if (this.destroyed) return;
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, this.ease);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, this.ease);
    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }
    if (this.isIdle && this.zIndexVal !== 1) this.zIndexVal = 1;
    this.rafId = requestAnimationFrame(() => this.render());
  }

  /** Advances the cycle and hands back the image that should appear next. */
  protected nextImage(): ImageItem {
    ++this.zIndexVal;
    this.imgPosition =
      this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;
    const img = this.images[this.imgPosition];
    gsap.killTweensOf(img.DOM.el);
    return img;
  }

  abstract showNextImage(): void;

  onImageActivated = () => {
    this.activeImagesCount++;
    this.isIdle = false;
  };

  onImageDeactivated = () => {
    this.activeImagesCount--;
    if (this.activeImagesCount === 0) this.isIdle = true;
  };

  destroy() {
    this.destroyed = true;
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    window.removeEventListener("mousemove", this.handlePointerMove);
    window.removeEventListener("touchmove", this.handlePointerMove);
    window.removeEventListener("mousemove", this.initRender);
    window.removeEventListener("touchmove", this.initRender);
    this.images.forEach((img) => {
      gsap.killTweensOf(img.DOM.el);
      img.destroy();
    });
  }
}

/** Slides in at full size, then fades and shrinks away. */
class ImageTrailVariant1 extends ImageTrailBase {
  showNextImage() {
    const img = this.nextImage();
    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
        },
        0,
      )
      .to(
        img.DOM.el,
        { duration: 0.4, ease: "power3", opacity: 0, scale: 0.2 },
        0.4,
      );
  }
}

/** Pops open from nothing, with the photo inside settling out of a flare. */
/**
 * How long a photo takes to leave, once something has replaced it. Upstream
 * ran this on a timer from the moment the photo arrived; here nothing is on a
 * timer — see ImageTrailVariant2.
 */
const VARIANT_2_EXIT = 0.4;

/**
 * The photo that is up stays up. Nothing leaves on a clock: a photo holds at
 * full size for as long as the pointer is still, however long that is, and
 * only starts to go once the next move has brought its replacement in. Stop
 * moving and the picture under the cursor simply stays.
 */
class ImageTrailVariant2 extends ImageTrailBase {
  /** What is currently on screen, and so what the next move will send away. */
  private standing: ImageItem | null = null;

  showNextImage() {
    const img = this.nextImage();
    const leaving = this.standing;
    this.standing = img;

    if (leaving && leaving !== img) {
      gsap.to(leaving.DOM.el, {
        duration: VARIANT_2_EXIT,
        ease: "power2",
        opacity: 0,
        scale: 0.2,
        onComplete: this.onImageDeactivated,
      });
    }

    gsap
      .timeline({ onStart: this.onImageActivated })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2.8, filter: "brightness(250%)" },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          filter: "brightness(100%)",
        },
        0,
      );
  }
}

/** Pops open, then floats up and out of frame. */
class ImageTrailVariant3 extends ImageTrailBase {
  showNextImage() {
    const img = this.nextImage();
    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          xPercent: 0,
          yPercent: 0,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        { scale: 1.2 },
        { duration: 0.4, ease: "power1", scale: 1 },
        0,
      )
      .to(
        img.DOM.el,
        {
          duration: 0.6,
          ease: "power2",
          opacity: 0,
          scale: 0.2,
          xPercent: () => gsap.utils.random(-30, 30),
          yPercent: -200,
        },
        0.6,
      );
  }
}

/** Pops open, flares with the pointer's speed, then coasts on past it. */
class ImageTrailVariant4 extends ImageTrailBase {
  showNextImage() {
    const img = this.nextImage();
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 100;
    dy *= distance / 100;
    const punch = Math.max((400 * distance) / 100, 100);

    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        {
          scale: 2,
          filter: `brightness(${punch}%) contrast(${punch}%)`,
        },
        {
          duration: 0.4,
          ease: "power1",
          scale: 1,
          filter: "brightness(100%) contrast(100%)",
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power3", opacity: 0 }, 0.4)
      .to(
        img.DOM.el,
        { duration: 1.5, ease: "power4", x: `+=${dx * 110}`, y: `+=${dy * 110}` },
        0.05,
      );
  }
}

/** Banks into the direction of travel, like cards dealt along the pointer. */
class ImageTrailVariant5 extends ImageTrailBase {
  lastAngle = 0;

  showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    if (angle < 0) angle += 360;
    if (angle > 90 && angle <= 270) angle += 180;
    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    const startAngle = isMovingClockwise ? angle - 10 : angle + 10;

    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }
    dx *= distance / 150;
    dy *= distance / 150;

    const img = this.nextImage();
    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          filter: "brightness(80%)",
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
          rotation: startAngle,
        },
        {
          duration: 1,
          ease: "power2",
          scale: 1,
          filter: "brightness(100%)",
          x: this.mousePos.x - img.rect!.width / 2 + dx * 70,
          y: this.mousePos.y - img.rect!.height / 2 + dy * 70,
          rotation: this.lastAngle,
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "expo", opacity: 0 }, 0.5)
      .to(
        img.DOM.el,
        { duration: 1.5, ease: "power4", x: `+=${dx * 120}`, y: `+=${dy * 120}` },
        0.05,
      );
  }
}

/** Size, brightness, blur and colour all ride on how fast you are moving. */
class ImageTrailVariant6 extends ImageTrailBase {
  ease = 0.3;

  private map(speed: number, min: number, max: number, maxSpeed: number) {
    return min + (max - min) * Math.min(speed / maxSpeed, 1);
  }

  showNextImage() {
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);

    const scaleFactor = this.map(speed, 0.3, 2, 200);
    const brightness = this.map(speed, 0, 1.3, 70);
    const blur = this.map(speed, 20, 0, 90);
    const grayscale = this.map(speed, 600, 0, 90);

    const img = this.nextImage();
    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
        },
        {
          duration: 0.8,
          ease: "power3",
          scale: scaleFactor,
          filter: `grayscale(${grayscale * 100}%) brightness(${brightness * 100}%) blur(${blur}px)`,
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2 },
        { duration: 0.8, ease: "power3", scale: 1 },
        0,
      )
      .to(
        img.DOM.el,
        { duration: 0.4, ease: "power3.in", opacity: 0, scale: 0.2 },
        0.45,
      );
  }
}

function getNewPosition(position: number, offset: number, length: number) {
  const realOffset = Math.abs(offset) % length;
  return position - realOffset >= 0
    ? position - realOffset
    : length - (realOffset - position);
}

/** Leaves a standing pile behind: images stay until nine newer ones exist. */
class ImageTrailVariant7 extends ImageTrailBase {
  ease = 0.3;
  visibleImagesCount = 0;
  visibleImagesTotal: number;

  constructor(container: HTMLElement) {
    super(container);
    this.visibleImagesTotal = Math.min(9, this.imagesTotal - 1);
  }

  // Unlike the others, this one goes idle when the oldest image finally
  // clears, not when the newest finishes arriving.
  onImageDeactivated = () => {
    this.activeImagesCount--;
  };

  showNextImage() {
    const img = this.nextImage();
    ++this.visibleImagesCount;
    const scaleValue = gsap.utils.random(0.5, 1.6);

    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .fromTo(
        img.DOM.el,
        {
          scale: scaleValue - Math.max(gsap.utils.random(0.2, 0.6), 0),
          rotationZ: 0,
          opacity: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
        },
        {
          duration: 0.4,
          ease: "power3",
          scale: scaleValue,
          rotationZ: gsap.utils.random(-3, 3),
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
        },
        0,
      );

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = getNewPosition(
        this.imgPosition,
        this.visibleImagesTotal,
        this.imagesTotal,
      );
      const oldImg = this.images[lastInQueue];
      gsap.to(oldImg.DOM.el, {
        duration: 0.4,
        ease: "power4",
        opacity: 0,
        scale: 1.3,
        onComplete: () => {
          if (this.activeImagesCount === 0) this.isIdle = true;
        },
      });
    }
  }
}

/** Tilts in 3D toward wherever the pointer sits, then falls away into depth. */
class ImageTrailVariant8 extends ImageTrailBase {
  rotation: Point = { x: 0, y: 0 };
  cachedRotation: Point = { x: 0, y: 0 };
  zValue = 0;
  cachedZValue = 0;

  showNextImage() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation = { x: -(relY / centerY) * 30, y: (relX / centerX) * 30 };
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    this.zValue = (distanceFromCenter / maxDistance) * 1200 - 600;
    this.cachedZValue = this.zValue;
    const brightness = 0.2 + ((this.zValue + 600) / 1200) * 2.3;

    const img = this.nextImage();
    gsap
      .timeline({
        onStart: this.onImageActivated,
        onComplete: this.onImageDeactivated,
      })
      .set(this.container, { perspective: 1000 }, 0)
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          z: 0,
          scale: 1 + this.cachedZValue / 1000,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect!.width / 2,
          y: this.cacheMousePos.y - img.rect!.height / 2,
          rotationX: this.cachedRotation.x,
          rotationY: this.cachedRotation.y,
          filter: `brightness(${brightness})`,
        },
        {
          duration: 1,
          ease: "expo",
          scale: 1 + this.zValue / 1000,
          x: this.mousePos.x - img.rect!.width / 2,
          y: this.mousePos.y - img.rect!.height / 2,
          rotationX: this.rotation.x,
          rotationY: this.rotation.y,
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: "power2", opacity: 0, z: -800 }, 0.3);
  }
}

const VARIANTS: Record<number, new (el: HTMLElement) => ImageTrailBase> = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8,
};

/**
 * A picture in the trail. A bare URL is drawn centred; the object form says
 * which part of it to keep when the frame crops it — a CSS background-position,
 * so "40% 50%" holds a window left of centre.
 */
export type TrailItem = string | { src: string; position?: string };

export default function ImageTrail({
  items = [],
  variant = 1,
}: {
  items?: TrailItem[];
  /** 1–8, each a different animation style. */
  variant?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // prefers-reduced-motion: the trail is decoration, so skip it entirely
    // rather than run it faster.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const Variant = VARIANTS[variant] ?? VARIANTS[1];
    const instance = new Variant(el);
    return () => instance.destroy();
  }, [variant]);

  return (
    <div className="image-trail" ref={containerRef}>
      {items.map((item, i) => {
        const { src, position } =
          typeof item === "string" ? { src: item, position: undefined } : item;
        return (
          <div className="image-trail__img" key={src + i}>
            <div
              className="image-trail__img-inner"
              style={{
                backgroundImage: `url(${src})`,
                // Left to the stylesheet's own 50% 50% when nothing is said.
                backgroundPosition: position,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
