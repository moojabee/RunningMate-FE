<template>
    <div>
        <nav>
        <RouterLink :to="{name: 'board'}">board</RouterLink> |
        <RouterLink :to="{name: 'chat'}">chat</RouterLink> |
        <RouterLink :to="{name: 'board'}">running</RouterLink> |
        <RouterLink
            :to="{ name: 'myPage', params: { userId: userAuthStore.userId } }"
            :key="userAuthStore.userId">myPage</RouterLink>
        </nav>
        <RouterView/>
    </div>
</template>

<script setup>
import { useUserAuthStore } from "@/stores/userAuth";
const userAuthStore = useUserAuthStore();
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