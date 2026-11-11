/** Build-time year, cached so prerendering stays deterministic. */
export async function buildYear() {
  "use cache";
  return new Date().getFullYear();
}
