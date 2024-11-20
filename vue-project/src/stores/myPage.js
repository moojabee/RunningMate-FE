import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

axios.defaults.withCredentials = true;

const REST_API_URL = `http://localhost:8080/myPage`

export const useMyPageStore = defineStore('myPage', () => {
  const myBoardList = ref([]);
  const isPrivate = ref(false);
  const isFollower = ref(false);

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
      myBoardList.value = response.data;
      return myBoardList; // boardList를 반환
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

  // 작성자인지 확인하는 메서드
  const userCheck = async (writerId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/userCheck`, {
        params: { writerId },
        headers: getAuthHeaders(),
      });
      return response.data; // true 또는 false 반환
    } catch (error) {
      console.error('작성자 확인 실패:', error);
      return false;
    }
  };

  // 게시글 삭제 메서드
  const deleteBoard = (boardId) => {
    axios.delete(`${REST_API_URL}/myBoard/delete/${boardId}`, {
        headers: getAuthHeaders(),
      })
      .then(() => {
        console.log("게시글 삭제 완료");
        // 목록에서 삭제된 게시글 제거
        myBoardList.value = myBoardList.value.filter(board => board.boardId !== boardId);
      })
      .catch((error) => {
        console.error("게시글 삭제 실패:", error);
      });
  };


  // 게시글 수정 메서드
  const updateBoard = function(board, files, boardId, deleteImgIds) {
    const formData = new FormData();
    formData.append("content", board.content);

    deleteImgIds.forEach(id => {
      formData.append("deleteImgIds", id);
    });

    files.forEach(file => {
        formData.append("boardImg", file);
    });

    console.log("FormData:", [...formData.entries()]);
    
    axios({
        url: `${REST_API_URL}/myBoard/update/${boardId}`,
        method: 'PUT',
        data: formData,
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(() => {
        console.log("게시글 수정 완료");
        router.replace({ name: 'myPage' });
    })
    .catch((error) => {
        console.error("게시글 수정 실패:", error);
    });
  };

  // 좋아요 변경
  const toggleLike = async (boardId, currentLikeCheck) => {
    try {
      const response = await axios.post(
        `${REST_API_URL}/myBoard/like/${boardId}`,
        { likeCheck: currentLikeCheck }, // 요청 본문
        {
          headers: getAuthHeaders(), // 헤더는 세 번째 인자로 전달
        }
      );
      return response.data; // 새로운 likeCheck 상태 (1 또는 0)
    } catch (error) {
      console.error(`좋아요 상태 변경 실패: ${boardId}`, error);
      throw error;
    }
  };

  // 계정 공개 여부 확인
  const checkPrivate = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/isPrivate/${userId}`, {
        headers: getAuthHeaders(),
      });
      isPrivate.value = response.data;
      return response.data;
    } catch (error) {
      console.error('계정 공개 여부 확인 실패:', error);
      throw error;
    }
  };

  // 팔로워 여부 확인
  const checkFollower = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/isFollower/${userId}`, {
        headers: getAuthHeaders(),
      });
      isFollower.value = response.data;
      return response.data;
    } catch (error) {
      console.error('팔로워 여부 확인 실패:', error);
      throw error;
    }
  };

  return { myBoardList, getUserInfo, getUserBoard, getUserRun, 
    deleteBoard, updateBoard, toggleLike, userCheck,
    isPrivate, isFollower, checkPrivate, checkFollower }
})
