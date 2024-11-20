import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'

axios.defaults.withCredentials = true;

const REST_API_URL = `http://localhost:8080/myPage`

export const useMyPageStore = defineStore('myPage', () => {
  const token = ref(sessionStorage.getItem('session'));

  const getAuthHeaders = () => ({
    Authorization: token.value
  });

  // 유저 정보 조회
  const getUserInfo = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/userInfo/${userId}`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error("유저 정보 조회 실패:", error);
      throw error;
    }
  };

  // 유저 게시글 조회
  const getUserBoard = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/userBoard/${userId}`, {
        headers: getAuthHeaders(),
      });
      console.log("유저 게시글 조회:", response.data)
      return response.data.boardList; // boardList를 반환
    } catch (error) {
      console.error("게시글 조회 실패:", error);
      throw error;
    }
  };

  // 유저 러닝 기록 조회
  const getUserRun = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/userRun/${userId}`, {
        headers: getAuthHeaders(),
      });
      console.log("러닝 기록 조회:", response.data)
      return response.data; // recordList를 반환
    } catch (error) {
      console.error("러닝 기록 조회 실패:", error);
      throw error;
    }
  };


  return { getUserInfo, getUserBoard, getUserRun }
})
