import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import Swal from 'sweetalert2';

const REST_API_URL=import.meta.env.VITE_REST_API_URL

export const useUserAuthStore = defineStore('userAuth', () => {
    
    const user = ref({});
    const userId = ref(0);
    const token = ref('');

    const showLoading = (title, text) => {
        Swal.fire({
          title: title,
          text: text,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
      };

    const login = function (email, password) {
        showLoading('로그인 중...', '잠시만 기다려 주세요.');
        console.log(email , password);
        axios
          .post(`${REST_API_URL}/userAuth/login`, {
            email: email,
            password: password,
          })
          .then((res) => {
            // 로그인 성공 처리
            console.log(res)
            user.value = res.data;
            token.value = res.headers['Authorization'];
            sessionStorage.setItem('userId', user.value.userId);
            userId.value = user.value.userId;
            sessionStorage.setItem('userNickname',user.value.nickname)
            sessionStorage.setItem('session', token.value);
            Swal.fire({
              icon: 'success',
              title: '로그인 성공',
              text: `${user.value.nickname}님 안녕하세요!`,
            }).then(() => {
              router.push({ name: 'main' }); // 성공 시 메인 페이지로 이동
            });
          })
          
          .catch((err) => {
            // 로그인 실패 처리
            Swal.fire({
              icon: 'error',
              title: '로그인 실패',
              text: '아이디 또는 비밀번호를 확인해주세요.',
            });
          });
      };

      const logout = function () {
        Swal.fire({
          title: "로그아웃 하시겠습니까?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "로그아웃",
          cancelButtonText: "취소",
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {
            user.value = {};
            sessionStorage.removeItem("userId");
            sessionStorage.removeItem("userNickname");
            sessionStorage.removeItem("session");
            router.push({ name: "login" });
      
            Swal.fire({
              title: "로그아웃 완료!",
              text: "로그아웃되었습니다.",
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
          }
        });
      };
    const findPassword = function(email){
        // 요청 중 로딩 표시
        showLoading('잠시만 기다려 주세요...', '비밀번호 변경 요청을 처리 중입니다.');

        axios
            .post(`${REST_API_URL}/userAuth/find-password`, {
            email: email,
            })
            .then((res) => {
            Swal.fire({
                icon: 'success',
                title: '완료',
                text: '패스워드가 변경되었습니다. 로그인을 완료해주세요.',
            }).then(() => {
                router.push({ name: 'login' }); // 성공 시 로그인 페이지로 이동
            });
            })
            .catch((err) => {
            Swal.fire({
                icon: 'error',
                title: '오류',
                text: '이메일을 확인해주세요.',
            });
        });
    }

    const regist = function (registInfo) {
        showLoading('회원가입 중...', '잠시만 기다려 주세요.');
        axios
          .post(`${REST_API_URL}/userAuth/regist`, registInfo)
          .then((res) => {
            // 성공 시 완료 메시지 표시
            Swal.fire({
              icon: 'success',
              title: '회원가입 성공!',
              text: '회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.',
            }).then(() => {
              router.push({ name: 'login' }); // 성공 시 로그인 페이지로 이동
            });
          })
          .catch((err) => {
            // 실패 시 오류 메시지 표시
            Swal.fire({
              icon: 'error',
              title: '회원가입 실패',
              text: '회원가입에 실패하였습니다. 다시 시도해 주세요.',
            });
          });
      };

    return { login, logout, findPassword, regist, userId,user}
})
