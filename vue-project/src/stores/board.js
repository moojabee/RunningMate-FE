import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

const REST_API_URL=import.meta.env.VITE_REST_API_URL + "/board"

export const useBoardStore = defineStore('board', () => {
  const followBoardList = ref([])
  const neighborBoardList = ref([])
  const isLoading = ref(false);

  const token = ref(sessionStorage.getItem('session'));

  const getAuthHeaders = () => ({
    Authorization: token.value
  });

  // 팔로우 게시글 목록 불러오기
  const getFollowBoardList = function() {
    console.log(token.value);
    axios
      .get(`${REST_API_URL}/follow`, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log("팔로우 게시글 조회:", response.data)
        followBoardList.value = response.data
      })
      .catch((error) => {
        console.error("팔로우 게시글 조회 실패:", error)
      })
  }

  // 동네 게시글 목록 불러오기
  const getNeighborBoardList = function() {
    axios
      .get(`${REST_API_URL}/neighbor`, {
        headers: getAuthHeaders(),
      })
      .then((response) => {
        console.log("동네 게시글 조회:", response.data)
        neighborBoardList.value = response.data
      })
      .catch((error) => {
        console.error("동네 게시글 조회 실패:", error)
      })
  }

  // 게시글 등록
  const createBoard = function(board, files) {
    const formData = new FormData()
    formData.append("content", board.content)
    files.forEach(file => {
      formData.append("boardImg", file)
    })
  
    axios({
      url: `${REST_API_URL}/create`,
      method: 'POST',
      data: formData,
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      }
    })
    .then(() => {
      console.log("게시글 등록 완료")
      router.replace({ name: 'board' })
    })
    .catch((error) => {
      console.error("게시글 등록 실패:", error)
    })
  }

  // 게시글 삭제 메서드
  const deleteBoard = (boardId) => {
    axios.delete(`${REST_API_URL}/delete/${boardId}`, {
        headers: getAuthHeaders(),
      })
      .then(() => {
        console.log("게시글 삭제 완료");
        // 목록에서 삭제된 게시글 제거
        followBoardList.value = followBoardList.value.filter(board => board.boardId !== boardId);
        neighborBoardList.value = neighborBoardList.value.filter(board => board.boardId !== boardId);
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
        url: `${REST_API_URL}/update/${boardId}`,
        method: 'PUT',
        data: formData,
        headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
        }
    })
    .then(() => {
        console.log("게시글 수정 완료");
        router.replace({ name: 'board' });
    })
    .catch((error) => {
        console.error("게시글 수정 실패:", error);
    });
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

  // 좋아요 변경
  const toggleLike = async (boardId, currentLikeCheck) => {
    try {
      const response = await axios.post(
        `${REST_API_URL}/like/${boardId}`,
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
  

  return { followBoardList, neighborBoardList, isLoading, 
    getFollowBoardList, getNeighborBoardList, createBoard, deleteBoard, updateBoard,
    userCheck, toggleLike }
})
