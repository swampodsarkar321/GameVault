export type DownloadMirror = {
  name: string
  url: string
  provider: string
  size?: string
  type?: string
}

export type Requirements = {
  os: string
  cpu: string
  ram: string
  gpu: string
  storage: string
}

export type Game = {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  coverImage: string
  screenshots: string[]
  genre: string[]
  developer: string
  publisher: string
  releaseDate: string
  version: string
  size: string
  platform: string[]
  requirements: {
    minimum: Requirements
    recommended: Requirements
  }
  downloads: DownloadMirror[]
  featured: boolean
  popular: boolean
  trailer?: string
  createdAt?: any
}

export type Software = {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  logo: string
  coverImage: string
  screenshots: string[]
  category: string
  developer: string
  license: string
  version: string
  size: string
  platform: string[]
  features: string[]
  downloads: DownloadMirror[]
  featured: boolean
  popular: boolean
  createdAt?: any
}

export type Category = { id: string; name: string; slug: string; type: 'game' | 'software' | 'both'; icon?: string; count?: number }
export type UserProfile = { uid: string; email: string; displayName?: string; isAdmin?: boolean; createdAt?: any; favoritesCount?: number }
export type FavoriteItem = { id: string; userId: string; itemId: string; itemType: 'game' | 'software'; createdAt: any }

export const GAME_GENRES = ["Action","Adventure","RPG","Strategy","Simulation","Racing","Sports","Indie","Horror","Puzzle","Platformer","Shooter","Free Games","Open Source"] as const
export const SOFTWARE_CATEGORIES = ["Browser","Multimedia","Graphics","Video Editing","Audio","Development","Security","Utility","Office","Compression","Other"] as const
export const PLATFORMS = ["Windows 10","Windows 11"] as const
