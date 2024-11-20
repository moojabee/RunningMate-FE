<template>
  <div>
    <UserAuthView />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import UserAuthView from './views/UserAuthView.vue';

const router = useRouter();
</script>

<style scoped>

</style>