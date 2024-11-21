<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-content">
        <div class="modal-header">
          <h3>댓글</h3>
          <button class="close-button" @click="closeModal">X</button>
        </div>
        <div class="modal-body">
          <div
            v-for="comment in commentList"
            :key="comment.commentId"
            class="comment-item"
          >
            <img
              v-if="comment.userImg"
              :src="comment.userImg"
              alt="프로필 이미지"
              class="profile-img"
            />
            <img
              v-else
              src="@/assets/default-profile.png"
              alt="기본 프로필 이미지"
              class="profile-img"
            />
            <div class="comment-content">
              <div class="comment-header">
                <div>
                  <span class="nickname">{{ comment.nickname }}</span>
                  <span class="user-info">{{ comment.userDist }}km · {{ comment.userPace }}</span>
                </div>
                <span class="posted-time">{{ formatTimestamp(comment.postedDate) }}</span>
                <button class="more-button" @click="handleActions(comment)">...</button>
              </div>
              <p class="comment-text">{{ comment.content }}</p>
            </div>
            <div v-show="visibleActions[comment.commentId]" class="action-menu">
              <button @click="confirmDeleteComment(comment.commentId)">삭제</button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <input
            type="text"
            v-model="newComment"
            placeholder="댓글을 입력하세요."
            class="comment-input"
          />
          <button class="submit-button" @click="submitComment">작성</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { useCommentStore } from "@/stores/comment";
import { ref, reactive, computed, watch } from "vue";

const props = defineProps({
  isVisible: Boolean,
  boardId: Number,
});

const emit = defineEmits(['close', 'updateCommentCount', "updateModalVisibility"]);

const store = useCommentStore();
const newComment = ref('');
const commentList = computed(() => store.commentList);

// 댓글 가져오기 (props.boardId 변경 시 호출)
watch(
  () => props.boardId,
  async (boardId) => {
    if (props.isVisible && boardId) {
      try {
        await store.getCommentsByBoardId(boardId); // 댓글 리스트 가져오기
      } catch (error) {
        console.error('댓글을 불러오는 중 오류 발생:', error);
      }
    }
  },
  { immediate: true } // 컴포넌트가 로드되자마자 실행
);

const formatTimestamp = (postedDate) => {
  const now = new Date();
  const postedTime = new Date(postedDate);
  const diffInMs = now - postedTime;

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else {
    return `${diffInDays}일 전`;
  }
};

// 댓글 작성
const submitComment = async () => {
  if (!newComment.value.trim()) {
    alert('댓글 내용을 입력하세요.');
    return;
  }

  try {
    await store.createComment(props.boardId, newComment.value);
    newComment.value = ''; // 입력 필드 초기화
    emit('updateCommentCount', { boardId: props.boardId, change: 1 });
  } catch (error) {
    alert('댓글 작성에 실패했습니다.');
  }
};

// 댓글 삭제
const confirmDeleteComment = async (commentId) => {
  if (confirm('댓글을 삭제하시겠습니까?')) {
    try {
      await store.deleteComment(commentId, props.boardId); // boardId 전달
      emit('updateCommentCount', { boardId: props.boardId, change: -1 });
    } catch (error) {
      alert('댓글 삭제에 실패했습니다.');
    }
  }
};

// 수정/삭제 버튼 가시성을 관리하는 상태
const visibleActions = reactive({});

// 액션 버튼 클릭 처리 (작성자 확인)
const handleActions = async (comment) => {
  const check = await store.userCheck(comment.userId);
  visibleActions[comment.commentId] = check ? !visibleActions[comment.commentId] : false;
};

watch(
  () => props.isVisible,
  (newVal) => {
    emit("updateModalVisibility", newVal);
  },
  { immediate: true }
);

const closeModal = () => {
  emit("close");
  emit("updateModalVisibility", false);
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.modal-container {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: calc(90% - 80px); /* 화면 전체 높이에서 footer 높이 제외 */
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 10px 10px 0 0;
  width: 100%;
  height: 100%; /* 부모 컨테이너 높이만큼 사용 */
  overflow-y: auto;
  padding: 20px;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}


.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.modal-body {
  max-height: 75%;
  overflow-y: auto;
  margin-bottom: 5px;
}

.modal-footer {
  display: flex;
  align-items: center;
  border-top: 1px solid #ddd;
  padding-top: 10px;
  padding-bottom: 10px; /* 추가: 입력창이 Footer와 딱 붙지 않도록 여백 */
  background-color: #fff; /* 추가: 입력창의 배경색 설정 */
  bottom: 80px; /* FooterNavigation 위에 위치 */
  left: 0;
  width: 100%;
  z-index: 1100;
}

.close-button {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.comment-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 15px;
  position: relative;
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.comment-content {
  flex: 1;
  position: relative;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
}

.nickname {
  font-weight: bold;
  margin-right: 5px;
}

.user-info {
  font-size: 0.9rem;
  color: gray;
}

.posted-time {
  font-size: 0.8rem;
  color: gray;
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 0.1em;
}

.comment-text {
  font-size: 1rem;
  margin-top: 10px;
  margin-right: 20px;
  word-break: break-word; /* 긴 단어 줄바꿈 */
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px; /* 시간과 버튼 간의 간격 */
}


.more-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0;
  position: absolute;
  top: 20px;
  right: 0;
}

.action-menu {
  position: absolute;
  top: 40px;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
}

.action-menu button {
  padding: 10px;
  font-size: 0.9rem;
  background: none;
  border: none;
  cursor: pointer;
}

.action-menu button:hover {
  background-color: #f5f5f5;
}

.comment-input {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-right: 10px;
}

.submit-button {
  padding: 10px 20px;
  font-size: 1rem;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #e64a19;
}
</style>