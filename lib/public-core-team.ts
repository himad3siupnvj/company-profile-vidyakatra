import { getPublicCoreTeamAssets } from "@/lib/core-team-assets"

const coreTeamDefinitions = [
  {
    slug: "sekretaris",
    type: "Pengurus Inti",
    name: "Sekretaris",
    description:
      "Mengelola administrasi, surat-menyurat, notulensi, dan kerapian dokumen organisasi.",
    programs: ["Surat Menyurat", "Notulensi", "Arsip Kabinet"],
    responsibilities: [
      "Menjaga tata kelola surat masuk dan surat keluar organisasi.",
      "Menyusun notulensi rapat serta mendistribusikan hasil keputusan.",
      "Mengelola arsip dan dokumen kabinet secara tertib.",
    ],
  },
  {
    slug: "bendahara",
    type: "Pengurus Inti",
    name: "Bendahara",
    description:
      "Mengatur pencatatan keuangan, perencanaan anggaran, dan transparansi kebutuhan dana kegiatan.",
    programs: ["Anggaran", "Laporan Keuangan", "Kas Kegiatan"],
    responsibilities: [
      "Menyusun perencanaan anggaran kabinet dan kegiatan.",
      "Mencatat pemasukan serta pengeluaran secara transparan.",
      "Menyiapkan laporan dan evaluasi keuangan organisasi.",
    ],
  },
  {
    slug: "koordinator",
    type: "Pengurus Inti",
    name: "Koordinator",
    description:
      "Menjaga sinkronisasi antarbidang, mengawal ritme program kerja, dan memastikan koordinasi kabinet berjalan efektif.",
    programs: ["Koordinasi Bidang", "Monitoring Program", "Evaluasi Kerja"],
    responsibilities: [
      "Menghubungkan kebutuhan koordinasi antarunit kerja.",
      "Memantau kemajuan dan hambatan program kerja kabinet.",
      "Mendorong evaluasi berkala serta tindak lanjut hasil rapat.",
    ],
  },
] as const

export async function getPublicCoreTeams() {
  const assets = await getPublicCoreTeamAssets()

  return coreTeamDefinitions.map((team) => ({
    ...team,
    logo: assets[team.slug],
  }))
}

export async function getPublicCoreTeam(slug: string) {
  const teams = await getPublicCoreTeams()
  return teams.find((team) => team.slug === slug)
}
