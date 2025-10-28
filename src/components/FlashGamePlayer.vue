<!-- src/components/FlashGamePlayer.vue -->
<template>
    <div class="flash-game-player">
        <div class="game-header">
            <button class="back-btn" @click="$emit('close')">
                ← Back to Games
            </button>
            <h2>{{ game?.title }}</h2>
            <button class="fullscreen-btn" @click="toggleFullscreen">
                ⛶ Fullscreen
            </button>
        </div>

        <div class="game-container" ref="gameContainer">
            <div v-if="loading" class="loading-screen">
                <div class="spinner"></div>
                <p>Loading Flash game...</p>
                <p class="loading-note">This may take a moment</p>
            </div>

            <div ref="ruffleContainer" class="ruffle-container" :style="{ display: loading ? 'none' : 'block' }">
                <!-- Ruffle will inject the Flash player here -->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '@/stores/games'
import type { Game } from '@/types/game'

const props = defineProps<{
    gameId: string
}>()

const emit = defineEmits<{
    close: []
}>()

const gameStore = useGameStore()
const gameContainer = ref<HTMLDivElement>()
const ruffleContainer = ref<HTMLDivElement>()
const isFullscreen = ref(false)
const loading = ref(true)
const rufflePlayer = ref<any>(null)

const game = computed<Game | undefined>(() =>
    gameStore.getGameById(props.gameId)
)

const loadRuffle = async () => {
    try {
        // Load Ruffle from CDN
        if (!(window as any).RufflePlayer) {
            const script = document.createElement('script')
            script.src = 'https://unpkg.com/@ruffle-rs/ruffle'
            document.head.appendChild(script)

            await new Promise((resolve) => {
                script.onload = resolve
            })
        }

        const RufflePlayer = (window as any).RufflePlayer
        const ruffle = RufflePlayer.newest()

        if (ruffleContainer.value && game.value) {
            const player = ruffle.createPlayer()
            ruffleContainer.value.appendChild(player)

            // Load the SWF file
            const swfUrl = game.value.swfUrl || game.value.path
            if (swfUrl) {
                await player.load(swfUrl)
                rufflePlayer.value = player
                loading.value = false
            }
        }
    } catch (error) {
        console.error('Error loading Ruffle:', error)
        loading.value = false
    }
}

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
    loadRuffle()
})

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange)

    // Clean up Ruffle player
    if (rufflePlayer.value) {
        rufflePlayer.value.destroy()
    }
})
</script>

<style scoped>
.flash-game-player {
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
    background: #000;
}

.loading-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: white;
    gap: 16px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: #4CAF50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-note {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
}

.ruffle-container {
    width: 100%;
    height: 100%;
    max-width: 1200px;
    max-height: 800px;
}

.ruffle-container :deep(ruffle-player) {
    width: 100% !important;
    height: 100% !important;
}

.game-container:fullscreen .ruffle-container {
    max-width: 100%;
    max-height: 100%;
}
</style>