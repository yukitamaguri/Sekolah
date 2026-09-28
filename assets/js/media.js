/**
 * MEDIA LOADER
 * ------------------------------------------------------------
 * One job: resolve local school images reliably.
 *
 * Data can use either:
 *   image: 'galeri-06'
 * or:
 *   image: 'galeri-06.jpg'
 *
 * Supported local folders are tried in this order:
 *   assets/images/
 *   images/
 *   ./
 *
 * When a file cannot be found, the loader uses an inline SVG fallback.
 * This prevents broken-image icons and keeps the layout dimensions intact.
 */
(() => {
  'use strict';

  const ROOTS = ['assets/images/', 'images/', './'];
  const EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'];
  const cache = new Map();

  const isRemote = value => /^(https?:|data:|blob:)/i.test(value);
  const hasExtension = value => /\.[a-z0-9]{2,5}$/i.test(value);

  const PLACEHOLDER = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">',
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0" stop-color="#1e202c"/>',
    '<stop offset=".55" stop-color="#60519b"/>',
    '<stop offset="1" stop-color="#31323e"/>',
    '</linearGradient></defs>',
    '<rect width="1200" height="800" rx="48" fill="url(#g)"/>',
    '<circle cx="920" cy="220" r="180" fill="#bfc0d1" opacity=".12"/>',
    '<text x="80" y="690" fill="#fff" opacity=".65"',
    ' font-family="Arial, sans-serif" font-size="36">',
    'SMP Negeri 1 Porong</text>',
    '</svg>'
  ].join('');

  const PLACEHOLDER_SRC = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PLACEHOLDER)}`;

  function unique(items) {
    return [...new Set(items)];
  }

  function buildCandidates(asset) {
    const value = String(asset || '').trim();
    if (!value) return [];
    if (isRemote(value)) return [value];

    if (hasExtension(value)) {
      if (value.startsWith('./') || value.startsWith('../') || value.includes('/')) {
        return unique([value, `./${value.replace(/^\.\//, '')}`]);
      }
      return unique(ROOTS.map(root => `${root}${value}`));
    }

    const clean = value.replace(/^\.\//, '');
    const roots = clean.includes('/') ? ['./'] : ROOTS;
    return unique(
      roots.flatMap(root => EXTENSIONS.map(ext => `${root}${clean}.${ext}`))
    );
  }

  function markMissing(img) {
    img.classList.add('asset-missing');
    img.dataset.assetResolved = 'false';
    img.removeAttribute('data-asset-loading');
    img.src = PLACEHOLDER_SRC;
  }

  function load(img, asset) {
    if (!img) return;

    const value = String(asset || '').trim();
    if (!value) {
      markMissing(img);
      return;
    }

    const cached = cache.get(value);
    if (cached) {
      img.src = cached;
      img.classList.remove('asset-missing');
      img.dataset.assetResolved = 'true';
      img.removeAttribute('data-asset-loading');
      return;
    }

    if (isRemote(value)) {
      img.onerror = () => markMissing(img);
      img.onload = () => {
        cache.set(value, img.currentSrc || img.src);
        img.classList.remove('asset-missing');
        img.dataset.assetResolved = 'true';
        img.removeAttribute('data-asset-loading');
      };
      img.src = value;
      return;
    }

    const candidates = buildCandidates(value);
    let index = 0;

    const tryNext = () => {
      if (index >= candidates.length) {
        markMissing(img);
        return;
      }
      img.src = candidates[index++];
    };

    img.onerror = tryNext;
    img.onload = () => {
      cache.set(value, img.currentSrc || img.src);
      img.classList.remove('asset-missing');
      img.dataset.assetResolved = 'true';
      img.removeAttribute('data-asset-loading');
      img.removeAttribute('data-asset-error');
    };

    img.dataset.assetError = 'false';
    tryNext();
  }

  function bind(root = document) {
    root.querySelectorAll('[data-asset]').forEach(img => {
      if (!(img instanceof HTMLImageElement)) return;
      const asset = img.dataset.asset;
      if (!asset || img.dataset.assetLoading === 'true') return;
      img.dataset.assetLoading = 'true';
      load(img, asset);
    });
  }

  function refresh(img, asset) {
    if (!img) return;
    img.dataset.asset = asset || '';
    img.dataset.assetLoading = 'true';
    img.classList.remove('asset-missing');
    load(img, asset);
  }

  window.SCHOOL_MEDIA = {
    bind,
    load,
    refresh,
    placeholder: PLACEHOLDER_SRC,
    candidates: buildCandidates
  };
})();
