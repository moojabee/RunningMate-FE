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
    router.push({name:'login'});
  }
});

</script>

<style scoped>

</style>