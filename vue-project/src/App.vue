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

onMounted(() => {
  if (!sessionStorage.getItem('session')) {
    router.push({name:'login'}); // main으로 리다이렉트
  }
});

</script>

<style scoped>

</style>