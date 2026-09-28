/**
 * SCHOOL CONTENT
 * ------------------------------------------------------------
 * Edit this file when you want to change school information.
 * The HTML and animation logic do not need to be touched for
 * normal content updates.
 */

window.SCHOOL_DATA = {
  // 01 — Identitas sekolah
  school: {
    name: 'SMP NEGERI 1 PORONG',
    shortName: 'SMPN 1 PORONG',
    tagline: 'Mencetak Generasi Bangsa yang Beriman, Berprestasi, Terampil dan Berbudaya Lingkungan',
    established: '1976',
    principal: 'Al Hadi, S.Pd.I., M.Pd.I.',
    address: 'Jl. Bhayangkari No. 368, Porong, Sidoarjo, Jawa Timur 61274',
    phone: '(0343) 851246',
    email: 'smpn1_porong@yahoo.com',
    website: 'smpn1porong.sch.id',
    description: 'SMP Negeri 1 Porong merupakan institusi pendidikan yang terus berkembang dengan fokus pada prestasi, karakter, keterampilan, dan kepedulian terhadap lingkungan.',
    students: 903,
    teachers: 46,
    staff: 10,
    facilities: 20,
  },

  // 02 — Profil, sejarah, visi, misi
  about: {
    history: 'SMP Negeri 1 Porong didirikan pada tahun 1976 dan mulai beroperasi penuh pada 1 Juli 1977. Sekolah berkembang menjadi lingkungan belajar yang memadukan pembelajaran akademik, kegiatan pengembangan diri, serta kepedulian terhadap lingkungan.',
    vision: 'Terwujudnya peserta didik yang beriman, berprestasi, terampil, berkarakter, dan berbudaya lingkungan.',
    missions: [
      'Mengembangkan pembelajaran yang aktif, kontekstual, dan berorientasi pada potensi peserta didik.',
      'Mendorong prestasi akademik dan nonakademik melalui pembinaan yang berkelanjutan.',
      'Menumbuhkan karakter, kemandirian, kreativitas, dan kepedulian sosial.',
      'Membangun budaya sekolah yang bersih, sehat, aman, dan ramah lingkungan.'
    ]
  },

  // 03 — Fasilitas
  facilities: [
    { title: 'Perpustakaan', text: 'Perpustakaan konvensional dan digital untuk mendukung budaya literasi.', image: 'perpustakaan' },
    { title: 'Laboratorium', text: 'Laboratorium IPA dan komputer untuk pembelajaran berbasis praktik dan teknologi.', image: 'laboratorium' },
    { title: 'Olahraga', text: 'Area olahraga untuk sepak bola, basket, voli, dan bulu tangkis.', image: 'olahraga' },
    { title: 'Ruang Kesenian', text: 'Ruang pengembangan kreativitas seni dan kegiatan ekspresi peserta didik.', image: 'ruang-kesenian' }
  ],

  // 04 — Ekstrakurikuler
  extracurriculars: [
    { title: 'Robotik', category: 'Teknologi', text: 'Eksplorasi robotika, logika, dan pemecahan masalah melalui proyek kreatif.', image: 'robotik' },
    { title: 'Pramuka', category: 'Karakter', text: 'Pembentukan kepemimpinan, kemandirian, kedisiplinan, dan kerja sama.', image: 'pramuka' },
    { title: 'Olahraga', category: 'Olahraga', text: 'Pembinaan kebugaran dan sportivitas melalui berbagai cabang olahraga.', image: 'olahraga' },
    { title: 'Seni & Budaya', category: 'Seni', text: 'Ruang bagi peserta didik untuk mengembangkan bakat seni dan budaya.', image: 'galeri-04' },
    { title: 'Paduan Suara', category: 'Seni', text: 'Latihan vokal, musikalitas, dan penampilan dalam kegiatan sekolah.', image: 'halaman-depan' },
    { title: 'Karya Digital', category: 'Teknologi', text: 'Kegiatan kreatif untuk membangun keterampilan digital dan komunikasi.', image: 'koridor-sekolah' }
  ],

  // 05 — Kegiatan
  activities: [
    { title: 'Digital Studentpreneur', category: 'Teknologi', date: '2025', text: 'Kegiatan pengembangan kreativitas dan kewirausahaan digital peserta didik.', image: 'halaman-depan' },
    { title: 'Peringatan Hari Pahlawan', category: 'Sekolah', date: '17 November 2025', text: 'Kegiatan reflektif dan edukatif untuk menumbuhkan semangat kebangsaan.', image: 'galeri-04' },
    { title: 'P5 Urban Farming', category: 'Lingkungan', date: '2025', text: 'Pembelajaran berbasis proyek yang mengajak siswa mengenal pengelolaan lingkungan dan pangan.', image: 'galeri-04' },
    { title: 'Pembiasaan Siswa', category: 'Karakter', date: '2025', text: 'Rangkaian aktivitas pembiasaan positif sebagai bagian dari budaya sekolah.', image: 'lingkungan-sekolah' },
    { title: '[JUDUL KEGIATAN]', category: 'Sekolah', date: '[TANGGAL]', text: '[DESKRIPSI KEGIATAN]', image: 'koridor-sekolah' }
  ],

  // 06 — Prestasi
  achievements: [
    { title: 'Top 10 Kompetisi Inovasi Sidoarjo 2025', category: 'Guru', year: '2025', text: 'Guru SMPN 1 Porong masuk Top 10 KISI dari 216 peserta.', image: 'lingkungan-sekolah' },
    { title: 'Juara 3 O2SN Karate Putra', category: 'Olahraga', year: '2025', text: 'Prestasi tingkat Provinsi Jawa Timur pada cabang karate putra.', image: 'galeri-04' },
    { title: 'Juara 2 Kyoguri Cadet Putri', category: 'Olahraga', year: '2025', text: 'Juara 2 dalam ajang KAPOLRI Cup 6.', image: 'galeri-04' },
    { title: '[NAMA PRESTASI]', category: 'Akademik', year: '[TAHUN]', text: '[DESKRIPSI PRESTASI]', image: 'halaman-depan' },
    { title: '[NAMA PRESTASI]', category: 'Seni', year: '[TAHUN]', text: '[DESKRIPSI PRESTASI]', image: 'galeri-04' }
  ],

  // 07 — Galeri
  gallery: [
    { title: 'Halaman depan sekolah saat senja', category: 'Sekolah', image: 'halaman-depan' },
    { title: 'Area tengah dan ruang aktivitas siswa', category: 'Sekolah', image: 'lingkungan-sekolah' },
    { title: 'Koridor sekolah menjelang sore', category: 'Fasilitas', image: 'koridor-sekolah' },
    { title: 'Identitas SMP Negeri 1 Porong', category: 'Identitas', image: 'galeri-04' },
    { title: 'Ruang terbuka dan lingkungan sekolah', category: 'Lingkungan', image: 'galeri-04' },
    { title: '[JUDUL FOTO]', category: 'Kegiatan', image: 'halaman-depan' },
    { title: '[JUDUL FOTO]', category: 'Pembelajaran', image: 'lingkungan-sekolah' },
    { title: '[JUDUL FOTO]', category: 'Kegiatan', image: 'koridor-sekolah' }
  ],

  // 08 — Media
  // Use only the filename/base name here. The media loader resolves
  // common folders and image extensions automatically.
  assets: {
    logo: 'logo-sekolah',
    hero: 'halaman-depan',
    placeholder: 'placeholder'
  },
};
