// DummyJSON does not save add/edit/delete, so we keep our own changes in localStorage
// and merge them into whatever the API returns.
const KEY = "pa_changes";
const empty = () => ({ added: [], edited: {}, deleted: [] });
const read = () => {
  try { return { ...empty(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return empty(); }
};
const write = (c) => localStorage.setItem(KEY, JSON.stringify(c));
export const isLocalId = (id) => Number(id) > 1e6; // our own ids come from Date.now()
export const getChanges = read;

export function applyChanges(list) {
  const c = read();
  return list.filter((p) => !c.deleted.includes(p.id)).map((p) => ({ ...p, ...c.edited[p.id] }));
}
export function addLocal(values) {
  const c = read();
  c.added.unshift({ id: Date.now(), thumbnail: "", images: [], rating: 0, reviews: [], ...values });
  write(c);
}
export function editLocal(id, values) {
  const c = read();
  const i = c.added.findIndex((p) => p.id === id);
  if (i >= 0) c.added[i] = { ...c.added[i], ...values };
  else c.edited[id] = { ...c.edited[id], ...values };
  write(c);
}
export function deleteLocal(id) {
  const c = read();
  if (c.added.some((p) => p.id === id)) c.added = c.added.filter((p) => p.id !== id);
  else c.deleted.push(id);
  write(c);
}
