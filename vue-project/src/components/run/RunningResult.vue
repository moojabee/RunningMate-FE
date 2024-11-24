<template>
  <div class="result-container">
    <!-- 상단 영역 -->
    <div class="header">
      <button class="back-button" @click="goBack">←</button>
      <p class="date">{{ runningData.date }}</p>
      <button class="back-button">←</button>
    </div>

    <!-- 거리 정보 -->
    <div class="distance">
      <p class="value">{{ runningData.distance }}</p>
      <p class="label">킬로미터</p>
    </div>

    <!-- 기록 정보 -->
    <div class="stats">
      <div class="stat-item">
        <p class="value">{{ runningData.pace }}</p>
        <p class="label">페이스</p>
      </div>
      <div class="stat-item">
        <p class="value">{{ runningData.time }}</p>
        <p class="label">시간</p>
      </div>
    </div>

    <!-- 기타 정보 -->
    <div class="extra-info">
      <div class="info-item">
        <p class="value">{{ runningData.elevation }}</p>
        <p class="label">고도 상승</p>
      </div>
      <div class="info-item">
        <p class="value">{{ runningData.calories }}</p>
        <p class="label">칼로리</p>
      </div>
    </div>

    <!-- 경로 이미지 -->
    <div class="route-map">
      <img :src="runningData.mapImage" alt="Running Route" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// 런닝 기록 데이터 (샘플 데이터, API 연동 시 업데이트 가능)
const runningData = ref({
  date: "2024. 10. 29.",
  distance: "2.98",
  pace: "6'50''",
  time: "20:25",
  elevation: "20m",
  calories: "195",
  mapImage: "@/assets/run/map.png", // 경로 이미지
});

// 뒤로 가기
const goBack = () => {
  router.push({ name: "run" });
};
</script>

<style scoped>
/* 전체 컨테이너 */
.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  height: 100%;
}

/* 상단 영역 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ff5722;
}

.date {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
}

/* 거리 정보 */
.distance {
  text-align: left; /* 왼쪽 정렬 */
  margin: 10px 0;
  width: 100%; /* 전체 영역 사용 */
}

.distance .value {
  font-size: 5rem;
  font-weight: bold;
  color: #000;
}

.distance .label {
  font-size: 1.5rem;
  color: #555;
}

/* 기록 정보 */
.stats {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 10px 0;
}

.stat-item {
  text-align: left; /* 왼쪽 정렬 */
  width: 45%; /* 각 항목의 공간 비율 조정 */
}

.stat-item .value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
}

.stat-item .label {
  font-size: 1.2rem;
  color: #555;
}

/* 기타 정보 */
.extra-info {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin: 20px 0;
}

.info-item {
  text-align: left; /* 왼쪽 정렬 */
  width: 45%; /* 각 항목의 공간 비율 조정 */
}

.info-item .value {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
}

.info-item .label {
  font-size: 1.2rem;
  color: #555;
}

/* 경로 이미지 */
.route-map {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.route-map img {
  width: 90%;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
</style>
