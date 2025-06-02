<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
    <header>
        <nav>
            <div class="container">
                <h1>Catálogo de Filmes</h1>
                <button class="mobile-menu-toggle" @click="toggleMobileMenu" aria-label="Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
                <div class="nav-links" :class="{ 'nav-links--open': mobileMenuOpen }">
                    <router-link to="/" @click="mobileMenuOpen = false">Home</router-link>
                    <router-link to="/search" @click="mobileMenuOpen = false">Buscar</router-link>
                    <router-link to="/favorites" @click="mobileMenuOpen = false">Favoritos</router-link>
                </div>
            </div>
        </nav>
    </header>

    <main class="container">
        <router-view />
    </main>

    <footer>
        <div class="container">
            <p>Catálogo de Filmes - Desenvolvido com Laravel e Vue.js</p>
        </div>
    </footer>
</template>

<style>
/* Utilizando as variáveis CSS do design system */
.container {
    max-width: var(--container-max-width);
    margin: 0 auto;
    padding: 0 var(--spacing-md);
}

header {
    background-color: var(--color-background-header);
    color: var(--color-text);
    padding: var(--spacing-md) 0;
}

nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    position: relative;
}

.nav-links {
    display: flex;
    gap: var(--spacing-lg);
}

.nav-links a {
    color: var(--color-text);
    text-decoration: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    transition: background-color var(--transition-normal), color var(--transition-normal);
}

.nav-links a:hover,
.nav-links a.router-link-active {
    background-color: var(--color-background-hover);
}

.mobile-menu-toggle {
    display: none;
    flex-direction: column;
    justify-content: space-between;
    width: 30px;
    height: 21px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    z-index: 10;
}

.mobile-menu-toggle span {
    width: 100%;
    height: 3px;
    background-color: var(--color-text);
    border-radius: 3px;
    transition: all var(--transition-normal);
}

@media (max-width: 768px) {
    .mobile-menu-toggle {
        display: flex;
    }
    
    .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 70%;
        max-width: 300px;
        height: 100vh;
        background-color: var(--color-background-header);
        flex-direction: column;
        padding: 80px var(--spacing-lg) var(--spacing-lg);
        transition: right var(--transition-normal);
        z-index: 5;
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
    }
    
    .nav-links--open {
        right: 0;
    }
    
    .nav-links a {
        padding: var(--spacing-md);
        width: 100%;
        text-align: center;
    }
}

main {
    min-height: calc(100vh - 180px);
    padding: var(--spacing-xl) 0;
}

footer {
    background-color: var(--color-background-header);
    color: var(--color-text);
    text-align: center;
    padding: var(--spacing-md) 0;
}
</style>
