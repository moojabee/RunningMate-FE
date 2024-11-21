<template>
  <div class="post-list" @click="closeAllMenus">
    <div v-for="board in store.neighborBoardList" :key="board.id" class="post-card">
      <!-- 유저 정보 -->
      <div class="post-header">
        <img
          v-if="board.userImg"
          :src="board.userImg"
          alt="프로필 이미지"
          class="profile-img"
        />
        <img
          v-else
          src="@/assets/default-profile.png"
          alt="기본 프로필 이미지"
          class="profile-img"
        />
        <div class="user-info">
          <h4>{{ board.nickname }}</h4>
          <p>{{ board.userDist }}km {{ board.userPace }}</p>
        </div>
        <!-- ... 버튼: 본인이 작성한 게시글만 보이도록 설정 -->
        <button class="more-button" @click.stop="handleActions(board)">...</button>
      </div>

      <!-- 수정/삭제 메뉴: 본인 게시글에서만 보이며 다른 구성 요소에 영향을 주지 않음 -->
      <div
        v-show="visibleActions[board.boardId]"
        class="action-menu"
        @click.stop
      >
        <button @click="goToUpdatePage(board)">게시글 수정</button>
        <button @click="confirmDelete(board.boardId)">게시글 삭제</button>
      </div>

      <!-- 러닝 이미지 -->
      <div class="post-image">
        <img
          v-for="img in board.boardImg"
          :key="img.imgId"
          :src="img.boardUrl"
          alt="게시글 이미지"
        />
      </div>

      <!-- 게시글 내용 -->
      <div class="post-body">
        <p>{{ board.content }}</p>
      </div>

      <!-- 하단 액션 -->
      <div class="post-footer">
        <div class="like-comment">
          <button @click="toggleLike(board)" class="like-button">
            <span v-if="board.likeCheck === 1">💖</span>
            <span v-else>🤍</span>
          </button>
          <span>{{ board.like.length }}</span>
          <span>💬 {{ board.comment.length }}</span>
        </div>
        <button @click="openCommentModal(board)" class="comment-link">
          댓글 {{ board.comment.length }}개 보기
        </button>
        <p class="timestamp">{{ formatTimestamp(board.postedDate) }}</p>
      </div>
    </div>
    <!-- 댓글 모달 -->
    <CommentView
      v-if="isCommentModalVisible"
      :isVisible="isCommentModalVisible"
      :boardId="selectedBoardId"
      @close="isCommentModalVisible = false"
      @updateModalVisibility="$emit('updateModalVisibility', $event)"
      @updateCommentCount="updateCommentCount"
    />
  </div>
</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useBoardStore } from '@/stores/board';
import { useRouter } from 'vue-router';
import CommentView from './CommentView.vue';

const store = useBoardStore();
const router = useRouter();
const isLoading = ref(false);

const isCommentModalVisible = ref(false);
const selectedBoardId = ref(0); // 선택된 게시글 ID 추가

// 댓글 모달 열기
const openCommentModal = (board) => {
  selectedBoardId.value = board.boardId; // 선택한 게시글 ID 설정
  isCommentModalVisible.value = true;
};

// 댓글 수 업데이트
const updateCommentCount = ({ boardId, change }) => {
  const board = store.neighborBoardList.find((b) => b.boardId === boardId);
  if (board) {
    board.commentCount += change;
  }
};

// 수정 페이지로 이동
const goToUpdatePage = (board) => {
  router.push({
    name: 'boardUpdate',
    params: { id: board.boardId },
    props: { boardData: board }
  });
};

// 삭제 확인 후 삭제 요청
const confirmDelete = (boardId) => {
  if (confirm("삭제하시겠습니까?")) {
    store.deleteBoard(boardId);
  }
};

// 게시글 액션 메뉴 가시성 관리
const visibleActions = reactive({});

const closeAllMenus = () => {
  Object.keys(visibleActions).forEach((key) => {
    visibleActions[key] = false;
  });
};

