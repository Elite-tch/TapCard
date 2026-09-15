export interface SocialLinks {
  linkedin?: string
  x?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  github?: string
  youtube?: string
  custom?: { label: string; url: string }[]
}

export interface UserProfile {
  id: string
  email: string
  username: string
  fullName: string
  profilePhotoUrl?: string
  jobTitle?: string
  bio?: string
  location?: string

  phone?: string
  whatsapp?: string
  publicPhone: boolean
  publicWhatsapp: boolean
  publicEmail: boolean
  publicLocation: boolean

  website?: string
  socialLinks: SocialLinks

  isPublic: boolean

  createdAt: string
  updatedAt: string
}

export interface PublicUserProfile {
  username: string
  fullName: string
  profilePhotoUrl?: string
  jobTitle?: string
  bio?: string
  location?: string
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  socialLinks: SocialLinks
  updatedAt: string
}
