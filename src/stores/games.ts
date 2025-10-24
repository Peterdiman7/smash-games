// src/stores/games.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Game, GameCategory } from '@/types/game.ts'

export const useGameStore = defineStore('games', () => {
  const games = ref<Game[]>([
    {
      id: 'stickman-hook',
      title: 'Stickman Hook',
      description: 'Swing through levels and avoid obstacles.',
      thumbnail: 'https://img.gamedistribution.com/5555a355a6a34e9f9fba7b5748b63de2-512x512.jpeg',
      embedUrl: 'https://html5gameshq.com/iframed/cut-the-rope/',
      category: 'arcade',
      tags: ['action', 'skill'],
      featured: true,
      addedDate: new Date().toISOString(),
    },
    {
      id: 'cut-the-rope',
      title: 'Cut the Rope',
      description: 'Feed candy to Om Nom!',
      thumbnail: 'https://img.gamedistribution.com/22dc19a8b38a43c995729b7cb69e06cc-512x512.jpeg',
      embedUrl: 'https://html5gameshq.com/iframed/cut-the-rope',
      category: 'puzzle',
      tags: ['physics', 'fun'],
      featured: false,
      addedDate: new Date().toISOString(),
    },
  ])


  const categories = ref<GameCategory[]>([
    { id: 'arcade', name: 'Arcade' },
    { id: 'puzzle', name: 'Puzzle' },
    { id: 'action', name: 'Action' },
    { id: 'strategy', name: 'Strategy' },
    { id: 'sports', name: 'Sports' },
  ])

  const featuredGames = computed(() =>
    games.value.filter(game => game.featured)
  )

  const getGamesByCategory = computed(() => {
    return (categoryId: string) =>
      games.value.filter(game => game.category === categoryId)
  })

  const getGameById = computed(() => {
    return (id: string) =>
      games.value.find(game => game.id === id)
  })

  function addGame(game: Game) {
    games.value.push(game)
  }

  function removeGame(id: string) {
    const index = games.value.findIndex(game => game.id === id)
    if (index > -1) {
      games.value.splice(index, 1)
    }
  }

  return {
    games,
    categories,
    featuredGames,
    getGamesByCategory,
    getGameById,
    addGame,
    removeGame,
  }
})