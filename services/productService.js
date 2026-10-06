import api from "@/lib/axios";

// search wins over category (the API cannot do both), see README.
export async function fetchProducts({ page, limit, q, category, sort, delay }, signal) {
  const params = { limit, skip: (page - 1) * limit };
  if (sort) { const [sortBy, order] = sort.split("-"); params.sortBy = sortBy; params.order = order; }
  if (delay) params.delay = delay;
  let url = "/products";
  if (q) { url = "/products/search"; params.q = q; }
  else if (category) url = `/products/category/${encodeURIComponent(category)}`;
  const { data } = await api.get(url, { params, signal });
  return data;
}
export const fetchCategories = async () => (await api.get("/products/categories")).data;
export const fetchProduct = async (id, signal) => (await api.get(`/products/${id}`, { signal })).data;
export const createProduct = async (p) => (await api.post("/products/add", p)).data;
export const updateProduct = async (id, p) => (await api.put(`/products/${id}`, p)).data;
export const deleteProduct = async (id) => (await api.delete(`/products/${id}`)).data;
