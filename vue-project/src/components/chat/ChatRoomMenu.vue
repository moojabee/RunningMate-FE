<template>
  <div v-if="isVisible" class="modal-container" @click.self="closeModal">
    <div class="modal-content">
      <button @click="closeModal" class="close-button">X</button>
      <h3>모달 내용</h3>
      <p>여기에 모달 내용을 작성하세요.</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isVisible = ref(true); // 모달의 가시성 상태

// 모달 열기
const showModal = () => {
  console.log(isVisible)
  console.log("hellos");
  isVisible.value = true;
};

// 모달 닫기
const closeModal = () => {
  isVisible.value = false;
};

defineExpose({
  showModal,
});
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100%;
  background-color: white; /* 배경을 흰색으로 설정 */
  transform: translateX(100%); /* 화면 밖에서 시작 */
  transition: transform 0.5s ease;
}

.modal-container.v-enter-active, .modal-container.v-leave-active {
  transform: translateX(0); /* 슬라이드로 표시 */
}

.modal-content {
  padding: 20px;
  color: black; /* 내용 텍스트 색을 검정으로 변경 */
}

.close-button {
  background: transparent;
  color: black; /* 버튼 색을 검정으로 변경 */
  border: none;
  font-size: 20px;
  cursor: pointer;
  float: right;
}

.close-button:hover {
  color: #ddd;
}
</style>
