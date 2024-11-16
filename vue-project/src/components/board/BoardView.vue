<template>
    <div>
        <nav v-if="$route.name !== 'boardCreate' && $route.name !== 'boardUpdate'">
          <RouterLink :to="{ name: 'followBoardList' }">팔로우 게시글</RouterLink> |
          <RouterLink :to="{ name: 'neighborBoardList' }">동네 게시글</RouterLink> |
          <RouterLink :to="{ name: 'boardCreate' }">(+)게시글 생성</RouterLink>

        </nav>
        <RouterView/>
    </div>
</template>

<script setup>

</script>

<style  scoped>

</style>