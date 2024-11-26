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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          course.value.push({ latitude, longitude });
          addDistance();
        },
        (error) => {
          console.error("GPS 정보를 가져오는 데 실패했습니다.", error);
        }
      );
    }
  };

  const addDistance = function () {
    const size = course.value.length;
    if (size < 2 || isPaused.value) return; // 일시정지 상태에서 거리 계산 방지

    const diffLat = course.value[size - 2].latitude - course.value[size - 1].latitude;
    const diffLon = course.value[size - 2].longitude - course.value[size - 1].longitude;

    const distanceBetween = Math.sqrt(Math.pow(diffLat, 2) + Math.pow(diffLon, 2));
    runResult.value.distance += distanceBetween;
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
