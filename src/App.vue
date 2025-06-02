<script setup></script>

<template>
    <header>
        <nav>
            <div class="container">
                <h1>Catálogo de Filmes</h1>
                <div class="nav-links">
                    <router-link to="/">Home</router-link>
                    <router-link to="/search">Buscar</router-link>
                    <router-link to="/favorites">Favoritos</router-link>
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
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    background-color: #0f172a;
    color: white;
    padding: 1rem 0;
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
}

.nav-links {
    display: flex;
    gap: 20px;
}

.nav-links a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
    background-color: #1e293b;
}

main {
    min-height: calc(100vh - 180px);
    padding: 2rem 0;
}

footer {
    background-color: #0f172a;
    color: white;
    text-align: center;
    padding: 1rem 0;
}
</style>
