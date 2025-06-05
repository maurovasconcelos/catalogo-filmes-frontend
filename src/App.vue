<script setup>
import { ref } from 'vue';

const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<template>
    <header class="bg-gray-800 text-white py-4">
        <nav>
            <div class="max-w-7xl mx-auto px-4 flex justify-between items-center">
                <h1 class="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Catálogo de Filmes</h1>
                
                <button class="flex flex-col justify-between w-[30px] h-[21px] bg-transparent border-none cursor-pointer p-0 z-10 md:hidden" @click="toggleMobileMenu" aria-label="Menu">
                    <span class="block w-full h-0.5 bg-white"></span>
                    <span class="block w-full h-0.5 bg-white"></span>
                    <span class="block w-full h-0.5 bg-white"></span>
                </button>
                
                <div class="hidden md:flex gap-6">
                    <router-link to="/" class="text-white no-underline px-3 py-2 rounded-md transition-colors hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg" :class="{ 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg': $route.path === '/' }">Home</router-link>
                    <router-link to="/search" class="text-white no-underline px-3 py-2 rounded-md transition-colors hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg" :class="{ 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg': $route.path.startsWith('/search') }">Buscar</router-link>
                    <router-link to="/favorites" class="text-white no-underline px-3 py-2 rounded-md transition-colors hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:shadow-lg" :class="{ 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg': $route.path.startsWith('/favorites') }">Favoritos</router-link>
                </div>
                
                <div class="md:hidden fixed inset-0 bg-gray-800 bg-opacity-95 z-50 flex flex-col items-center justify-center gap-8" v-if="mobileMenuOpen">
                    <router-link to="/" @click="mobileMenuOpen = false" class="text-white text-xl no-underline px-5 py-3 rounded-md transition-colors hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500" :class="{ 'bg-gradient-to-r from-purple-500 to-pink-500': $route.path === '/' }">Home</router-link>
                    <router-link to="/search" @click="mobileMenuOpen = false" class="text-white text-xl no-underline px-5 py-3 rounded-md transition-colors hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500" :class="{ 'bg-gradient-to-r from-purple-500 to-pink-500': $route.path.startsWith('/search') }">Buscar</router-link>
                    <router-link to="/favorites" @click="mobileMenuOpen = false" class="text-white text-xl no-underline px-5 py-3 rounded-md transition-colors hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500" :class="{ 'bg-gradient-to-r from-purple-500 to-pink-500': $route.path.startsWith('/favorites') }">Favoritos</router-link>
                </div>
            </div>
        </nav>
    </header>

    <main class="max-w-7xl mx-auto px-4">
        <router-view />
    </main>

    <footer class="bg-gray-800 text-white py-4 mt-8">
        <div class="max-w-7xl mx-auto px-4">
            <p>Catálogo de Filmes - Desenvolvido com Laravel e Vue.js</p>
        </div>
    </footer>
</template>

<style>
</style>
