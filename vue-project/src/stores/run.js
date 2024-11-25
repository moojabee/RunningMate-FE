import { ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import Swal from "sweetalert2";

const REST_API_URL = import.meta.env.VITE_REST_API_URL;

export const useRunStore = defineStore("run", () => {
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
    if (size < 2) return;

    const diffLat = course.value[size - 2].latitude - course.value[size - 1].latitude;
    const diffLon = course.value[size - 2].longitude - course.value[size - 1].longitude;

    const distanceBetween = Math.sqrt(Math.pow(diffLat, 2) + Math.pow(diffLon, 2));
    runResult.value.distance += distanceBetween;
  };

  const resultSend = function () {
    Swal.fire("잠시만 기다려 주세요...", "결과를 전송 중입니다.", "info");
    axios({
      url: `${REST_API_URL}/run/record`,
      method: "POST",
      data: runResult.value,
    })
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "완료",
          text: "결과 전송 완료",
        }).then(() => {
          window.location.href = "/runningResult";
        });
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "오류",
          text: "결과 전송 실패",
        });
      });
  };

  return {
    course, runResult, pausedDuration, lastPauseTime, isPaused,
    init, start, end, pause, resume, getCurrentLocation, resultSend,
  };
});
