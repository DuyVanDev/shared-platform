export function estimateTimeComplexity(code: string): string {
  if (!code) return "O(1)";

  const c = code.toLowerCase();

  // heuristic checks (simple)
  const forCount = (c.match(/\bfor\s*\(/g) || []).length;
  const nestedFor = /for\s*\([\s\S]*for\s*\(/.test(c);
  const whileCount = (c.match(/\bwhile\s*\(/g) || []).length;
  const recursion = /\breturn\b[\s\S]*\b\w+\(|function\s+\w+\([\s\S]*\)\s*{[\s\S]*\b\w+\(/.test(c); // rough

  if (nestedFor || forCount >= 2) return "O(n^2)";
  if (recursion) return "O(n) (recursion, estimate)";
  if (forCount >= 1 || whileCount >= 1) return "O(n)";
  if (/\bmap\(|\bforEach\(/.test(c)) return "O(n)";
  if (/\bsort\(/.test(c)) return "O(n log n)";
  return "O(1)";
}
