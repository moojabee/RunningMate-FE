<template>
    <div>
        <nav>
          <RouterLink :to="{ name: 'followBoardList' }">팔로우 게시글</RouterLink> |
          <RouterLink :to="{ name: 'neighborBoardList' }">동네 게시글</RouterLink>
        </nav>
        <RouterView/>
    </div>
</template>

<script setup>

</script>

<style  scoped>

</style>