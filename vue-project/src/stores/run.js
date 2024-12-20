import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";
import router from '@/router'

const REST_API_URL = import.meta.env.VITE_REST_API_URL;

export const useRunStore = defineStore("run", () => {
  const token = ref(sessionStorage.getItem('session'));
  const getAuthHeaders = () => ({
    Authorization: token.value
  });

  const course = ref([]);
  const runResult = ref({
    runImg: "",
    startTime: "",
    endTime: "",
    distance: 0,
  });

  /** lat long 추가*/
  const latitude = ref(0);
  const longitude = ref(0);

  const pausedDuration = ref(0);
  const lastPauseTime = ref(null);
  const isPaused = ref(false);

  const init = function () {
    runResult.value.startTime = "";
    runResult.value.endTime = "";
    runResult.value.distance = 0;
    pausedDuration.value = 0;
    lastPauseTime.value = null;
    isPaused.value = false;
    course.value = [];
  };

  const start = function () {
    runResult.value.startTime = new Date().toISOString();
  };

  const end = function () {
    runResult.value.endTime = new Date().toISOString();
  };

  const pause = function () {
    if (!isPaused.value) {
      lastPauseTime.value = Date.now();
      isPaused.value = true;
    }
  };

  const resume = function () {
    if (isPaused.value && lastPauseTime.value) {
      pausedDuration.value += Math.floor((Date.now() - lastPauseTime.value) / 1000);
      lastPauseTime.value = null;
      isPaused.value = false;
    }
  };
  const getCurrentLocation = function () {
    if (longitude.value == 0 && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;
  
          course.value.push({ latitude, longitude });
          addDistance();
        },
        (error) => {
          console.error("GPS 정보를 가져오는 데 실패했습니다.", error);
        }
      );
    } else {
      // 자이로센서 및 가속도계 코드
      if (window.DeviceMotionEvent) {
        let lastTimestamp = null;
        let velocityX = 0,
          velocityY = 0,
          velocityZ = 0;
  
        // 감속 계수 설정 (빠르게 속도를 줄임)
        const decelerationFactor = 0.9;
  
        // 노이즈 임계값 (아주 작은 값 무시)
        const noiseThreshold = 0.01;
  
        // 칼만 필터 초기화
        const kalmanFilter = {
          Q: 0.01, // 프로세스 노이즈
          R: 0.1,  // 측정 노이즈
          x: 0,    // 상태 변수
          P: 1,    // 오차 공분산
          K: 0,    // 칼만 이득
          update(measurement) {
            // 예측 단계
            this.P += this.Q;
  
            // 업데이트 단계
            this.K = this.P / (this.P + this.R);
            this.x += this.K * (measurement - this.x);
            this.P *= 1 - this.K;
  
            return this.x;
          },
        };
  
        window.addEventListener("devicemotion", (event) => {
          if (!lastTimestamp) {
            lastTimestamp = event.timeStamp;
            return;
          }
  
          // 시간 간격 계산
          const dt = (event.timeStamp - lastTimestamp) / 1000; // 초 단위
          lastTimestamp = event.timeStamp;
  
          // 가속도 데이터 가져오기 및 칼만 필터 적용
          let accelerationX = kalmanFilter.update(event.acceleration.x || 0);
          let accelerationY = kalmanFilter.update(event.acceleration.y || 0);
          let accelerationZ = kalmanFilter.update(event.acceleration.z || 0);
  
          // 노이즈 처리 (아주 작은 값은 0으로 처리)
          accelerationX = Math.abs(accelerationX) < noiseThreshold ? 0 : accelerationX;
          accelerationY = Math.abs(accelerationY) < noiseThreshold ? 0 : accelerationY;
          accelerationZ = Math.abs(accelerationZ) < noiseThreshold ? 0 : accelerationZ;
  
          // 속도 업데이트 (v = u + at)
          velocityX += accelerationX * dt;
          velocityY += accelerationY * dt;
          velocityZ += accelerationZ * dt;
  
          // 감속 적용 (빠르게 감소, 특정 값 이하로 떨어지면 0으로 설정)
          velocityX = Math.abs(velocityX) < noiseThreshold ? 0 : velocityX * decelerationFactor;
          velocityY = Math.abs(velocityY) < noiseThreshold ? 0 : velocityY * decelerationFactor;
          velocityZ = Math.abs(velocityZ) < noiseThreshold ? 0 : velocityZ * decelerationFactor;
  
          // 거리 계산 (s = ut + 0.5at^2)
          const deltaX = velocityX * dt + 0.5 * accelerationX * dt * dt; // x축 이동 거리 (m)
          const deltaY = velocityY * dt + 0.5 * accelerationY * dt * dt; // y축 이동 거리 (m)
          const deltaZ = velocityZ * dt + 0.5 * accelerationZ * dt * dt; // z축 이동 거리 (m)
  
          // 총 이동 거리 (3D 거리 계산)
          const totalDistance = Math.sqrt(deltaX ** 2 + deltaY ** 2 + deltaZ ** 2) / 1000; // km 단위
  
          // 위도/경도 변환
          const deltaLatitude = deltaY / 111000; // 위도의 변화량
          const deltaLongitude = deltaX / (111000 * Math.cos((latitude.value * Math.PI) / 180)); // 경도의 변화량
  
          // 위도/경도 업데이트
          latitude.value += deltaLatitude;
          longitude.value += deltaLongitude;
  
          // 코스에 추가
          course.value.push({ latitude: latitude.value, longitude: longitude.value });
  
          // 이동 거리 갱신
          runResult.value.distance += totalDistance; // 누적 거리 (km 단위)
        });
      } else {
        console.error("DeviceMotionEvent를 지원하지 않는 브라우저입니다.");
      }
    }
  };
  

  const resultSend = async function () {
    Swal.fire("잠시만 기다려 주세요...", "결과를 전송 중입니다.", "info");
  
    const formattedRunResult = {
      ...runResult.value,
      startTime: formatToLocalDateTime(runResult.value.startTime),
      endTime: formatToLocalDateTime(runResult.value.endTime),
    };
  
    try {
      const response = await axios({
        url: `${REST_API_URL}/run/record`,
        method: "POST",
        data: formattedRunResult,
        headers: getAuthHeaders(),
      });
  
      const savedResult = response.data;
      runResult.value = savedResult; // 응답 데이터 저장
      course.value = [...course.value]; // 코스 데이터 유지
      console.log("결과 : ", runResult.value);
      console.log("course값 : ", course.value);
  
      Swal.fire({
        icon: "success",
        title: "완료",
        text: "결과 전송 완료",
      }).then(() => {
        // SPA 방식으로 페이지 전환
        router.push({ name: "runningResult" });
      });
    } catch (error) {
      console.error("결과 전송 실패: ", error.response?.data || error.message);
      Swal.fire({
        icon: "error",
        title: "오류",
        text: "결과 전송 실패",
      });
    }
  };
  
  
  const formatToLocalDateTime = (isoTime) => {
    if (!isoTime) return null;
    const date = new Date(isoTime);
    const yyyy = date.getFullYear();
    const MM = (date.getMonth() + 1).toString().padStart(2, "0");
    const dd = date.getDate().toString().padStart(2, "0");
    const hh = date.getHours().toString().padStart(2, "0");
    const mm = date.getMinutes().toString().padStart(2, "0");
    const ss = date.getSeconds().toString().padStart(2, "0");
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}:${ss}`;
  };

  return {
    course, runResult, pausedDuration, lastPauseTime, isPaused,
    init,  start, end, pause, resume, getCurrentLocation, resultSend,
  };
});
