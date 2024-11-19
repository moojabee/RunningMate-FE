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

  
  return { getUserInfo }
})
