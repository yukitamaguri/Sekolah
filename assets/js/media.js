/**
 * MEDIA LOADER
 * SMP NEGERI 1 PORONG
 *
 * Menentukan gambar berdasarkan nama file di assets/images/.
 * Jika file tidak ada, gunakan placeholder.svg.
 */

(() => {
  'use strict';

  const cache = new Map();

  // Semua halaman HTML berada di root proyek.
  // Jadi path ini aman digunakan di GitHub Pages:
  // https://username.github.io/Sekolah/
  const IMAGE_BASE = new URL('assets/images/', document.baseURI).href;
  const PLACEHOLDER_URL = new URL('placeholder.svg', IMAGE_BASE).href;

  function isRemote(value) {
    return /^(https?:|data:|blob:)/i.test(value);
  }

  function hasExtension(value) {
    return /\.[a-z0-9]{2,5}$/i.test(value);
  }

  function buildURL(asset) {
    const value = String(asset || '').trim();

    if (!value) return PLACEHOLDER_URL;
    if (value === 'placeholder') return PLACEHOLDER_URL;
    if (isRemote(value)) return value;

    if (hasExtension(value)) {
      return new URL(value, IMAGE_BASE).href;
    }

    return new URL(`${value}.jpg`, IMAGE_BASE).href;
  }

  function candidates(asset) {
    const value = String(asset || '').trim();

    if (!value || value === 'placeholder') {
      return [PLACEHOLDER_URL];
    }

    if (isRemote(value) || hasExtension(value)) {
      return [buildURL(value)];
    }

    // Urutan ini penting: jpg -> jpeg -> png -> webp -> svg.
    return ['.jpg', '.jpeg', '.png', '.webp', '.svg']
      .map(ext => new URL(`${value}${ext}`, IMAGE_BASE).href);
  }

  function usePlaceholder(img, asset) {
    img.classList.add('asset-missing');
    img.dataset.assetResolved = 'false';
    img.dataset.assetError = 'true';
    img.removeAttribute('data-asset-loading');

    // Jangan biarkan onerror memproses placeholder lagi.
    img.onload = null;
    img.onerror = null;
    img.src = PLACEHOLDER_URL;

    console.warn(`[SCHOOL MEDIA] Tidak ditemukan: "${asset}". Placeholder digunakan.`);
  }

  function load(img, asset) {
    if (!(img instanceof HTMLImageElement)) return;

    const value = String(asset || '').trim();

    if (!value) {
      usePlaceholder(img, '');
      return;
    }

    const cached = cache.get(value);

    if (cached) {
      img.src = cached;
      img.classList.remove('asset-missing');
      img.dataset.assetResolved = 'true';
      img.dataset.assetError = 'false';
      img.removeAttribute('data-asset-loading');
      return;
    }

    const list = candidates(value);
    let index = 0;

    const tryNext = () => {
      if (index >= list.length) {
        usePlaceholder(img, value);
        return;
      }

      img.src = list[index++];
    };

    img.onload = () => {
      cache.set(value, img.currentSrc || img.src);
      img.classList.remove('asset-missing');
      img.dataset.assetResolved = 'true';
      img.dataset.assetError = 'false';
      img.removeAttribute('data-asset-loading');
    };

    img.onerror = tryNext;
    img.dataset.assetLoading = 'true';
    img.dataset.assetError = 'false';

    tryNext();
  }

  function bind(root = document) {
    root.querySelectorAll('img[data-asset]').forEach(img => {
      if (img.dataset.assetLoading === 'true') return;
      load(img, img.dataset.asset);
    });
  }

  function refresh(img, asset) {
    if (!(img instanceof HTMLImageElement)) return;

    img.dataset.asset = asset || '';
    img.dataset.assetLoading = 'true';
    img.classList.remove('asset-missing');

    load(img, asset);
  }

  window.SCHOOL_MEDIA = {
    bind,
    load,
    refresh,
    placeholder: PLACEHOLDER_URL,
    url: buildURL,
    base: IMAGE_BASE
  };
})();
