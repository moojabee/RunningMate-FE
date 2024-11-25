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
  
  const getCurrentLocation = function (){
    console.log(JSON.stringify(course.value))
    if (longitude.value == 0 && navigator.geolocation){
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latitude.value = position.coords.latitude;
          longitude.value = position.coords.longitude;

          course.value.push({ latitude, longitude });
        },
        (error) => {
          console.error("GPS 정보를 가져오는 데 실패했습니다.", error);
        })
      }
      else {
        // 자이로센서 및 가속도계 코드
        if (window.DeviceMotionEvent) {
          let lastTimestamp = null;
          let velocityX = 0;
          let velocityY = 0;
    
          window.addEventListener("devicemotion", (event) => {
            if (!lastTimestamp) {
              lastTimestamp = event.timeStamp;
              return;
            }
    
            // 시간 간격 계산
            const dt = (event.timeStamp - lastTimestamp) / 1000; // 초 단위
            lastTimestamp = event.timeStamp;
    
            // 가속도 데이터 가져오기
            const accelerationX = event.acceleration.x || 0;
            const accelerationY = event.acceleration.y || 0;
    
            // 속도 업데이트 (v = u + at)
            velocityX += accelerationX * dt;
            velocityY += accelerationY * dt;
    
            // 위치 업데이트 (s = ut + 0.5at^2)
            const deltaX = velocityX * dt + 0.5 * accelerationX * dt * dt;
            const deltaY = velocityY * dt + 0.5 * accelerationY * dt * dt;
    
            // 위도, 경도 업데이트
            latitude.value += deltaY * 0.00001; // 임의의 변환 비율
            longitude.value += deltaX * 0.00001;
    
            // 코스에 추가
            course.value.push({ latitude: latitude.value, longitude: longitude.value });
    
            // 거리 갱신
            const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2); // 이동 거리 계산
            runResult.value.distance += distance;
          });
        } else {
          console.error("DeviceMotionEvent를 지원하지 않는 브라우저입니다.");
        }
      }
  }

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
