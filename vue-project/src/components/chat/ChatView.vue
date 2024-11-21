<template>
    <div>
        <nav v-if="$route.name !== 'entryRoom'">
            <RouterLink :to="{ name: 'privateChatList' }">채팅방</RouterLink> |
            <RouterLink :to="{ name: 'openChatList' }">오픈 채팅방</RouterLink> |
            <RouterLink :to="{ name: 'createChat' }"> + </RouterLink> |
        </nav>
        <RouterView/>
    </div>
</template>

<script setup>

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>