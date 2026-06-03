export const profileContentKey = "profileContent"

export type ProfileMission = {
  id: number
  text: string
  enabled: boolean
}

export type ProfileValue = {
  id: number
  title: string
  description: string
  icon: "star" | "lightbulb" | "heart" | "target"
  enabled: boolean
}

export type ProfileLeader = {
  id: number
  group: string
  name: string
  position: string
  description: string
  imageKey: "ketuaLead" | "wakilLead"
  enabled: boolean
}

export type ProfileContent = {
  intro: {
    eyebrow: string
    title: string
    subtitle: string
    cabinetName: string
    tagline: string
    description: string
  }
  philosophy: {
    title: string
    description: string
    enabled: boolean
  }
  vision: {
    title: string
    description: string
    enabled: boolean
  }
  missions: ProfileMission[]
  values: ProfileValue[]
  leaders: ProfileLeader[]
}

export const defaultProfileContent: ProfileContent = {
  intro: {
    eyebrow: "Tentang Kami",
    title: "Profil HIMA D3 SI",
    subtitle: "Mengenal kabinet, arah gerak, dan struktur kerja HIMA D3 Sistem Informasi",
    cabinetName: "Kabinet Vidyakatra",
    tagline: "Bersatu dalam Pengetahuan, Bertumbuh dalam Kebersamaan Satu Tujuan",
    description:
      "Vidyakatra menjadi cerminan filosofi kabinet bahwa kemajuan tidak lahir dari kompetisi semata, tetapi dari sinergi antara pengetahuan, karakter, dan solidaritas.",
  },
  philosophy: {
    title: "Filosofi Organisasi",
    description:
      "Vidyakatra menggambarkan harmoni antara intelektualitas dan solidaritas. Ilmu tidak berdiri sendiri. Ia tumbuh dan bermakna karena ada kebersamaan yang menguatkan. Kabinet Vidyakatra hadir sebagai simbol integrasi antara kecerdasan intelektual dan empati sosial.",
    enabled: true,
  },
  vision: {
    title: "Visi",
    description:
      'Mewujudkan Himpunan Mahasiswa D3 Sistem Informasi UPN "Veteran" Jakarta yang aktif dan kolaboratif sebagai wadah pengembangan, pemberdayaan, serta penyambung informasi bagi seluruh keluarga mahasiswa dalam kegiatan akademik maupun non-akademik yang inklusif, berkembang, dan berkelanjutan demi mencapai tujuan bersama.',
    enabled: true,
  },
  missions: [
    {
      id: 1,
      text: "Mengembangkan dan memfasilitasi kegiatan akademik maupun non-akademik untuk meningkatkan kemampuan, menyalurkan bakat, dan memperkuat solidaritas mahasiswa melalui pendekatan adaptif dan kolaboratif.",
      enabled: true,
    },
    {
      id: 2,
      text: "Menjadi penghubung yang responsif dan transparan antara fakultas dan mahasiswa dalam penyampaian informasi serta komunikasi.",
      enabled: true,
    },
    {
      id: 3,
      text: "Meningkatkan kapasitas kepemimpinan dan keorganisasian anggota melalui pembinaan, pelatihan, dan keterlibatan aktif di HIMA.",
      enabled: true,
    },
    {
      id: 4,
      text: "Membangun lingkungan organisasi yang suportif dan kolaboratif yang berorientasi pada pemberdayaan individu dan budaya kerja berkelanjutan.",
      enabled: true,
    },
  ],
  values: [
    { id: 1, title: "Integritas", description: "Menjunjung tinggi kejujuran dan etika dalam setiap tindakan", icon: "target", enabled: true },
    { id: 2, title: "Inovasi", description: "Selalu berinovasi dan mengikuti perkembangan teknologi", icon: "lightbulb", enabled: true },
    { id: 3, title: "Kolaborasi", description: "Bekerja sama untuk mencapai tujuan bersama", icon: "heart", enabled: true },
    { id: 4, title: "Dedikasi", description: "Berkomitmen penuh dalam setiap kegiatan dan tanggung jawab", icon: "star", enabled: true },
  ],
  leaders: [
    {
      id: 1,
      group: "Ketua Umum",
      name: "Sakhaa Sayyidah Kurniawan",
      position: "Ketua Umum",
      description:
        "Mengawal arah gerak kabinet, menjaga visi organisasi, serta memastikan setiap program kerja berjalan selaras dengan kebutuhan mahasiswa. Ketua umum berperan dalam membangun komunikasi strategis, menjaga budaya kolaboratif, dan mengarahkan kabinet agar tetap produktif, inklusif, dan berdampak.",
      imageKey: "ketuaLead",
      enabled: true,
    },
    {
      id: 2,
      group: "Wakil Ketua",
      name: "Latanza Akbar Fadilah",
      position: "Wakil Ketua",
      description:
        "Mendampingi ketua umum dalam menjaga ritme kerja kabinet, memperkuat koordinasi internal, serta memastikan setiap departemen dan biro dapat bergerak secara terarah. Wakil ketua berperan dalam menjaga kesinambungan program, evaluasi kerja, dan komunikasi antarbagian agar kabinet tetap solid.",
      imageKey: "wakilLead",
      enabled: true,
    },
  ],
}

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value))
}

export function normalizeProfileContent(value: unknown): ProfileContent {
  if (!isObject(value)) return defaultProfileContent

  const intro = isObject(value.intro) ? value.intro : {}
  const philosophy = isObject(value.philosophy) ? value.philosophy : {}
  const vision = isObject(value.vision) ? value.vision : {}

  return {
    intro: {
      ...defaultProfileContent.intro,
      ...intro,
    },
    philosophy: {
      ...defaultProfileContent.philosophy,
      ...philosophy,
    },
    vision: {
      ...defaultProfileContent.vision,
      ...vision,
    },
    missions: Array.isArray(value.missions) ? (value.missions as ProfileMission[]) : defaultProfileContent.missions,
    values: Array.isArray(value.values) ? (value.values as ProfileValue[]) : defaultProfileContent.values,
    leaders: Array.isArray(value.leaders) ? (value.leaders as ProfileLeader[]) : defaultProfileContent.leaders,
  }
}
