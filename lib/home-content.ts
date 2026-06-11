export type PublicHomeContent = {
  hero: { title: string; subtitle: string; year: string; backgroundImage: string }
  video: { title: string; description: string; url: string }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    enabled: boolean
  }
}

export const defaultHomeContent: PublicHomeContent = {
  hero: {
    title: "Himpunan Mahasiswa D3 Sistem Informasi",
    subtitle: 'UPN "Veteran" Jakarta',
    year: "2026",
    backgroundImage: "",
  },
  video: {
    title: "Kenali Kabinet Vidyakatra Lebih Dekat",
    description:
      "Video singkat tentang arah gerak, budaya kerja, dan ruang kolaborasi HIMA D3 Sistem Informasi UPNVJ.",
    url: "https://www.youtube.com/embed/WV3rSsxRyb4?si=gA9Nrks6Grfqx0sm",
  },
  cta: {
    title: "Kenali Arah Gerak Kabinet Vidyakatra",
    description:
      "Lihat profil, nilai, dan struktur kerja kabinet yang menggerakkan HIMA D3 Sistem Informasi.",
    buttonText: "Lihat Profil Kabinet",
    buttonLink: "/profil",
    enabled: true,
  },
}
