<template>
  <div class="home-container">
    <!-- 상단 로고 -->
    <img v-show="!isCounting" src="@/assets/logo.png" alt="LSWR 로고" class="logo" />

    <!-- 문구 -->
    <div v-show="!isCounting" class="main-text">
      <p class="headline">Together!</p>
      <p class="subline">To You!</p>
    </div>

    <!-- 시작 버튼 -->
    <button v-show="!isCounting" class="start-button" @click="startCountdown">
      <img src="@/assets/menu/Run.png" alt="run" class="run-icon" />
      <p>start</p>
    </button>

    <!-- 카운트다운 -->
    <div v-if="isCounting" class="countdown">
      <p class="zoom" :key="countdown">{{ countdown }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const isCounting = ref(false); // 카운트다운 여부
const countdown = ref(3); // 초기 카운트다운 값

// 카운트다운 시작
const startCountdown = () => {
  isCounting.value = true; // 카운트다운 상태 활성화
  const interval = setInterval(() => {
    if (countdown.value > 1) {
      countdown.value -= 1; // 숫자 감소
    } else {
      clearInterval(interval); // 카운트다운 종료
      router.push({ name: "running" }); // Running.vue로 이동
    }
  }, 1000); // 1초 간격
};
</script>

<style scoped>
/* 전체 컨테이너 */
.home-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #fab058; /* 배경 색상 */
  position: relative;
}

/* 로고 */
.logo {
  width: 350px;
  height: auto;
  margin-bottom: 30px;
}

/* 메인 텍스트 */
.main-text {
  text-align: center;
  margin: 30px 0;
}

.headline {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  font-family: "Roboto", sans-serif; /* 글씨체 설정 */
}

.subline {
  font-size: 3rem;
  font-weight: bold;
  color: #333;
  font-family: "Roboto", sans-serif; /* 글씨체 설정 */
}

/* 시작 버튼 */
.start-button {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(150deg, #ff6c6c, #ff9d68);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin: 30px 0;
}

.run-icon {
  width: 55%;
}

.start-button p {
  color: black;
  font-size: 2.2rem;
  font-weight: bold;
  text-align: center;
  font-family: "Roboto", sans-serif;
}

.start-button:hover {
  background: linear-gradient(135deg, #ff5555, #7a55d0);
  transform: scale(1.1);
  transition: all 0.3s ease;
}

/* 카운트다운 */
.countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.countdown .zoom {
  font-size: 10rem;
  font-weight: bold;
  color: #333;
  animation: zoom-in-out 1s ease-in-out forwards;
}

/* Zoom In/Out 효과 */
@keyframes zoom-in-out {
  0% {
    transform: scale(0.8);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.5);
    opacity: 1;
  }
}
</style>
