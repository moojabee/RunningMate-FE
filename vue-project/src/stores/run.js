/*기본코드*/
import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import Swal from 'sweetalert2';

const REST_API_URL=import.meta.env.VITE_REST_API_URL

export const useRunStore = defineStore('run', () =>{
    const token = ref(sessionStorage.getItem('session')); // 인증 토큰

    // 인증 헤더 생성
    const getAuthHeaders = () => ({
      Authorization: token.value,
    });

    const course = ref([])
    const runResult = ref({
        runImg:'',
        startTime:'',
        endTime:'',
        distance:0,
    })

    const init = function(){
        runResult.value.runImg='';
        runResult.value.startTime='';
        runResult.value.endTime='';
        runResult.value.distance=0;
    }

    const start = function(){
        runResult.value.startTime=new Date().toISOString().slice(0, 19);
    }

    const end = function(){
        runResult.value.endTime=new Date().toISOString().slice(0, 19);
    }

    const addDistance = function() {
        const size = course.value.length;
        if (size < 2) return;
    
        const diff_lat = course.value[size - 2].latitude - course.value[size - 1].latitude;
        const diff_lon = course.value[size - 2].longitude - course.value[size - 1].longitude;

        // 단순 차이로 거리 계산 (위도, 경도 차이 더하기)
        const distanceBetween = Math.sqrt(
            Math.pow(diff_lat, 2) + Math.pow(diff_lon, 2)
        );
    
        // 거리 누적
        runResult.value.distance += distanceBetween;
        console.log('현재 총 거리:', runResult.value.distance);
    };

    const getCurrentLocation = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;  // 위도
                    const longitude = position.coords.longitude;  // 경도
    
                    // course 배열에 현재 위치 추가
                    course.value.push({ latitude, longitude });
                    console.log('경로에 추가된 위치:', course.value);

                    addDistance();
                },
                (error) => {
                    console.error('GPS 정보를 가져오는 데 실패했습니다.', error);
                }
            );
        } else {
            console.error('이 브라우저는 GPS를 지원하지 않습니다.');
        }
    };

    const resultSend = function(){
        // 요청 중 로딩 표시
        showLoading('잠시만 기다려 주세요...', '결과를 전송중입니다.');
        axios({
            url:`${REST_API_URL}/run/record`,
            method:'POST',
            data:runResult,
            headers:getAuthHeaders(),
        })
        .then((res)=>{
            Swal.fire({
                icon: 'success',
                title: '완료',
                text: '결과 전송 완료',
            }).then(() => {
                router.push({ name: 'runningResult' }); // 성공 시 로그인 페이지로 이동
            });
        })
        .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '결과 전송 실패',
            });
        });
    }

    return { course, runResult, init,start,end,getCurrentLocation,resultSend}
})