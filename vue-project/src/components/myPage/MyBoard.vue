<template>
  <div>
    <h3>게시글 목록</h3>
    <table>
      <thead>
        <tr>
          <th>게시글 ID</th>
          <th>작성자</th>
          <th>내용</th>
          <th>좋아요</th>
          <th>댓글 수</th>
          <th>등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="board in boards" :key="board.boardId">
          <td>{{ board.boardId }}</td>
          <td>{{ board.nickname }}</td>
          <td>{{ board.content }}</td>
          <td>❤ {{ board.like.length }}</td>
          <td>🗨 {{ board.comment.length }}</td>
          <td>{{ board.postedDate }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useMyPageStore();
const boards = ref([]);

onMounted(async () => {
  const userId = route.params.id;
  boards.value = await store.getUserBoard(userId);
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}
</style>
