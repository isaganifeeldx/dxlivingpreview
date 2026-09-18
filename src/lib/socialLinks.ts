export interface SocialLinks {
  facebook: string
  linkedIn: string
  instagram: string
  youtube: string
}

export const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  facebook: 'https://www.facebook.com/dxlivingaustralia',
  linkedIn: 'https://www.linkedin.com/company/108389291',
  instagram: 'https://www.instagram.com/dxliving.au/',
  youtube: 'https://www.youtube.com/@DXLVNG',
}

const linkValue = (value: unknown, fallback: string) => {
  if (typeof value !== 'string') return fallback
  const trimmedValue = value.trim()
  if (!trimmedValue) return fallback

  return trimmedValue.startsWith('/') || /^https?:\/\//i.test(trimmedValue)
    ? trimmedValue
    : fallback
}

export const mapSocialLinks = (links?: {
  facebook?: string | null
  linkedIn?: string | null
  linked_in?: string | null
  instagram?: string | null
  youtube?: string | null
}): SocialLinks => ({
  facebook: linkValue(links?.facebook, DEFAULT_SOCIAL_LINKS.facebook),
  linkedIn: linkValue(
    links?.linkedIn ?? links?.linked_in,
    DEFAULT_SOCIAL_LINKS.linkedIn,
  ),
  instagram: linkValue(links?.instagram, DEFAULT_SOCIAL_LINKS.instagram),
  youtube: linkValue(links?.youtube, DEFAULT_SOCIAL_LINKS.youtube),
})

/** Map Settings footer.social[] into the flat SocialLinks shape used by UI/SEO. */
export function socialLinksFromSettings(
  social: Array<{ platform: 'facebook' | 'linkedin' | 'instagram' | 'youtube'; href: string }>,
): SocialLinks {
  const byPlatform = Object.fromEntries(
    social.map((item) => [item.platform, item.href]),
  ) as Partial<Record<'facebook' | 'linkedin' | 'instagram' | 'youtube', string>>

  return mapSocialLinks({
    facebook: byPlatform.facebook,
    linkedIn: byPlatform.linkedin,
    instagram: byPlatform.instagram,
    youtube: byPlatform.youtube,
  })
}
