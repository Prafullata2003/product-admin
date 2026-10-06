export const PAGE_SIZES = [10, 20, 50];
export const SORTS = {
  "": "Default",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "rating-desc": "Rating: high to low",
  "title-asc": "Title: A to Z",
  "title-desc": "Title: Z to A",
};
// Turn raw URL values into safe values. ?page=abc -> 1, ?limit=7 -> 10, ?sort=junk -> default.
export function parseParams(sp) {
  const page = Math.max(1, parseInt(sp.get("page"), 10) || 1);
  const l = parseInt(sp.get("limit"), 10);
  const limit = PAGE_SIZES.includes(l) ? l : 10;
  const q = (sp.get("q") || "").trim();
  const category = sp.get("category") || "";
  const s = sp.get("sort") || "";
  const sort = s in SORTS ? s : "";
  const delay = Math.min(5000, Math.max(0, parseInt(sp.get("delay"), 10) || 0)); // for testing races
  return { page, limit, q, category, sort, delay };
}
