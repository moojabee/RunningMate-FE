<template>
  <div class="board-container">
    <!-- 상단바 -->
    <div class="board-header">
      <nav>
        <RouterLink
          :to="{ name: 'neighborBoardList' }"
          :class="{ active: $route.name === 'neighborBoardList' }">
          동네 게시글
        </RouterLink>
        <RouterLink
          :to="{ name: 'followBoardList' }"
          :class="{ active: $route.name === 'followBoardList' }">
          팔로우 게시글
        </RouterLink>
      </nav>
    </div>

    <!-- 콘텐츠 영역 -->
    <div class="board-content">
      <RouterView
        @updateModalVisibility="updateModalVisibility"
      />
    </div>

    <!-- + 버튼 -->
    <button
      v-if="!isCommentModalVisible && ($route.name === 'neighborBoardList' || $route.name === 'followBoardList')"
      class="add-post-button"
      @click="goToCreatePage">
      +
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();

// 댓글 모달 상태
const isCommentModalVisible = ref(false);

/**
 * 게시글 생성 페이지로 이동
 */
const goToCreatePage = () => {
  router.push({ name: 'boardCreate' });
};

/**
 * 댓글 모달 상태 업데이트 (자식 컴포넌트에서 이벤트 수신)
 */
const updateModalVisibility = (isVisible) => {
  console.log('updateModalVisibility received in BoardView:', isVisible);
  isCommentModalVisible.value = isVisible;
};
</script>

<style scoped>
/* 전체 레이아웃 */
.board-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

/* 상단바 스타일 */
.board-header {
  height: 50px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #ddd;
  position: sticky;
  top: 0;
  z-index: 10;
  padding-left: 10px;
}

.board-header a {
  text-decoration: none;
  color: #888;
  font-weight: bold;
  font-size: 1rem;
  padding: 10px 15px;
}

.board-header a.active {
  color: #ff5722;
  border-bottom: 2px solid #ff5722;
}

/* 콘텐츠 영역 */
.board-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
}

/* + 버튼 스타일 */
.add-post-button {
  position: fixed;
  bottom: 90px;
  right: 10px;
  width: 60px;
  height: 60px;
  border-radius: 30%;
  background-color: #ff5722;
  color: white;
  font-size: 24px;
  font-weight: bold;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
}

/* + 버튼 호버 효과 */
.add-post-button:hover {
  background-color: #e64a19;
  transform: scale(1.1);
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
