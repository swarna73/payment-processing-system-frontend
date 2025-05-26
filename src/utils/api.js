// src/utils/api.js
export async function api(path, opts = {}) {
  const jwt = localStorage.getItem("jwt");
  const headers = {
    "Content-Type": "application/json",
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {})
  };
  const res = await fetch(path, { headers, ...opts });
  if (res.status === 401) {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  return res;
}
