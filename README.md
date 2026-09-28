# SMP Negeri 1 Porong — v7 Clean & Stable

## Struktur
- HTML halaman tetap berada di root agar mudah dibuka di Acode.
- `assets/css/style.css` → visual, responsive layout, motion.
- `assets/js/data.js` → semua konten/data sekolah.
- `assets/js/media.js` → resolver gambar lokal.
- `assets/js/main.js` → interaksi, filter, lightbox, nav, motion.
- `assets/images/` → semua foto dan logo.

## Cara mengganti gambar
Paling aman: simpan file baru di `assets/images/`.

Contoh:
```js
image: 'lapangan-baru'
```
Bisa memakai:
- `lapangan-baru.jpg`
- `lapangan-baru.jpeg`
- `lapangan-baru.png`
- `lapangan-baru.webp`

Kode akan mencoba ekstensi tersebut otomatis.

## Cara mengganti logo
Ganti file:
`assets/images/logo-sekolah.png`

Atau ubah `data-asset="logo-sekolah"` pada HTML.

## Aturan penting
1. Jangan beri ekstensi `.png` pada file JPEG. Pastikan ekstensi mengikuti format asli file.
2. Jangan hapus `assets/js/media.js` dari halaman mana pun.
3. Jangan mengubah path `assets/images/` menjadi path absolut seperti `/assets/images/` jika website dijalankan dari folder lokal/Acode.
4. Untuk data baru, cukup ubah `assets/js/data.js`.

## Debug cepat di Acode
Jika gambar baru tidak muncul:
- pastikan file ada di `assets/images/`;
- cek nama file, termasuk huruf besar/kecil;
- cek ekstensi file;
- reload preview setelah menyimpan;
- jangan gunakan backslash `\\` pada path.
