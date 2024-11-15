<template>
    <div>
        <nav>
          <RouterLink :to="{ name: 'privateChatList' }">채팅방</RouterLink> |
          <RouterLink :to="{ name: 'openChatList' }">오픈 채팅방</RouterLink>
        </nav>
        <RouterView/>
    </div>
</template>

<script setup>

</script>

<style scoped>

</style>