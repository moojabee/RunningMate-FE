<template>
  <div class="run-list">
    <div 
      v-for="run in runs" 
      :key="run.recordId" 
      class="run-card"
      @click="goToRunDetails(run.recordId)"
    >
      <!-- 런닝 이미지 -->
      <img
        v-if="run.runImg"
        :src="run.runImg"
        alt="프로필 사진"
        class="run-img"
      />
      <img
        v-else
        src="/src/assets/default-run.png"
        alt="기본 프로필 사진"
        class="run-img"
      />

      <!-- 런닝 정보 -->
      <div class="run-info">
        <p class="run-date">{{ formatDate(run.startTime) }}</p>
        <div class="run-stats">
          <span class="run-dist">거리: {{ run.dist }} km</span>
          <span class="run-pace">페이스: {{ run.pace }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useMyPageStore();
const runs = ref([]);

// 날짜 포맷 함수
const formatDate = (dateTime) => {
  const date = new Date(dateTime);
  return `${date.getFullYear()}. ${String(date.getMonth() + 1).padStart(2, "0")}. ${String(date.getDate()).padStart(2, "0")}`;
};

// 런닝 상세 페이지 이동
const goToRunDetails = (recordId) => {
  console.log(`Go to run details for recordId: ${recordId}`);
  // 나중에 상세 페이지로 이동 로직 추가
};

// 데이터 로드
onMounted(async () => {
  const userId = route.params.userId;
  runs.value = await store.getUserRun(userId);
});
</script>

<style scoped>
.run-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
}

.run-card {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
}

.run-card:hover {
  background-color: #f9f9f9;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3); /* hover 시 그림자 강조 */
}

.run-img {
  width: 60px;
  height: 60px;
  border-radius: 10%;
  object-fit: cover;
  margin-right: 15px;
}

.run-info {
  display: flex;
  flex-direction: column;
}

.run-date {
  font-weight: bold;
  margin-bottom: 10px;
}

.run-stats {
  display: flex;
  justify-content: flex-start;
  gap: 20px; /* 거리와 평균 페이스 사이 간격 */
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
}

.run-dist,
.run-pace {
  white-space: nowrap;
}
</style>
