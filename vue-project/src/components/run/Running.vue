<template>
  <div class="running-container">
    <!-- 상단 영역 -->
    <div class="header">
      <div class="pace">
        <p class="value">{{ pace }}</p>
        <p class="label">페이스</p>
      </div>
      <div class="time">
        <p class="value">{{ elapsedTime }}</p>
        <p class="label">시간</p>
      </div>
    </div>
    <div v-for="(point, index) in store.course" :key="index">
      <p>위도: {{ point.latitude }}, 경도: {{ point.longitude }}</p>
    </div>
    <!-- 거리 정보 -->
    <div class="distance">
      <p class="value">{{ distance.toFixed(2) }}</p>
      <p class="label">킬로미터</p>
    </div>

    <!-- 하단 버튼 -->
    <div class="button-group">
      <button 
        class="control-button" 
        v-if="!isPaused" 
        @click="pauseRunning">
        <img src="@/assets/run/pause.png" alt="pause" />
      </button>
      <div v-else class="paused-controls">
        <button class="control-button" @click="resumeRunning">
          <img class="play" src="@/assets/run/play.png" alt="play" />
        </button>
        <button class="control-button" @click="stopRunning">
          <img src="@/assets/run/stop.png" alt="stop" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRunStore } from "@/stores/run";

// Store 가져오기
const store = useRunStore();

// Pinia Store에서 상태 가져오기
const isPaused = computed(() => store.isPaused);

// 기타 상태 관리
const timerIntervalId = ref(null); // 타이머 간격 ID
const locationIntervalId = ref(null); // 위치 추적 간격 ID
const elapsedTime = ref("00:00");
const distance = ref(0);
const pace = ref("0'00\"");

// 런닝 시작
const startRunning = () => {
  store.init();
  store.start();
  startTimer();
  startLocationTracking();
};

// 런닝 정지
const stopRunning = () => {
  store.end();
  clearIntervals();
  store.resultSend(); // DB 전송
};

// 타이머 시작
const startTimer = () => {
  const startTime = Date.parse(store.runResult.startTime);

  const updateTimer = () => {
    if (isPaused.value) return; // 일시정지 상태면 타이머 업데이트 중단
    const now = Date.now();
    const pausedTime = store.pausedDuration * 1000;

    const elapsed = Math.floor((now - startTime - pausedTime) / 1000);
    if (elapsed >= 0) {
      const minutes = Math.floor(elapsed / 60).toString().padStart(2, "0");
      const seconds = (elapsed % 60).toString().padStart(2, "0");
      elapsedTime.value = `${minutes}:${seconds}`;
      calculatePace(elapsed); // pace 계산
    } else {
      elapsedTime.value = "00:00";
    }
  };

  if (timerIntervalId.value) clearInterval(timerIntervalId.value);
  timerIntervalId.value = setInterval(updateTimer, 1000);
  updateTimer(); // 즉시 첫 업데이트 실행
};

// 위치 추적 시작
const startLocationTracking = () => {
  const updateLocation = () => {
    if (!isPaused.value) {
      store.getCurrentLocation();
      distance.value = store.runResult.distance;
    }
    const size = store.course.length
  };

  if (locationIntervalId.value) clearInterval(locationIntervalId.value);
  locationIntervalId.value = setInterval(updateLocation, 2000);
  updateLocation(); // 즉시 첫 업데이트 실행
};

// 페이스 계산
const calculatePace = (elapsed) => {
  if (distance.value > 0) {
    const paceMinutes = Math.floor((elapsed / 60) / distance.value);
    const paceSeconds = Math.floor((elapsed % 60) / distance.value);
    pace.value = `${paceMinutes}'${paceSeconds.toString().padStart(2, "0")}"`;
    console.log("pace : " , pace)
  } else {
    pace.value = "0'00\"";
  }
};

// 일시정지
const pauseRunning = () => {
  store.pause();
  store.getCurrentLocation(); // 위치 정보 추가
  distance.value = store.runResult.distance; // 거리 갱신
  clearInterval(timerIntervalId.value); // 타이머 멈춤
};

// 재개
const resumeRunning = () => {
  store.resume();
  store.getCurrentLocation(); // 위치 정보 추가
  distance.value = store.runResult.distance; // 거리 갱신
  startTimer(); // 타이머 재개
  startLocationTracking(); // 위치 추적 재개
};

const clearIntervals = () => {
  if (timerIntervalId.value) clearInterval(timerIntervalId.value);
  if (locationIntervalId.value) clearInterval(locationIntervalId.value);
};

onMounted(() => {
  startRunning();
});

onUnmounted(() => {
  clearIntervals();
});
</script>



<style scoped>
/* 전체 컨테이너 */
.running-container {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background-color: #fab058; /* 배경 색상 */
}

/* 상단 영역 */
.header {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 20px;
}

.header .value {
  margin-left: 5px;
}

.pace,
.time {
  text-align: center;
}

.value {
  font-size: 3rem;
  font-weight: bold;
  color: #000;
}

.label {
  font-size: 1.5rem;
  color: #555;
  margin-top: 5px;
}

/* 거리 정보 */
.distance {
  text-align: center;
  margin: 40px 0;
}

.distance .value {
  font-size: 8rem;
  font-weight: bold;
  color: #000;
}

.distance .label {
  font-size: 1.5rem;
  color: #555;
}

/* 버튼 그룹 */
.button-group {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

/* 개별 버튼 */
.control-button {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  margin: 0 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.control-button img {
  width: 40%;
}

.control-button .play {
  margin-left: 10px;
  width: 45%;
}

.control-button:hover {
  background-color: #333;
}

/* 일시정지 상태의 버튼 그룹 */
.paused-controls {
  display: flex;
  gap: 20px; /* 버튼 간 간격 */
}
</style>
