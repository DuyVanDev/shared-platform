import slugify from "slugify";
import crypto from "crypto";

export function makeSlug(title: string) {
  const base = slugify(title || "snippet", { lower: true, strict: true }).slice(0, 50);
  const rand = crypto.randomBytes(3).toString("hex"); // 6 chars
  return `${base}-${rand}`;
}