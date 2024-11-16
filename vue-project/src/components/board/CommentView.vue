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
                  <th>작성자</th>
                  <th>총 거리</th>
                  <th>평균 페이스</th>
                  <th>내용</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="comment in comments" :key="comment.commentId">
                  <td>{{ comment.nickname }}</td>
                  <td>{{ comment.userDist }} km</td>
                  <td>{{ comment.userPace }}</td>
                  <td>{{ comment.content }}</td>
                  <td>{{ comment.postedDate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
</template>
  
<script setup>
const props = defineProps({
isVisible: { type: Boolean, required: true },
comments: { type: Array, required: true },
});

const emit = defineEmits(['close']);

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
max-height: 500px;
overflow-y: auto;
padding: 20px;
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
margin-bottom: 200px;
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
