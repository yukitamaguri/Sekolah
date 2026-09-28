/**
 * MEDIA LOADER
 * SMP NEGERI 1 PORONG
 *
 * Semua gambar lokal diarahkan ke:
 * assets/images/
 *
 * Contoh:
 * image: "robotik"       -> assets/images/robotik.jpg
 * image: "pramuka"      -> assets/images/pramuka.jpg
 * image: "logo-sekolah" -> assets/images/logo-sekolah.png
 */

(() => {
  'use strict';

  const cache = new Map();

  /*
   * Ambil lokasi folder images berdasarkan lokasi file media.js.
   *
   * Ini penting untuk GitHub Pages karena website bisa berada
   * di dalam subfolder/repository.
   *
   * media.js:
   * assets/js/media.js
   *
   * maka:
   * ../images/
   */
  const script = document.currentScript;

  const IMAGE_BASE = script
    ? new URL('../images/', script.src).href
    : new URL('assets/images/', document.baseURI).href;

  const PLACEHOLDER = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">',
    '<defs>',
    '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
    '<stop offset="0" stop-color="#1e202c"/>',
    '<stop offset=".55" stop-color="#60519b"/>',
    '<stop offset="1" stop-color="#31323e"/>',
    '</linearGradient>',
    '</defs>',
    '<rect width="1200" height="800" rx="48" fill="url(#g)"/>',
    '<circle cx="920" cy="220" r="180" fill="#bfc0d1" opacity=".12"/>',
    '<text x="80" y="690" fill="#fff" opacity=".65"',
    'font-family="Arial, sans-serif" font-size="36">',
    'SMP Negeri 1 Porong</text>',
    '</svg>'
  ].join('');

  const PLACEHOLDER_SRC =
    `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(PLACEHOLDER)}`;

  function isRemote(value) {
    return /^(https?:|data:|blob:)/i.test(value);
  }

  function hasExtension(value) {
    return /\.[a-z0-9]{2,5}$/i.test(value);
  }

  function buildURL(asset) {
    const value = String(asset || '').trim();

    if (!value) {
      return null;
    }

    // Gambar dari internet / data URL
    if (isRemote(value)) {
      return value;
    }

    // Jika sudah ada ekstensi:
    // robotik.jpg -> robotik.jpg
    // logo-sekolah.png -> logo-sekolah.png
    const filename = hasExtension(value)
      ? value
      : `${value}.jpg`;

    return new URL(filename, IMAGE_BASE).href;
  }

  function markMissing(img, asset) {
    img.classList.add('asset-missing');
    img.dataset.assetResolved = 'false';
    img.dataset.assetError = 'true';
    img.removeAttribute('data-asset-loading');

    img.src = PLACEHOLDER_SRC;

    console.warn(
      `[SCHOOL MEDIA] Gambar tidak ditemukan: "${asset}"`,
      `\nDicari di: ${buildURL(asset)}`
    );
  }

  function load(img, asset) {
    if (!img) return;

    const value = String(asset || '').trim();

    if (!value) {
      markMissing(img, asset);
      return;
    }

    // Gunakan cache jika sudah pernah berhasil
    const cached = cache.get(value);

    if (cached) {
      img.src = cached;
      img.classList.remove('asset-missing');
      img.dataset.assetResolved = 'true';
      img.dataset.assetError = 'false';
      img.removeAttribute('data-asset-loading');
      return;
    }

    const src = buildURL(value);

    if (!src) {
      markMissing(img, value);
      return;
    }

    // Gambar eksternal
    if (isRemote(value)) {
      img.onload = () => {
        cache.set(value, img.currentSrc || img.src);

        img.classList.remove('asset-missing');
        img.dataset.assetResolved = 'true';
        img.dataset.assetError = 'false';
        img.removeAttribute('data-asset-loading');
      };

      img.onerror = () => {
        markMissing(img, value);
      };

      img.src = src;
      return;
    }

    /*
     * Gambar lokal.
     *
     * Tidak lagi mencoba:
     * assets/images/
     * images/
     * ./
     *
     * karena itu bisa membuat debugging GitHub Pages sulit.
     *
     * Sekarang langsung menuju:
     * assets/images/nama-file.jpg
     */
    img.onload = () => {
      cache.set(value, img.currentSrc || img.src);

      img.classList.remove('asset-missing');
      img.dataset.assetResolved = 'true';
      img.dataset.assetError = 'false';
      img.removeAttribute('data-asset-loading');
    };

    img.onerror = () => {
      markMissing(img, value);
    };

    img.dataset.assetError = 'false';

    img.src = src;
  }

  function bind(root = document) {
    root.querySelectorAll('[data-asset]').forEach(img => {
      if (!(img instanceof HTMLImageElement)) return;

      const asset = img.dataset.asset;

      if (!asset) {
        markMissing(img, asset);
        return;
      }

      if (img.dataset.assetLoading === 'true') {
        return;
      }

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

  /*
   * Public API
   */
  window.SCHOOL_MEDIA = {
    bind,
    load,
    refresh,
    placeholder: PLACEHOLDER_SRC,

    /*
     * Bisa dipakai untuk mengecek URL gambar.
     *
     * Contoh:
     * SCHOOL_MEDIA.url('robotik')
     */
    url: buildURL,

    base: IMAGE_BASE
  };

  /*
   * Debug di console browser
   */
  console.info(
    '[SCHOOL MEDIA] Image base:',
    IMAGE_BASE
  );
})();
