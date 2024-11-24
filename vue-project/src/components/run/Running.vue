<template>
  <div class="running-container">
    <!-- 상단 영역 -->
    <div class="header">
      <div class="pace">
        <p class="value">7'15"</p>
        <p class="label">페이스</p>
      </div>
      <div class="time">
        <p class="value">08:20</p>
        <p class="label">시간</p>
      </div>
    </div>

    <!-- 거리 정보 -->
    <div class="distance">
      <p class="value">1.14</p>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isPaused = ref(false); // 현재 일시정지 상태인지 여부

// 일시정지 로직
const pauseRunning = () => {
  isPaused.value = true;
  console.log("기록 측정이 일시정지되었습니다.");
};

// 다시 시작 로직
const resumeRunning = () => {
  isPaused.value = false;
  console.log("기록 측정이 재개되었습니다.");
};

// 정지 로직
const stopRunning = () => {
  console.log("기록 측정을 종료하고 결과 페이지로 이동합니다.");
  router.push({ name: "runningResult" });
};
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
