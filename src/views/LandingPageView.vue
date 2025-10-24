<!-- src/views/LandingPageView.vue -->
<template>
    <div class="landing-page">
        <header class="hero">
            <h1>🎮 Smash Games</h1>
            <p>Play the best HTML5 games directly in your browser!</p>
        </header>

        <GamePlayer v-if="selectedGameId" :game-id="selectedGameId" @close="selectedGameId = null" />

        <GameList v-else @selectGame="handleSelectGame" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GameList from '@/components/GameList.vue'
import GamePlayer from '@/components/GamePlayer.vue'

const selectedGameId = ref<string | null>(null)

const handleSelectGame = (gameId: string) => {
    selectedGameId.value = gameId
}
</script>

<style scoped>
.landing-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.hero {
    text-align: center;
    padding: 60px 20px 40px;
    color: white;
}

.hero h1 {
    font-size: 48px;
    margin: 0 0 16px 0;
    font-weight: 700;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.hero p {
    font-size: 20px;
    margin: 0;
    opacity: 0.9;
}

@media (max-width: 768px) {
    .hero h1 {
        font-size: 36px;
    }

    .hero p {
        font-size: 16px;
    }
}
</style>