export const officialSocialLinks = {
  instagram: {
    label: "Instagram",
    handle: "@himad3si_upnvj",
    href: "https://www.instagram.com/himad3si_upnvj?igsh=cDEzaTl3Y3dnbm0=",
  },
  youtube: {
    label: "YouTube",
    handle: "HIMA D3SI UPNVJ",
    href: "https://youtube.com/@himad3siupnvj?si=8PEq4uJAALyE4cHJ",
  },
  linkedin: {
    label: "LinkedIn",
    handle: "HIMA D3SI UPNVJ",
    href: "https://www.linkedin.com/company/hima-d3si-upnvj-himpunan-mahasiswa-d3-sistem-informasi-upnvj/",
  },
  tiktok: {
    label: "TikTok",
    handle: "@himad3si_upnvj",
    href: "https://www.tiktok.com/@himad3si_upnvj?_r=1&_t=ZS-96bDCzDu1o1",
  },
} as const

export type SocialMediaUrls = {
  instagram: string
  youtube: string
  linkedin: string
  tiktok: string
}

export const officialSocialUrls: SocialMediaUrls = {
  instagram: officialSocialLinks.instagram.href,
  youtube: officialSocialLinks.youtube.href,
  linkedin: officialSocialLinks.linkedin.href,
  tiktok: officialSocialLinks.tiktok.href,
}
