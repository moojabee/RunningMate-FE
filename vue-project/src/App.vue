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

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
</style>