<template>
    <div>
        <nav>
        <RouterLink :to="{name: 'board'}">board</RouterLink> |
        <RouterLink :to="{name: 'board'}">chat</RouterLink> |
        <RouterLink :to="{name: 'board'}">running</RouterLink> |
        <RouterLink :to="{name: 'board'}">mypage</RouterLink>
        </nav>
        <RouterView/>
    </div>
</template>

<script setup>

</script>

<style scoped>
    nav {
        text-align: center;
    }
    nav a {
        font-weight: bold;
        text-decoration: none;
        color: black;
    }
    nav a.router-link-exact-active {
        color: darkgoldenrod;
    }
</style>