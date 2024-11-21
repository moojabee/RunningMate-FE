<template>
  <div>
    <h4>팔로우 게시글 목록</h4>
    <hr>
    <table>
      <thead>
        <tr>
          <th>userId</th>
          <th>프로필사진</th>
          <th>닉네임</th>
          <th>총 거리</th>
          <th>평균 페이스</th>
          <th>내용</th>
          <th>댓글 수</th>
          <th>좋아요 수</th>
          <th>좋아요</th>
          <th>댓글 확인</th>
          <th>등록일</th>
          <th>이미지</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="board in store.followBoardList" :key="board.id">
          <td>{{ board.userId }}</td>
          <td>
            <!-- 프로필 이미지 -->
            <img
              v-if="board.userImg"
              :src="board.userImg"
              alt="프로필 이미지"
              style="width: 50px; height: 50px; object-fit: cover; border-radius: 20%;"
            />
            <img
              v-else
              src="@/assets/default-profile.png"
              alt="기본 프로필 이미지"
              style="width: 50px; height: 50px; object-fit: cover; border-radius: 20%;"
            />
          </td>
          <td>
            <!-- 닉네임 클릭 시 myPage로 이동 -->
            <RouterLink :to="{ name: 'myPage', params: { userId: board.userId } }">
              {{ board.nickname }}
            </RouterLink>
          </td>
          <td>{{ board.userDist }}km</td>
          <td>{{ board.userPace }}</td>
          <td>{{ board.content }}</td>
          <td>
            🗨 {{ board.comment.length }}
          </td>
          <td>❤ {{ board.like.length }}</td>
          <td>
            <!-- 좋아요 버튼 -->
            <button :disabled="isLoading" @click="toggleLike(board)">
              <span v-if="board.likeCheck === 1">💖</span>
              <span v-else>🤍</span>
            </button>
          </td>
          <td>
            <button @click="openCommentModal(board)">댓글 {{ board.comment.length }}개 보기</button>
          </td>
          <td>{{ board.postedDate }}</td>
          <td>
            <div v-if="board.boardImg && board.boardImg.length > 0">
              <img
                v-for="img in board.boardImg"
                :key="img.imgId"
                :src="img.boardUrl"
                alt="게시글 이미지"
                style="width: 100px; height: auto; margin: 4px;"
              />
            </div>
            <span v-else>이미지 없음</span>
          </td>
          <td>
            <button @click="handleActions(board)">...</button>
            <div v-show="visibleActions[board.boardId]" style="margin-top: 5px;">
              <button @click="goToUpdatePage(board)">수정</button>
              <button @click="confirmDelete(board.boardId)">삭제</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 댓글 모달 -->
    <CommentView
      v-if="isCommentModalVisible"
      :isVisible="isCommentModalVisible"
      :boardId="selectedBoardId"
      @close="isCommentModalVisible = false"
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

// 댓글 수 업데이트 이벤트 처리
const updateCommentCount = ({ boardId, change }) => {
  const board = store.followBoardList.find((b) => b.boardId === boardId);
  if (board) {
    board.comment.length += change;
  }
};

// 수정 페이지로 이동
const goToUpdatePage = (board) => {
  router.push({
    name: 'boardUpdate',
    params: { id: board.boardId },
    props: { boardData: board },
  });
};

// 삭제 확인 후 삭제 요청
const confirmDelete = (boardId) => {
  if (confirm('삭제하시겠습니까?')) {
    store.deleteBoard(boardId);
  }
};

// 수정/삭제 버튼 가시성을 관리하는 상태
const visibleActions = reactive({});

// 액션 버튼 클릭 처리 (작성자 확인)
const handleActions = async (board) => {
  const check = await store.userCheck(board.userId);
  if (check) {
    // 작성자가 맞으면 가시성을 토글
    if (visibleActions[board.boardId]) {
      visibleActions[board.boardId] = false; // 숨기기
    } else {
      visibleActions[board.boardId] = true; // 보이기
    }
  } else {
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

// 페이지 마운트 시 게시글 목록 가져오기
onMounted(() => {
  store.getFollowBoardList();
});
</script>

<style scoped>
nav {
  margin-bottom: 1rem;
}
table {
  text-align: center;
}
button {
  margin-left: 5px;
}
</style>
