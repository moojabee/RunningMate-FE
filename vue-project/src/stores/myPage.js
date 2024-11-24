import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

axios.defaults.withCredentials = true;

const REST_API_URL=import.meta.env.VITE_REST_API_URL

export const useMyPageStore = defineStore('myPage', () => {
  const myBoardList = ref([]);
  const userInfo = ref([]);
  const isPrivate = ref(false);
  const isFollower = ref(false);
  const isFollowRequest = ref(false);
  const followerList = ref([]);
  const followingList = ref([]);

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
      userInfo.value = response.data;
      console.log("유저 정보 조회: ", userInfo)
      return userInfo;
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
      console.log("계정 공개 여부 : ", response.data)
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
      console.log("팔로워 여부 : ", response.data)
      isFollower.value = response.data;
      return response.data;
    } catch (error) {
      console.error('팔로워 여부 확인 실패:', error);
      throw error;
    }
  };

  // 팔로우 요청 여부 확인
  const checkFollowRequest = async (writerId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/isFollowRequest/${writerId}`, {
        headers: getAuthHeaders(),
      });
      console.log(`팔로우 요청 상태 확인: ${response.data}`);
      isFollowRequest.value = response.data;
      return response.data;
    } catch (error) {
      console.error('팔로우 요청 상태 확인 실패:', error);
      return false;
    }
  };

  // 유저 정보 수정 메서드
  const updateUserInfo = async (user, userImg) => {
    const formData = new FormData();

    if (user.password) formData.append("password", user.password);
    if (user.nickname) formData.append("nickname", user.nickname);
    if (user.address) formData.append("address", user.address);
    if (userImg)  formData.append("userImg", userImg);

    try {
      const response = await axios({
        url: `${REST_API_URL}/update`,
        method: "PUT",
        data: formData,
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("유저 정보 수정 완료:", response.data);

      router.replace({ name: "myPage", params: { userId: user.userId } });
    } catch (error) {
      console.error("유저 정보 수정 실패:", error);
      throw error;
    }
  };

  // 팔로워 리스트
  const getFollower = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/follower/${userId}`, {
        headers: getAuthHeaders(),
      });
      followerList.value = response.data;
      console.log("팔로워 리스트 조회 성공:", response.data);
    } catch (error) {
      console.error("팔로워 리스트 조회 실패:", error);
      throw error;
    }
  };

  // 팔로잉 리스트
  const getFollowing = async (userId) => {
    try {
      const response = await axios.get(`${REST_API_URL}/following/${userId}`, {
        headers: getAuthHeaders(),
      });
      followingList.value = response.data;
      console.log("팔로잉 리스트 조회 성공:", response.data);
    } catch (error) {
      console.error("팔로잉 리스트 조회 실패:", error);
      throw error;
    }
  };

  // 팔로우 추가
  const addFollow = async (userId) => {
    try {
      await axios.post(`${REST_API_URL}/follow/${userId}`, null, {
        headers: getAuthHeaders(),
      });
      console.log(`팔로우 추가 성공: ${userId}`);
    } catch (error) {
      console.error(`팔로우 추가 실패: ${userId}`, error);
      throw error;
    }
  };

  // 팔로워 삭제
  const deleteFollower = async (userId) => {
    try {
      await axios.delete(`${REST_API_URL}/follower/${userId}`, {
        headers: getAuthHeaders(),
      });
      console.log(`팔로워 삭제 성공: ${userId}`);
    } catch (error) {
      console.error(`팔로워 삭제 실패: ${userId}`, error);
      throw error;
    }
  };

  // 팔로잉 삭제
  const deleteFollowing = async (userId) => {
    try {
      await axios.delete(`${REST_API_URL}/following/${userId}`, {
        headers: getAuthHeaders(),
      });
      console.log(`팔로잉 삭제 성공: ${userId}`);
    } catch (error) {
      console.error(`팔로잉 삭제 실패: ${userId}`, error);
      throw error;
    }
  };

  // 팔로우 상태 수정 (status 0 → 1)
  const updateFollowStatus = async (userId) => {
    try {
      await axios.put(`${REST_API_URL}/follow/${userId}`, null, {
        headers: getAuthHeaders(),
      });
      console.log(`팔로우 상태 수정 성공: ${userId}`);
    } catch (error) {
      console.error(`팔로우 상태 수정 실패: ${userId}`, error);
      throw error;
    }
  };


  return { userInfo, myBoardList, getUserInfo, getUserBoard, getUserRun, 
    deleteBoard, updateBoard, toggleLike, userCheck,
    isPrivate, isFollower, isFollowRequest, checkPrivate, checkFollower, checkFollowRequest,
    updateUserInfo, followerList, followingList, getFollower, getFollowing,
    addFollow, deleteFollower, deleteFollowing, updateFollowStatus }
})
