// src/types/game.ts
export interface Game {
  id: string
  title: string
  description: string
  thumbnail: string
  path?: string // Local path (optional)
  embedUrl?: string // NEW: for external iframe URLs
  category: string
  tags: string[]
  featured: boolean
  addedDate: string
  swfUrl?: string // For Flash/SWF games
  gameType?: 'html5' | 'flash' | 'iframe' // Game type
}

export interface GameCategory {
  id: string
  name: string
  icon?: string
}