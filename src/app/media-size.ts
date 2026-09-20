// ---------------------------------------------------------------------------
// How big a picture or a film in /public is, read off the file itself.
//
// A study is put on the page all at once when its row is pressed, and its
// media starts loading at that moment. Until a file's first bytes arrive the
// browser does not know its shape: a picture is given no height at all and a
// film is given the 300 by 150 every film starts at, and the page is laid out
// around that. Then the file lands, the box takes its real shape, and
// everything under it jumps — for the film at the head of a study that is
// 550px, a tenth of a second after the study appeared. Said in the markup as
// width and height, the shape is known before any of it loads and the room is
// held from the first frame.
//
// Read here rather than written into case-studies.ts beside each src, where
// it would be a second thing to keep true every time a file is swapped. Only
// the header of each file is looked at — a few dozen bytes for a PNG — and
// each is looked at once.
//
// Server only: it reads the disk. case-study.tsx calls it while the studies
// are rendered, which for every page on the site is at build time, and hands
// the numbers on as plain data to the one client component that needs them.
// A file that cannot be read or made sense of is `undefined`, and its element
// is set without a size, as every one of them was before.
// ---------------------------------------------------------------------------

import fs from "node:fs";
import path from "node:path";

export type MediaSize = { width: number; height: number };

const seen = new Map<string, MediaSize | undefined>();

export function mediaSize(src: string): MediaSize | undefined {
  if (seen.has(src)) return seen.get(src);
  let size: MediaSize | undefined;
  try {
    const file = path.join(process.cwd(), "public", src);
    const ext = path.extname(src).toLowerCase();
    if (ext === ".png") size = png(head(file, 32));
    else if (ext === ".jpg" || ext === ".jpeg") size = jpeg(fs.readFileSync(file));
    else if (ext === ".svg") size = svg(fs.readFileSync(file, "utf8"));
    else if (ext === ".mp4" || ext === ".mov") size = mp4(fs.readFileSync(file));
  } catch {
    size = undefined;
  }
  seen.set(src, size);
  return size;
}

function head(file: string, bytes: number): Buffer {
  const fd = fs.openSync(file, "r");
  try {
    const buf = Buffer.alloc(bytes);
    fs.readSync(fd, buf, 0, bytes, 0);
    return buf;
  } finally {
    fs.closeSync(fd);
  }
}

/** IHDR is always the first chunk: width and height at bytes 16 and 20. */
function png(buf: Buffer): MediaSize | undefined {
  if (buf.toString("ascii", 12, 16) !== "IHDR") return undefined;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** The first start-of-frame segment; the ones skipped over are not frames. */
function jpeg(buf: Buffer): MediaSize | undefined {
  let i = 2;
  while (i + 9 < buf.length) {
    if (buf[i] !== 0xff) return undefined;
    const marker = buf[i + 1];
    const frame =
      marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker);
    if (frame) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return undefined;
}

/** The viewBox, which is the shape whatever width and height go on to say. */
function svg(text: string): MediaSize | undefined {
  const box = /viewBox="\s*[-\d.]+[\s,]+[-\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(
    text,
  );
  if (!box) return undefined;
  return { width: Number(box[1]), height: Number(box[2]) };
}

/**
 * The track header of the first track that has a size — the sound's has none.
 * Width and height are its last eight bytes, as 16.16 fixed point.
 */
function mp4(buf: Buffer): MediaSize | undefined {
  const inside = new Set(["moov", "trak"]);
  const walk = (start: number, end: number): MediaSize | undefined => {
    let i = start;
    while (i + 8 <= end) {
      let size = buf.readUInt32BE(i);
      const type = buf.toString("ascii", i + 4, i + 8);
      let body = i + 8;
      if (size === 1) {
        size = Number(buf.readBigUInt64BE(i + 8));
        body = i + 16;
      } else if (size === 0) size = end - i;
      if (size < 8) return undefined;
      if (type === "tkhd") {
        const width = buf.readUInt32BE(i + size - 8) / 65536;
        const height = buf.readUInt32BE(i + size - 4) / 65536;
        if (width && height) return { width, height };
      } else if (inside.has(type)) {
        const found = walk(body, i + size);
        if (found) return found;
      }
      i += size;
    }
    return undefined;
  };
  return walk(0, buf.length);
}
