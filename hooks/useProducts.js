"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { fetchProducts } from "@/services/productService";

// Loads a page of products whenever the URL values change.
// The cleanup aborts the previous request, so an old (slow) response can never overwrite a newer one.
export function useProducts(params, refreshKey) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const { page, limit, q, category, sort, delay } = params;
  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    fetchProducts({ page, limit, q, category, sort, delay }, controller.signal)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((e) => {
        if (axios.isCancel(e)) return; // we cancelled it ourselves, ignore
        setState({ data: null, loading: false, error: e.message });
      });
    return () => controller.abort();
  }, [page, limit, q, category, sort, delay, refreshKey]);
  return state;
}
