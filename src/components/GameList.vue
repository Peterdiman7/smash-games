<!-- src/components/GameList.vue -->
<template>
    <div class="game-list">
        <div class="filter-bar">
            <button v-for="category in categories" :key="category.id"
                :class="['category-btn', { active: selectedCategory === category.id }]"
                @click="selectedCategory = category.id">
                {{ category.name }}
            </button>
            <button :class="['category-btn', { active: selectedCategory === 'all' }]" @click="selectedCategory = 'all'">
                All Games
            </button>
        </div>

        <div class="games-grid">
            <div v-for="game in filteredGames" :key="game.id" class="game-card" @click="$emit('selectGame', game.id)">
                <div class="game-thumbnail">
                    <img :src="game.thumbnail" :alt="game.title" />

                    <!-- Game Type Badge -->
                    <span v-if="game.gameType === 'flash'" class="game-type-badge flash">
                        ⚡ Flash
                    </span>
                    <span v-else-if="game.gameType === 'html5'" class="game-type-badge html5">
                        🌐 HTML5
                    </span>

                    <button class="play-btn" @click.stop="$emit('selectGame', game.id)">
                        Play Now
                    </button>
                </div>
                <div class="game-info">
                    <h3>{{ game.title }}</h3>
                    <p>{{ game.description }}</p>
                    <div class="game-tags">
                        <span v-for="tag in game.tags" :key="tag" class="tag">
                            {{ tag }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/games'

const gameStore = useGameStore()
const selectedCategory = ref('all')

const categories = computed(() => gameStore.categories)

const filteredGames = computed(() => {
    if (selectedCategory.value === 'all') {
        return gameStore.games
    }
    return gameStore.getGamesByCategory(selectedCategory.value)
})

defineEmits<{
    selectGame: [id: string]
}>()
</script>

<style scoped>
.game-list {
    padding: 20px;
}

.filter-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.category-btn {
    padding: 10px 20px;
    border: 2px solid #ddd;
    background: white;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
    font-weight: 500;
}

.category-btn:hover {
    border-color: #4CAF50;
    color: #4CAF50;
}

.category-btn.active {
    background: #4CAF50;
    color: white;
    border-color: #4CAF50;
}

.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
}

.game-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
}

.game-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.game-thumbnail {
    position: relative;
    padding-top: 60%;
    background: #f5f5f5;
    overflow: hidden;
}

.game-thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.game-type-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    z-index: 2;
    backdrop-filter: blur(10px);
}

.game-type-badge.flash {
    background: rgba(255, 152, 0, 0.9);
    color: white;
}

.game-type-badge.html5 {
    background: rgba(33, 150, 243, 0.9);
    color: white;
}

.game-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.game-card:hover .game-overlay {
    opacity: 1;
}

.play-btn {
    padding: 12px 32px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
}

.play-btn:hover {
    transform: scale(1.05);
}

.game-info {
    padding: 16px;
}

.game-info h3 {
    margin: 0 0 8px 0;
    font-size: 18px;
    color: #333;
}

.game-info p {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #666;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.game-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.tag {
    padding: 4px 10px;
    background: #f0f0f0;
    border-radius: 12px;
    font-size: 12px;
    color: #666;
}
</style>