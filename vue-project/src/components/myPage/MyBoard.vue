<template>
  <div>
    <h3>게시글 목록</h3>
    <table>
      <thead>
        <tr>
          <th>boardId</th>
          <th>닉네임</th>
          <th>프로필사진</th>
          <th>총 거리</th>
          <th>평균 페이스</th>
          <th>내용</th>
          <th>댓글 수</th>
          <th>좋아요 수</th>
          <th>좋아요</th>
          <th>댓글 확인</th>
          <th>등록일</th>
          <th>이미지</th>
          <th>수정/삭제</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="board in store.myBoardList" :key="board.boardId">
          <td>{{ board.boardId }}</td>
          <td>
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
          <td>{{ board.nickname }}</td>
          <td>{{ board.userDist }}km</td>
          <td>{{ board.userPace }}</td>
          <td>{{ board.content }}</td>
          <td>
            🗨 {{ board.comment.length }}
          </td>
          <td>❤ {{ board.like.length }}</td>
          <td>
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
                :src="img.fileName"
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
import { ref, reactive, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute, useRouter } from "vue-router";
import CommentView from "@/components/board/CommentView.vue";

const route = useRoute();
const router = useRouter();
const store = useMyPageStore();
const boards = ref([]);
const isLoading = ref(false);

const isCommentModalVisible = ref(false);
const selectedBoardId = ref(0);

// 댓글 모달 열기
const openCommentModal = (board) => {
  selectedBoardId.value = board.boardId;
  isCommentModalVisible.value = true;
};

// 댓글 수 업데이트
const updateCommentCount = ({ boardId, change }) => {
  const board = boards.value.find((b) => b.boardId === boardId);
  if (board) {
    board.comment.length += change;
  }
};

// 수정 페이지로 이동
const goToUpdatePage = (board) => {
  router.push({
    name: "myBoardUpdate",
    params: { boardId: board.boardId },
    props: { boardData: board },
  });
};

// 삭제 요청
const confirmDelete = (boardId) => {
  if (confirm("삭제하시겠습니까?")) {
    store.deleteBoard(boardId);
  }
};

// 좋아요 토글 처리
const toggleLike = async (board) => {
  if (isLoading.value) return;
  isLoading.value = true;

  const originalLikeCheck = board.likeCheck;
  const originalLikeCount = board.like.length;

  try {
    board.likeCheck = board.likeCheck === 1 ? 0 : 1;
    board.like.length += board.likeCheck === 1 ? 1 : -1;

    const newLikeCheck = await store.toggleLike(board.boardId, originalLikeCheck);
    board.likeCheck = newLikeCheck;
    board.like.length = originalLikeCount + (newLikeCheck === 1 ? 1 : -1);
  } catch (error) {
    board.likeCheck = originalLikeCheck;
    board.like.length = originalLikeCount;
  } finally {
    isLoading.value = false;
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

// 데이터 로드
onMounted(async () => {
  const userId = route.params.userId;
  store.getUserBoard(userId);
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  text-align: center;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}

button {
  margin-left: 5px;
}
</style>
