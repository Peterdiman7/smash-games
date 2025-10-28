<!-- src/views/LandingPage.vue -->
<template>
    <div class="landing-page">
        <!-- Show game list when no game is selected -->
        <GameList v-if="!selectedGameId" @selectGame="selectGame" />

        <!-- Show HTML5/iframe game player -->
        <GamePlayer v-else-if="selectedGame?.gameType === 'iframe'" :gameId="selectedGameId" @close="closeGame" />

        <!-- Show Flash game player -->
        <FlashGamePlayer v-else-if="selectedGame?.gameType === 'flash'" :gameId="selectedGameId" @close="closeGame" />

        <!-- Optional fallback if gameType is unknown -->
        <div v-else class="unsupported-game">
            <p>Unsupported game type!</p>
            <button @click="closeGame">Back to games</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/games'
import GameList from '@/components/GameList.vue'
import GamePlayer from '@/components/GamePlayer.vue'
import FlashGamePlayer from '@/components/FlashGamePlayer.vue'

const gameStore = useGameStore()

// Track the selected game ID
const selectedGameId = ref<string | null>(null)

// Get the selected game from the store
const selectedGame = computed(() =>
    selectedGameId.value ? gameStore.getGameById(selectedGameId.value) : null
)

// Called when a game is selected
function selectGame(gameId: string) {
    selectedGameId.value = gameId
}

// Close the game and return to the list
function closeGame() {
    selectedGameId.value = null
}
</script>

<style scoped>
.landing-page {
    width: 100%;
    min-height: 100vh;
    background: #f0f0f0;
}

.unsupported-game {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
}

.unsupported-game p {
    font-size: 18px;
    margin-bottom: 20px;
}

.unsupported-game button {
    padding: 10px 20px;
    background: #4caf50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.unsupported-game button:hover {
    background: #45a049;
}
</style>
