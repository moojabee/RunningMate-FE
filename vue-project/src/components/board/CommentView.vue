<template>
    <div v-if="isVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-content">
          <div class="modal-header">
            <h3>댓글 목록</h3>
            <button class="close-button" @click="closeModal">X</button>
          </div>
          <div class="modal-body">
            <table>
              <thead>
                <tr>
                  <th>프로필</th>
                  <th>작성자</th>
                  <th>총 거리</th>
                  <th>평균 페이스</th>
                  <th>내용</th>
                  <th>작성일</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comment in commentList" :key="comment.commentId">
                  <td>
                  <img
                    v-if="comment.userImg"
                    :src="comment.userImg"
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
                  <td>{{ comment.nickname }}</td>
                  <td>{{ comment.userDist }} km</td>
                  <td>{{ comment.userPace }}</td>
                  <td>{{ comment.content }}</td>
                  <td>{{ comment.postedDate }}</td>
                  <td>
                    <button @click="handleActions(comment)">...</button>
                    <div v-show="visibleActions[comment.commentId]" style="margin-top: 5px;">
                      <button @click="confirmDeleteComment(comment.commentId)">삭제</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <span>
                <input
                type="text"
                v-model="newComment"
                placeholder="댓글을 입력하세요."
                style="width: 80%; margin-right: 10px;"
                />
                <button @click="submitComment">작성</button>
              </span>
            </div>
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

const emit = defineEmits(['close', 'updateCommentCount']);

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
  if (check) {
    // 작성자가 맞으면 가시성을 토글
    if (visibleActions[comment.commentId]) {
      visibleActions[comment.commentId] = false; // 숨기기
    } else {
      visibleActions[comment.commentId] = true; // 보이기
    }
  } else {
  }
};

// 모달 닫기
const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
/* 회색 배경 전체 화면 */
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

/* 모달 본체 (화면 하단) */
.modal-container {
position: relative;
width: 100%;
max-width: 800px;
}

/* 모달 내용 */
.modal-content {
background: white;
border-radius: 10px 10px 0 0;
width: 100%;
max-height: 1000px;
overflow-y: auto;
padding: 20px;
padding-bottom: 100px;
box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}

/* 헤더 영역 */
.modal-header {
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
}

/* 모달 바디 (테이블) */
.modal-body {
max-height: 250px;
overflow-y: auto;
}

/* 닫기 버튼 */
.close-button {
background: transparent;
border: none;
font-size: 20px;
cursor: pointer;
}

/* 테이블 스타일 */
table {
width: 100%;
border-collapse: collapse;
}

th, td {
padding: 8px;
border: 1px solid #ddd;
text-align: center;
}

th {
background-color: #f4f4f4;
}
</style>
