<template>
  <div>
    <h4>팔로우 게시글 목록</h4>
    <hr>
    <table>
      <thead>
        <tr>
          <th>userId</th>
          <th>닉네임</th>
          <th>총 거리</th>
          <th>평균 페이스</th>
          <th>내용</th>
          <th>댓글 수</th>
          <th>좋아요 수</th>
          <th>댓글 확인</th>
          <th>등록일</th>
          <th>이미지</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="board in store.followBoardList" :key="board.id">
          <td>{{ board.userId }}</td>
          <td>{{ board.nickname }}</td>
          <td>{{ board.userDist }}km</td>
          <td>{{ board.userPace }}</td>
          <td>{{ board.content }}</td>
          <td>
            🗨 {{ board.comment.length }}
          </td>
          <td>❤ {{ board.like.length }}</td>
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
            <button @click="goToUpdatePage(board)">수정</button>
            <button @click="confirmDelete(board.boardId)">삭제</button>
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
import { ref, onMounted } from 'vue';
import { useBoardStore } from '@/stores/board';
import CommentView from './CommentView.vue';

const store = useBoardStore();

const isCommentModalVisible = ref(false);
const selectedBoardId = ref(0); // 선택된 게시글 ID 추가

// 댓글 모달 열기
const openCommentModal = (board) => {
  selectedBoardId.value = board.boardId; // 선택한 게시글 ID 설정
  isCommentModalVisible.value = true;
};

// 댓글 수 업데이트
const updateCommentCount = ({ boardId, commentCount }) => {
  const board = store.followBoardList.find((b) => b.boardId === boardId);
  if (board) {
    board.commentCount = commentCount; // 댓글 수 업데이트
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
