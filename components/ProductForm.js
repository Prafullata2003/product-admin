"use client";
import { useRef, useState } from "react";
import Modal from "./Modal";

function validate(v) {
  const e = {};
  if (v.title.trim().length < 3) e.title = "At least 3 characters";
  if (!(Number(v.price) > 0)) e.price = "Must be greater than 0";
  if (!v.category) e.category = "Choose a category";
  if (v.stock === "" || !Number.isInteger(Number(v.stock)) || Number(v.stock) < 0) e.stock = "Whole number, 0 or more";
  if (v.description.trim().length < 10) e.description = "At least 10 characters";
  return e;
}

export default function ProductForm({ product, categories, onSubmit, onCancel }) {
  const [v, setV] = useState({
    title: product?.title ?? "", price: product?.price ?? "", category: product?.category ?? "",
    stock: product?.stock ?? "", description: product?.description ?? "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const inFlight = useRef(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  async function submit(ev) {
    ev.preventDefault();
    if (inFlight.current) return; // many quick clicks -> only one request
    const errs = validate(v);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    inFlight.current = true; setSaving(true); setServerError("");
    try {
      await onSubmit({ ...v, title: v.title.trim(), description: v.description.trim(), price: Number(v.price), stock: Number(v.stock) });
    } catch (err) {
      setServerError(err.message); inFlight.current = false; setSaving(false);
    }
  }
  const Field = ({ k, label, children }) => (
    <label className="block text-sm">{label}{children}{errors[k] && <span className="text-xs text-red-600">{errors[k]}</span>}</label>
  );
  return (
    <Modal title={product ? "Edit product" : "Add product"}>
      <form onSubmit={submit} className="space-y-3" noValidate>
        {serverError && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{serverError}</p>}
        <Field k="title" label="Title"><input className="input" value={v.title} onChange={set("title")} /></Field>
        <Field k="price" label="Price"><input className="input" type="number" step="0.01" value={v.price} onChange={set("price")} /></Field>
        <Field k="category" label="Category">
          <select className="input" value={v.category} onChange={set("category")}>
            <option value="">Select...</option>
            {categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </Field>
        <Field k="stock" label="Stock"><input className="input" type="number" value={v.stock} onChange={set("stock")} /></Field>
        <Field k="description" label="Description"><textarea className="input" rows={3} value={v.description} onChange={set("description")} /></Field>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-light" onClick={onCancel} disabled={saving}>Cancel</button>
          <button className="btn" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}
