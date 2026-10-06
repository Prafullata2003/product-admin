"use client";
import { useEffect, useRef, useState } from "react";
import { SORTS } from "@/lib/params";

export default function Filters({ q, category, sort, categories, onChange }) {
  const [text, setText] = useState(q);
  const timer = useRef();
  useEffect(() => setText(q), [q]); // keep the box in sync with the URL
  useEffect(() => () => clearTimeout(timer.current), []);

  // Debounce: wait 400ms after the last keystroke, then update the URL (which triggers the API call).
  function onSearch(value) {
    setText(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange({ q: value.trim(), category: "" }, true), 400);
  }
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <input className="input" placeholder="Search products..." value={text} onChange={(e) => onSearch(e.target.value)} />
      <select className="input" value={category} onChange={(e) => onChange({ category: e.target.value, q: "" })} aria-label="Category">
        <option value="">All categories</option>
        {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>
      <select className="input" value={sort} onChange={(e) => onChange({ sort: e.target.value })} aria-label="Sort">
        {Object.entries(SORTS).map(([k, label]) => <option key={k} value={k}>{label === "Default" ? "Sort by..." : label}</option>)}
      </select>
    </div>
  );
}
