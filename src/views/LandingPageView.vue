<!-- src/views/LandingPageView.vue -->
<template>
    <div class="landing-page">
        <!-- Navigation -->
        <nav class="navbar" :class="{ scrolled: isScrolled }">
            <div class="nav-container">
                <div class="nav-logo">
                    <span class="logo-icon">🎮</span>
                    <span class="logo-text">SmashGames</span>
                </div>
                <div class="nav-links">
                    <a href="#home" @click.prevent="scrollToSection('home')" class="nav-link">Home</a>
                    <div class="dropdown">
                        <a href="#games" @click.prevent="showGamesSection" class="nav-link">Games</a>
                        <div class="dropdown-content">
                            <a v-for="category in gameStore.categories" :key="category.id"
                                @click="selectCategory(category.id)">
                                {{ category.name }}
                            </a>
                            <a @click="selectCategory('all')">All Games</a>
                        </div>
                    </div>
                </div>
            </div>
        </nav>

        <!-- Hero Section -->
        <section v-if="!showGames" id="home" class="hero-section">
            <div class="hero-overlay"></div>
            <div class="hero-content">
                <h1 class="hero-title">
                    <span class="title-line">Play Your Favorite</span>
                    <span class="title-line gradient-text">Games Online</span>
                </h1>
                <p class="hero-subtitle">Thousands of games. Instant access. No downloads required.</p>
                <button class="cta-button" @click="showGamesSection">
                    Start Playing Now
                    <span class="button-arrow">→</span>
                </button>
            </div>
            <div class="hero-background">
                <div class="game-preview" v-for="(game, index) in featuredHeroGames" :key="index"
                    :style="{ animationDelay: `${index * 0.2}s` }">
                    <img :src="game.image" :alt="game.name" />
                </div>
            </div>
        </section>

        <!-- Top Games Section -->
        <section v-if="!showGames" class="top-games-section">
            <div class="section-container">
                <h2 class="section-title">Top Played Games</h2>
                <div class="top-games-grid">
                    <div v-for="game in gameStore.featuredGames" :key="game.id" class="top-game-card"
                        @click="selectGameToPlay(game.id)">
                        <div class="top-game-image">
                            <img :src="game.thumbnail" :alt="game.title" />
                            <div class="play-overlay">
                                <div class="play-icon">▶</div>
                            </div>
                            <span class="game-badge" :class="game.gameType">
                                {{ game.gameType === 'flash' ? '⚡ Flash' : '🌐 HTML5' }}
                            </span>
                        </div>
                        <div class="top-game-info">
                            <h3>{{ game.title }}</h3>
                            <p>{{ game.description }}</p>
                            <div class="game-meta">
                                <span class="meta-item">
                                    <span class="meta-icon">👥</span>
                                    {{ getRandomPlayers() }}
                                </span>
                                <span class="meta-item">
                                    <span class="meta-icon">⭐</span>
                                    {{ getRandomRating() }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Preview -->
        <section v-if="!showGames" class="categories-section">
            <div class="section-container">
                <h2 class="section-title">Browse by Category</h2>
                <div class="categories-grid">
                    <div v-for="category in gameStore.categories" :key="category.id" class="category-card"
                        @click="selectCategory(category.id)">
                        <div class="category-icon">{{ getCategoryIcon(category.id) }}</div>
                        <h3>{{ category.name }}</h3>
                        <p>{{ getCategoryGameCount(category.id) }} games</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Game List View -->
        <div v-if="showGames && !selectedGameId" class="games-view">
            <GameList @selectGame="selectGameToPlay" />
        </div>

        <!-- Game Player -->
        <GamePlayer v-if="selectedGameId && selectedGame?.gameType === 'iframe'" :gameId="selectedGameId"
            @close="closeGame" />
        <FlashGamePlayer v-else-if="selectedGameId && selectedGame?.gameType === 'flash'" :gameId="selectedGameId"
            @close="closeGame" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '@/stores/games'
import GameList from '@/components/GameList.vue'
import GamePlayer from '@/components/GamePlayer.vue'
import FlashGamePlayer from '@/components/FlashGamePlayer.vue'

const gameStore = useGameStore()
const selectedGameId = ref<string | null>(null)
const showGames = ref(false)
const isScrolled = ref(false)

const selectedGame = computed(() =>
    selectedGameId.value ? gameStore.getGameById(selectedGameId.value) : null
)

const featuredHeroGames = [
    { name: 'GTA V', image: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co2lbd.jpg' },
    { name: 'Fortnite', image: 'https://cdn2.unrealengine.com/26br-s26-egs-launcher-blade-2560x1440-2560x1440-3b4d3f68d8f7.jpg' },
    { name: 'Roblox', image: 'https://i.redd.it/6a6n98vwkxka1.jpg' },
    { name: 'Minecraft', image: 'https://www.minecraft.net/content/dam/games/minecraft/marketplace/mediablock-buzzybees.jpg' }
]

function selectGameToPlay(gameId: string) {
    selectedGameId.value = gameId
}

function closeGame() {
    selectedGameId.value = null
}

function showGamesSection() {
    showGames.value = true
    scrollToSection('games')
}

function selectCategory(categoryId: string) {
    showGames.value = true
    // The GameList component will handle the filtering
}

function scrollToSection(section: string) {
    if (section === 'home') {
        showGames.value = false
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
}

function getCategoryIcon(categoryId: string): string {
    const icons: Record<string, string> = {
        arcade: '🕹️',
        puzzle: '🧩',
        action: '⚔️',
        strategy: '🎯',
        sports: '⚽'
    }
    return icons[categoryId] || '🎮'
}

function getCategoryGameCount(categoryId: string): number {
    return gameStore.getGamesByCategory(categoryId).length
}

function getRandomPlayers(): string {
    const players = Math.floor(Math.random() * 10000) + 1000
    return players > 1000 ? `${(players / 1000).toFixed(1)}K` : `${players}`
}

function getRandomRating(): string {
    return (4 + Math.random()).toFixed(1)
}

function handleScroll() {
    isScrolled.value = window.scrollY > 50
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.landing-page {
    width: 100%;
    min-height: 100vh;
    background: #0a0a0a;
}

/* Navigation */
.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 20px 0;
    transition: all 0.3s ease;
    background: transparent;
}

.navbar.scrolled {
    background: rgba(10, 10, 10, 0.95);
    backdrop-filter: blur(10px);
    padding: 15px 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 24px;
    font-weight: 700;
    color: white;
    cursor: pointer;
}

.logo-icon {
    font-size: 32px;
    animation: bounce 2s infinite;
}

@keyframes bounce {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-5px);
    }
}

.logo-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.nav-links {
    display: flex;
    gap: 40px;
    align-items: center;
}

.nav-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    font-size: 16px;
    transition: all 0.3s;
    position: relative;
}

