import { ref } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

axios.defaults.withCredentials = true;

const REST_API_URL = `http://localhost:8080/comment`;

export const useCommentStore = defineStore('comment', () => {
  const commentList = ref([]); // 댓글 리스트
  const token = ref(sessionStorage.getItem('session')); // 인증 토큰

  // 인증 헤더 생성
  const getAuthHeaders = () => ({
    Authorization: token.value,
  });

  // 댓글 리스트 조회
  const getCommentsByBoardId = async (boardId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/${boardId}`, {
        headers: getAuthHeaders(),
      });
      commentList.value = response.data; // 댓글 리스트 갱신
      console.log(`댓글 조회 완료: ${boardId}`, response.data);
    } catch (error) {
      console.error(`댓글 조회 실패: ${boardId}`, error);
    }
  };

  // 댓글 작성
  const createComment = async (boardId, content) => {
    try {
      const response = await axios.post(
        `${REST_API_URL}/create`,
        { boardId, content },
        {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("댓글 작성 완료:", response.data);
      await getCommentsByBoardId(boardId); // 작성된 댓글 갱신
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      throw error;
    }
  };

  // 댓글 삭제
  const deleteComment = async (commentId, boardId) => {
    try {
      await axios.delete(`${REST_API_URL}/delete/${commentId}`, {
        headers: getAuthHeaders(),
      });
      console.log(`댓글 삭제 완료: ${commentId}`);
      await getCommentsByBoardId(boardId); // 댓글 리스트 갱신
    } catch (error) {
      console.error(`댓글 삭제 실패: ${commentId}`, error);
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

  return { commentList, getCommentsByBoardId, createComment, deleteComment, userCheck };
});