const handleActions = async (board) => {
  try {
    // 작성자인지 확인
    const isAuthor = await store.userCheck(board.userId);
    if (isAuthor) {
      // 작성자인 경우 메뉴 표시
      closeAllMenus(); // 다른 메뉴 닫기
      visibleActions[board.boardId] = true;
    } else {
    }
  } catch (error) {
    console.error("작성자 확인 중 오류 발생:", error);
  }
};

// 좋아요 토글 처리
const toggleLike = async (board) => {
  if (isLoading.value) return; // 중복 요청 방지
  isLoading.value = true;

  // 현재 상태를 저장 (낙관적 업데이트를 위한 백업)
  const originalLikeCheck = board.likeCheck;
  const originalLikeCount = board.like.length;

  try {
    // 좋아요 상태를 즉시 반영 (낙관적 업데이트)
    board.likeCheck = board.likeCheck === 1 ? 0 : 1;
    board.like.length += board.likeCheck === 1 ? 1 : -1;

    // 서버에 좋아요 상태 전송
    const newLikeCheck = await store.toggleLike(board.boardId, originalLikeCheck);

    // 서버 응답으로 상태를 최종 업데이트
    board.likeCheck = newLikeCheck;
    board.like.length = originalLikeCount + (newLikeCheck === 1 ? 1 : -1);
  } catch (error) {
    // 요청 실패 시 원래 상태로 복구
    board.likeCheck = originalLikeCheck;
    board.like.length = originalLikeCount;
  } finally {
    isLoading.value = false; // 로딩 상태 해제
  }
};

// 작성 시간 포맷 함수
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


// 페이지 마운트 시 게시글 목록 가져오기
onMounted(() => {
  store.getNeighborBoardList();
});
</script>

<style scoped>
/* 게시글 리스트 컨테이너 */
.post-list {
  padding: 10px;
  overflow-y: auto;
}

/* 게시글 카드 */
.post-card {
  background-color: white;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  position: relative; /* ... 버튼의 위치 조정을 위해 필요 */
}

/* 게시글 상단 정보 */
.post-header {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  position: relative; /* ... 버튼 위치 조정 */
}

.profile-img {
  width: 50px;
  height: 50px;
  border-radius: 20%;
  object-fit: cover;
  margin-right: 10px;
}

.user-info h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.user-info p {
  margin: 5px 0 0;
  font-size: 0.9rem;
  color: #888;
}

.more-button {
  position: absolute; /* 우측 상단 고정 */
  top: 0;
  right: 0;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

/* 수정/삭제 메뉴 */
.action-menu {
  position: absolute;
  top: 30px;
  right: 10px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 100;
  display: flex;
  flex-direction: column;
  padding: 5px;
}

.action-menu button {
  background: none;
  border: none;
  text-align: left;
  padding: 10px;
  font-size: 0.9rem;
  color: #333;
  cursor: pointer;
}

.action-menu button:hover {
  background-color: #f5f5f5;
}

/* 게시글 이미지 */
.post-image img {
  width: 100%;
  border-radius: 10px;
  margin-top: 10px;
}

/* 게시글 내용 */
.post-body p {
  margin: 10px 0;
  font-size: 1.0rem;
  color: #444;
}

/* 하단 액션 */
.post-footer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 10px;
}

.like-comment {
  display: flex;
  gap: 10px;
  font-size: 0.9rem;
  color: #666;
}

.like-comment span {
  display: flex;
  align-items: center;
}

.like-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
}

.like-button span {
  font-size: 1.2rem;
}

.comment-link {
  background: none;
  border: none;
  color: #aaa; /* 작성 시간과 같은 색상 */
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer; /* 버튼임을 명시 */
  margin-top: 5px;
  padding: 0;
}

.comment-link:hover {
  text-decoration: underline; /* 호버 시 강조 효과 */
}

.timestamp {
  font-size: 0.8rem;
  color: #aaa;
  margin-top: 5px;
}
</style>
