"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProducts } from "@/hooks/useProducts";
import { parseParams } from "@/lib/params";
import { fetchCategories, createProduct, updateProduct, deleteProduct } from "@/services/productService";
import { applyChanges, getChanges, addLocal, editLocal, deleteLocal, isLocalId } from "@/lib/localChanges";
import Filters from "@/components/Filters";
import ProductList from "@/components/ProductList";
import Pagination from "@/components/Pagination";
import ProductForm from "@/components/ProductForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Loader, Empty, ErrorBox } from "@/components/States";

function Products() {
  const sp = useSearchParams();
  const router = useRouter();
  const params = parseParams(sp);
  const { page, limit, q, category } = params;

  const [tick, setTick] = useState(0); // bump to reload / re-merge local changes
  const { data, loading, error } = useProducts(params, tick);
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, product = edit
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => { fetchCategories().then(setCategories).catch(() => {}); }, []);

  // Write new values to the URL. Anything except "page" resets to page 1.
  function update(patch, replace = false) {
    const n = new URLSearchParams(sp.toString());
    if (!("page" in patch)) n.delete("page");
    Object.entries(patch).forEach(([k, v]) => (v ? n.set(k, v) : n.delete(k)));
    const qs = n.toString();
    router[replace ? "replace" : "push"](qs ? `/products?${qs}` : "/products");
  }

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const outOfRange = !!data && page > totalPages;
  useEffect(() => { if (outOfRange) update({ page: totalPages > 1 ? totalPages : "" }, true); }, [outOfRange]); // ?page=999 -> last page

  const items = useMemo(() => {
    if (!data) return [];
    const list = applyChanges(data.products);
    return page === 1 && !q && !category ? [...getChanges().added, ...list] : list;
  }, [data, tick, page, q, category]);

  async function save(values) {
    if (editing?.id) {
      if (!isLocalId(editing.id)) await updateProduct(editing.id, values); // fake save on the API
      editLocal(editing.id, values);
    } else {
      await createProduct(values); // fake save on the API
      addLocal(values);
    }
    setEditing(null); setTick((t) => t + 1);
  }
  async function confirmDelete() {
    if (busy) return;
    setBusy(true);
    try { if (!isLocalId(deleting.id)) await deleteProduct(deleting.id); } catch {}
    deleteLocal(deleting.id);
    setBusy(false); setDeleting(null); setTick((t) => t + 1);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <button className="btn" onClick={() => setEditing({})}>+ Add product</button>
      </div>
      <Filters q={q} category={category} sort={params.sort} categories={categories} onChange={update} />
      {error ? <ErrorBox message={error} onRetry={() => setTick((t) => t + 1)} />
        : loading || outOfRange ? <Loader />
        : items.length === 0 ? <Empty />
        : (<>
            <ProductList items={items} onEdit={setEditing} onDelete={setDeleting} />
            <Pagination page={page} totalPages={totalPages} total={total} limit={limit}
              onPage={(p) => update({ page: p > 1 ? p : "" })} onLimit={(l) => update({ limit: l === 10 ? "" : l })} />
          </>)}
      {editing && <ProductForm product={editing.id ? editing : null} categories={categories} onSubmit={save} onCancel={() => setEditing(null)} />}
      {deleting && <ConfirmDialog text={`Delete "${deleting.title}"?`} busy={busy} onConfirm={confirmDelete} onCancel={() => setDeleting(null)} />}
    </div>
  );
}
export default function ProductsPage() { return <Suspense fallback={<Loader />}><Products /></Suspense>; }
