// src/stores/games.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Game, GameCategory } from '@/types/game.ts'

export const useGameStore = defineStore('games', () => {
  const games = ref<Game[]>([
    // HTML5 Games (iframe)
    {
      id: 'stickman-hook',
      title: 'Stickman Hook',
      description: 'Swing through levels and avoid obstacles.',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQb9e_QMOr5fW67QTsl5J0go_f_7CYmiBSpzQ&s',
      embedUrl: 'https://html5gameshq.com/iframed/cut-the-rope/',
      gameType: 'iframe',
      category: 'arcade',
      tags: ['action', 'skill'],
      featured: true,
      addedDate: new Date().toISOString(),
    },
    {
      id: 'cut-the-rope',
      title: 'Cut the Rope',
      description: 'Feed candy to Om Nom!',
      thumbnail: 'https://imgs.crazygames.com/cut-the-rope-ebx_16x9/20240530085010/cut-the-rope-ebx_16x9-cover?metadata=none&quality=60&height=6407',
      embedUrl: 'https://html5gameshq.com/iframed/cut-the-rope',
      gameType: 'iframe',
      category: 'puzzle',
      tags: ['physics', 'fun'],
      featured: false,
      addedDate: new Date().toISOString(),
    },

    // Flash Games (SWF)
    {
      id: 'bad-piggies',
      title: 'Bad Piggies',
      description: 'Classic Flash game powered by Ruffle emulator',
      thumbnail: 'https://i.ytimg.com/vi/YsCpDaSooWA/maxresdefault.jpg?sqp=-oaymwEmCIAKENAF8quKqQMa8AEB-AH-CYAC0AWKAgwIABABGFsgZShWMA8=&rs=AOn4CLA-tc-dFs9Xw3ZgaNwGVulJSBuygg',
      swfUrl: 'https://cdn.jsdelivr.net/gh/bubbls/UGS-file-encryption@785251c510413f75ce4ccc3530b91f523f03fda8/IpvdsF8mGgh7u4.swf',
      gameType: 'flash',
      category: 'arcade',
      tags: ['flash', 'classic', 'retro'],
      featured: true,
      addedDate: new Date().toISOString(),
    },
    {
      id: 'happy-wheels',
      title: 'Happy Wheels',
      description: 'Classic Flash game powered by Ruffle emulator',
      thumbnail: 'https://m.media-amazon.com/images/M/MV5BYTY1YWQxMTAtMjhiNy00NTJhLTg3NTMtM2NlOTA3ZDdlMTYxXkEyXkFqcGc@._V1_.jpg',
      swfUrl: 'https://cdn.jsdelivr.net/gh/bubbls/UGS-file-encryption@97af31ec5b7d4858652ff2304c42200dc472fc7d/HappyWheels.swf',
      gameType: 'flash',
      category: 'arcade',
      tags: ['flash', 'classic', 'retro'],
      featured: true,
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