.nav-link::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s;
}

.nav-link:hover::after {
    width: 100%;
}

.dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    margin-top: 10px;
    background: rgba(20, 20, 20, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 10px;
    min-width: 200px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
}

.dropdown:hover .dropdown-content {
    display: block;
}

.dropdown-content a {
    display: block;
    padding: 12px 16px;
    color: white;
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s;
    cursor: pointer;
}

.dropdown-content a:hover {
    background: rgba(102, 126, 234, 0.2);
}

/* Hero Section */
.hero-section {
    position: relative;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(102, 126, 234, 0.3) 100%);
    z-index: 1;
}

.hero-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 900px;
    padding: 0 20px;
}

.hero-title {
    font-size: 72px;
    font-weight: 900;
    color: white;
    margin: 0 0 20px 0;
    line-height: 1.2;
}

.title-line {
    display: block;
}

.gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradient-shift 3s ease infinite;
    background-size: 200% 200%;
}

@keyframes gradient-shift {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.hero-subtitle {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 40px 0;
}

.cta-button {
    padding: 20px 50px;
    font-size: 18px;
    font-weight: 700;
    color: white;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(102, 126, 234, 0.6);
}

.button-arrow {
    transition: transform 0.3s;
}

.cta-button:hover .button-arrow {
    transform: translateX(5px);
}

.hero-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    gap: 20px;
    padding: 20px;
    z-index: 0;
}

.game-preview {
    flex: 1;
    height: 100%;
    border-radius: 20px;
    overflow: hidden;
    animation: float 6s ease-in-out infinite;
    opacity: 0.3;
}

.game-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

@keyframes float {

    0%,
    100% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-20px);
    }
}

/* Top Games Section */
.top-games-section {
    padding: 100px 0;
    background: #0a0a0a;
}

.section-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 40px;
}

.section-title {
    font-size: 48px;
    font-weight: 900;
    color: white;
    margin: 0 0 60px 0;
    text-align: center;
}

.top-games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
}

.top-game-card {
    background: rgba(20, 20, 20, 0.8);
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.top-game-card:hover {
    transform: translateY(-10px);
    border-color: #667eea;
    box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
}

.top-game-image {
    position: relative;
    padding-top: 60%;
    overflow: hidden;
}

.top-game-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.top-game-card:hover .top-game-image img {
    transform: scale(1.1);
}

.play-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.top-game-card:hover .play-overlay {
    opacity: 1;
}

.play-icon {
    width: 80px;
    height: 80px;
    background: rgba(102, 126, 234, 0.9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32px;
    color: white;
}

.game-badge {
    position: absolute;
    top: 15px;
    right: 15px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    backdrop-filter: blur(10px);
}

.game-badge.flash {
    background: rgba(255, 152, 0, 0.9);
    color: white;
}

.game-badge.iframe {
    background: rgba(33, 150, 243, 0.9);
    color: white;
}

.top-game-info {
    padding: 24px;
}

.top-game-info h3 {
    font-size: 24px;
    font-weight: 700;
    color: white;
    margin: 0 0 12px 0;
}

.top-game-info p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 16px 0;
    line-height: 1.6;
}

.game-meta {
    display: flex;
    gap: 20px;
}

.meta-item {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
}

.meta-icon {
    font-size: 16px;
}

/* Categories Section */
.categories-section {
    padding: 100px 0;
    background: linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 100%);
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 24px;
}

.category-card {
    background: rgba(20, 20, 20, 0.6);
    border: 2px solid rgba(102, 126, 234, 0.3);
    border-radius: 16px;
    padding: 40px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
}

.category-card:hover {
    transform: translateY(-5px);
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.1);
}

.category-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.category-card h3 {
    font-size: 20px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px 0;
}

.category-card p {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
}

/* Games View */
.games-view {
    padding-top: 100px;
    min-height: 100vh;
    background: #0a0a0a;
}

/* Responsive */
@media (max-width: 768px) {
    .hero-title {
        font-size: 48px;
    }

    .hero-subtitle {
        font-size: 18px;
    }

    .nav-links {
        gap: 20px;
    }

    .section-title {
        font-size: 36px;
    }

    .hero-background {
        flex-wrap: wrap;
    }

    .game-preview {
        flex-basis: 48%;
    }
}
</style>