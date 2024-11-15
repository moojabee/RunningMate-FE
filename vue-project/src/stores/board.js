import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

axios.defaults.withCredentials = true;

const REST_API_URL = `http://localhost:8080/board`

export const useBoardStore = defineStore('board', () => {
  // 게시글 목록 스토어에서 관리
  const followBoardList = ref([])
  const neighborBoardList = ref([])

  const token = ref(sessionStorage.getItem('session'));

  // 공통으로 헤더를 생성하는 함수 추가
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
  const createBoard = function(board, files, userId) {
    const formData = new FormData()
    formData.append("content", board.content)
    files.forEach(file => {
      formData.append("boardImg", file)
    })
  
    axios({
      url: `${REST_API_URL}/create/${userId}`,
      method: 'POST',
      data: formData,
      headers: {
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
    const userId = 1; // 임시 userId
    axios.delete(`${REST_API_URL}/delete/${userId}/${boardId}`)
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
  const updateBoard = function(board, files, userId, boardId) {
    const formData = new FormData();
    formData.append("content", board.content);
    files.forEach(file => {
        formData.append("boardImg", file);
    });

    axios({
        url: `${REST_API_URL}/update/${userId}/${boardId}`, // userId와 boardId를 포함
        method: 'PUT',
        data: formData,
        headers: {
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

  return { followBoardList, neighborBoardList, 
    getFollowBoardList, getNeighborBoardList, createBoard, deleteBoard, updateBoard }
})
