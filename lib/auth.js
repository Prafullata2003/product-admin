// Token lives in a cookie so middleware (server) and Axios (browser) can both see it.
const KEY = "token";
export const getToken = () =>
  typeof document === "undefined" ? null
    : document.cookie.split("; ").find((c) => c.startsWith(KEY + "="))?.split("=")[1] || null;
export const setToken = (t) => { document.cookie = `${KEY}=${t}; path=/; max-age=3600; SameSite=Lax`; };
export const clearToken = () => { document.cookie = `${KEY}=; path=/; max-age=0`; };
