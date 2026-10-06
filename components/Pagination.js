import { PAGE_SIZES } from "@/lib/params";

function pageList(p, t) {
  const nums = [...new Set([1, t, p - 1, p, p + 1])].filter((n) => n >= 1 && n <= t).sort((a, b) => a - b);
  const out = [];
  nums.forEach((n, i) => { if (i && n - nums[i - 1] > 1) out.push("gap" + i); out.push(n); });
  return out;
}
export default function Pagination({ page, totalPages, total, limit, onPage, onLimit }) {
  const from = total ? (page - 1) * limit + 1 : 0;
  const to = Math.min(page * limit, total);
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
      <p>Showing {from}–{to} of {total}</p>
      <div className="flex flex-wrap items-center gap-1">
        <button className="btn-light" disabled={page <= 1} onClick={() => onPage(page - 1)}>Previous</button>
        {pageList(page, totalPages).map((n) =>
          typeof n === "string" ? <span key={n} className="px-1">…</span> : (
            <button key={n} onClick={() => onPage(n)} aria-current={n === page ? "page" : undefined}
              className={`rounded border px-3 py-2 ${n === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>{n}</button>
          ))}
        <button className="btn-light" disabled={page >= totalPages} onClick={() => onPage(page + 1)}>Next</button>
      </div>
      <select className="rounded border px-2 py-2" value={limit} onChange={(e) => onLimit(Number(e.target.value))} aria-label="Page size">
        {PAGE_SIZES.map((s) => <option key={s} value={s}>{s} / page</option>)}
      </select>
    </div>
  );
}
