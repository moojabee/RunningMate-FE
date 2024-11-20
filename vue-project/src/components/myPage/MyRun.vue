<template>
  <div>
    <h3>러닝 기록</h3>
    <table>
      <thead>
        <tr>
          <th>기록 ID</th>
          <th>거리 (km)</th>
          <th>페이스</th>
          <th>시작 시간</th>
          <th>이미지</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="run in runs" :key="run.recordId">
          <td>{{ run.recordId }}</td>
          <td>{{ run.dist }}</td>
          <td>{{ run.pace }}</td>
          <td>{{ run.startTime }}</td>
          <td>
            <img :src="run.runImg || '/src/assets/default-run.png'" alt="러닝 이미지" width="100" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useMyPageStore();
const runs = ref([]);

onMounted(async () => {
  const userId = route.params.userId;
  runs.value = await store.getUserRun(userId);
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
