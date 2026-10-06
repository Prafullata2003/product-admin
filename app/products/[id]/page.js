"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import { fetchProduct } from "@/services/productService";
import { applyChanges, getChanges, isLocalId } from "@/lib/localChanges";
import { Loader, ErrorBox } from "@/components/States";

export default function ProductDetail() {
  const { id: raw } = useParams();
  const id = /^\d+$/.test(raw) ? Number(raw) : null; // "abc" or "-1" -> not found
  const [state, setState] = useState({ product: null, loading: true, error: null, missing: id === null });
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (id === null) return;
    if (isLocalId(id)) { // product we added ourselves
      const p = getChanges().added.find((x) => x.id === id);
      return setState({ product: p || null, loading: false, error: null, missing: !p });
    }
    const controller = new AbortController();
    setState({ product: null, loading: true, error: null, missing: false });
    fetchProduct(id, controller.signal)
      .then((p) => {
        const [merged] = applyChanges([p]); // undefined if we "deleted" it
        setState({ product: merged || null, loading: false, error: null, missing: !merged });
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setState({ product: null, loading: false, error: e.message, missing: e.status === 404 });
      });
    return () => controller.abort();
  }, [id, tick]);

  if (state.missing) notFound();
  if (state.loading) return <Loader />;
  if (state.error) return <ErrorBox message={state.error} onRetry={() => setTick((t) => t + 1)} />;
  const p = state.product;
  return (
    <div className="space-y-4">
      <Link href="/products" className="text-sm text-blue-600">← Back to products</Link>
      <div className="grid gap-6 rounded bg-white p-4 md:grid-cols-2">
        <div className="flex flex-wrap gap-2">
          {(p.images?.length ? p.images : [p.thumbnail]).filter(Boolean).map((src) => (
            <img key={src} src={src} alt={p.title} className="h-40 w-40 rounded bg-gray-100 object-cover" />
          ))}
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">{p.title}</h1>
          <p className="text-gray-500">{p.category}{p.brand ? ` · ${p.brand}` : ""}</p>
          <p className="text-xl">${p.price}</p>
          <p>★ {p.rating} · Stock {p.stock}</p>
          <p className="text-sm">{p.description}</p>
        </div>
      </div>
      <section className="rounded bg-white p-4">
        <h2 className="mb-2 font-bold">Reviews ({p.reviews?.length || 0})</h2>
        {!p.reviews?.length && <p className="text-sm text-gray-500">No reviews yet.</p>}
        {p.reviews?.map((r, i) => (
          <div key={i} className="border-t py-2 text-sm">
            <p className="font-medium">{r.reviewerName} · ★ {r.rating}</p>
            <p>{r.comment}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
