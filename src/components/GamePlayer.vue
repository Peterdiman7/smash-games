<!-- src/components/GamePlayer.vue -->
<template>
    <div class="game-player">
        <div class="game-header">
            <button class="back-btn" @click="$emit('close')">
                ← Back to Games
            </button>
            <h2>{{ game?.title }}</h2>
            <button class="fullscreen-btn" @click="toggleFullscreen">
                {{ isFullscreen ? '⛶' : '⛶' }} Fullscreen
            </button>
        </div>

        <div class="game-container" ref="gameContainer">
            <iframe v-show="!loading" @load="loading = false" v-if="game" ref="gameFrame"
                :src="game.embedUrl || game.path" frameborder="0" allowfullscreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms" class="game-iframe"></iframe>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/games'
import type { Game } from '@/types/game'

const loading = ref(true)

const props = defineProps<{
    gameId: string
}>()

const emit = defineEmits<{
    close: []
}>()

const gameStore = useGameStore()
const gameContainer = ref<HTMLDivElement>()
const gameFrame = ref<HTMLIFrameElement>()
const isFullscreen = ref(false)

const game = computed<Game | undefined>(() =>
    gameStore.getGameById(props.gameId)
)

const toggleFullscreen = async () => {
    if (!gameContainer.value) return

    if (!document.fullscreenElement) {
        await gameContainer.value.requestFullscreen()
        isFullscreen.value = true
    } else {
        await document.exitFullscreen()
        isFullscreen.value = false
    }
}

const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement
}

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.game-player {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #1a1a1a;
    z-index: 1000;
    display: flex;
    flex-direction: column;
}

.game-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    background: #2a2a2a;
    color: white;
}

.game-header h2 {
    margin: 0;
    font-size: 20px;
}

.back-btn,
.fullscreen-btn {
    padding: 8px 16px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
}

.back-btn:hover,
.fullscreen-btn:hover {
    background: #45a049;
}

.game-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: hidden;
}

.game-iframe {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    max-height: 800px;
    background: white;
    border-radius: 8px;
}

.game-container:fullscreen .game-iframe {
    max-width: 100%;
    max-height: 100%;
    border-radius: 0;
}
</style>