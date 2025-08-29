/**
 * normalizeMetrics(sites, keys)
 * - sites: array of objects
 * - keys: array of numeric keys to normalize
 * Returns: array of normalized metric objects in same order
 */
function normalizeMetrics(sites, keys) {
  const mins = {};
  const maxs = {};
  keys.forEach(k => {
    mins[k] = Infinity;
    maxs[k] = -Infinity;
  });

  sites.forEach(s => {
    keys.forEach(k => {
      const v = Number(s[k] || 0);
      if (v < mins[k]) mins[k] = v;
      if (v > maxs[k]) maxs[k] = v;
    });
  });

  // avoid division by zero: if max===min, set denom = 1
  const denom = {};
  keys.forEach(k => {
    denom[k] = (maxs[k] - mins[k]) === 0 ? 1 : (maxs[k] - mins[k]);
  });

  return sites.map(s => {
    const norm = {};
    keys.forEach(k => {
      const v = Number(s[k] || 0);
      norm[k] = (v - mins[k]) / denom[k]; // normalized 0..1
    });
    return norm;
  });
}

module.exports = {
  normalizeMetrics
};
