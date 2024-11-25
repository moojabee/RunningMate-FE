import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";

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
  
        // 가속도 증가 계수 설정 (보수적으로 증가)
        const accelerationFactor = 0.1;
  
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
  
          // 가속도 보수적으로 증가
          accelerationX = accelerationX * (1 - accelerationFactor) + event.acceleration.x * accelerationFactor;
          accelerationY = accelerationY * (1 - accelerationFactor) + event.acceleration.y * accelerationFactor;
          accelerationZ = accelerationZ * (1 - accelerationFactor) + event.acceleration.z * accelerationFactor;
  
          // 속도 업데이트 (v = u + at)
          velocityX += accelerationX * dt;
          velocityY += accelerationY * dt;
          velocityZ += accelerationZ * dt;
  
          // 감속 적용 (빠르게 감소)
          velocityX *= decelerationFactor;
          velocityY *= decelerationFactor;
          velocityZ *= decelerationFactor;
  
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
  
  

  /**추가 사항 */
  // const getCurrentLocation = function () {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const latitude = position.coords.latitude;
  //         const longitude = position.coords.longitude;

  //         course.value.push({ latitude, longitude });
  //         addDistance();
  //       },
  //       (error) => {
  //         console.error("GPS 정보를 가져오는 데 실패했습니다.", error);
  //       }
  //     );
  //   }
  // };

  // const addDistance = function () {
  //   const size = course.value.length;
  //   if (size < 2 || isPaused.value) return; // 일시정지 상태에서 거리 계산 방지

  //   const diffLat = course.value[size - 2].latitude - course.value[size - 1].latitude;
  //   const diffLon = course.value[size - 2].longitude - course.value[size - 1].longitude;
    
  //   const distanceBetween = Math.sqrt(Math.pow(diffLat, 2) + Math.pow(diffLon, 2));
  //   runResult.value.distance += distanceBetween;
  // };

  const resultSend = function () {
    Swal.fire("잠시만 기다려 주세요...", "결과를 전송 중입니다.", "info");
  
    const formattedRunResult = {
      ...runResult.value,
      startTime: formatToLocalDateTime(runResult.value.startTime),
      endTime: formatToLocalDateTime(runResult.value.endTime),
    };
  
    console.log("Formatted Run Result: ", formattedRunResult); // 디버깅 로그 추가
  
    axios({
      url: `${REST_API_URL}/run/record`,
      method: "POST",
      data: formattedRunResult,
      headers: getAuthHeaders(),
    })
      .then(() => {
        console.log("결과 전송 성공!");
        Swal.fire({
          icon: "success",
          title: "완료",
          text: "결과 전송 완료",
        }).then(() => {
          window.location.href = "/runningResult";
        });
      })
      .catch((error) => {
        console.error("결과 전송 실패: ", error.response?.data || error.message);
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "결과 전송 실패",
        });
      });
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
