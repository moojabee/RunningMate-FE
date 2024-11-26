<template>
  <div class="result-container">
    <!-- 상단 영역 -->
    <div class="header">
      <button class="back-button" @click="goBack">←</button>
      <p class="date">{{ runningData.date }}</p>
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

    <!-- 경로 지도 -->
    <div class="route-map">
      <KakaoMap :lat="mapCenter.lat" :lng="mapCenter.lng" @onLoadKakaoMap="onLoadKakaoMap" style="width: 100%; height: 400px">
        <KakaoMapPolyline :latLngList="latLngList" />
      </KakaoMap>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { KakaoMap, KakaoMapPolyline } from "vue3-kakao-maps";
import { useRunStore } from "@/stores/run";
import { useRouter } from "vue-router";

const store = useRunStore();
const router = useRouter();

// 날짜 포맷 함수
const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  return isNaN(date) ? "" : `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
};

// 시간 포맷 함수
const formatTime = (startTime, endTime) => {
  const elapsedTime = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);
  const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, "0");
  const seconds = (elapsedTime % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

// 페이스 계산 함수
const calculatePace = (distance, elapsedTime) => {
  if (distance <= 0 || elapsedTime <= 0) return "0'00''";
  const totalSecondsPerKm = elapsedTime / distance;
  return `${Math.floor(totalSecondsPerKm / 60)}'${(totalSecondsPerKm % 60).toFixed(0).padStart(2, "0")}''`;
};

// 런닝 데이터
const runningData = computed(() => {
  const startTime = store.runResult.startTime;
  const endTime = store.runResult.endTime;
  return {
    date: formatDate(startTime),
    distance: store.runResult.distance.toFixed(2),
    pace: calculatePace(
      store.runResult.distance,
      Math.floor((new Date(endTime) - new Date(startTime)) / 1000)
    ),
    time: formatTime(startTime, endTime),
    course: store.course,
  };
});

// 경로 지도 중심 좌표 설정
const mapCenter = computed(() => ({
  lat: store.course?.[0]?.latitude || 37.450701,
  lng: store.course?.[0]?.longitude || 126.570667,
}));

// KakaoMapPolyline에 사용할 좌표 리스트 생성
const latLngList = computed(() =>
  store.course.map((point) => ({
    lat: point.latitude,
    lng: point.longitude,
  }))
);

// KakaoMap 로드 시 호출
const onLoadKakaoMap = (mapRef) => {
  const mapTypeControl = new kakao.maps.MapTypeControl();
  mapRef.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
  console.log("Polyline Coordinates: ", latLngList.value);
};

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
