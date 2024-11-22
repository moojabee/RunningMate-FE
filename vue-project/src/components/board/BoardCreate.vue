<template>
  <div class="board-create-container">
    <!-- 상단바 -->
    <div class="header">
      <button class="back-button" @click="goBack">←</button>
      <h4>게시글 작성</h4>
      <button class="submit-button" @click="createBoard">작성</button>
    </div>

    <!-- 게시글 작성 영역 -->
    <div class="content">
      <textarea
        v-model="board.content"
        class="content-input"
        placeholder="내용을 입력하세요."
      ></textarea>

      <!-- 이미지 업로드 -->
      <div class="image-container">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="image-preview-wrapper"
        >
          <div v-if="file.previewUrl" class="image-preview">
            <img :src="file.previewUrl" alt="미리보기" />
            <button class="delete-button" @click="removeFile(index)">X</button>
          </div>
          <label v-else class="add-image">
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange($event, index)"
              class="file-input"
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBoardStore } from '@/stores/board';

const router = useRouter();
const store = useBoardStore();

const board = ref({
  content: '',
});

const files = ref([{ file: null, previewUrl: null }]);

// 파일 변경 처리
const handleFileChange = (event, index) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith('image/')) {
    files.value[index].file = file;
    files.value[index].previewUrl = URL.createObjectURL(file);

    if (index === files.value.length - 1) {
      files.value.push({ file: null, previewUrl: null }); // +버튼 추가
    }
  } else {
    alert('이미지 파일만 선택 가능합니다.');
  }
};

// 파일 삭제
const removeFile = (index) => {
  files.value.splice(index, 1);
};

// 게시글 생성
const createBoard = async () => {
  const selectedFiles = files.value
    .filter((fileData) => fileData.file !== null)
    .map((fileData) => fileData.file);

  try {
    await store.createBoard(board.value, selectedFiles);
    alert('게시글이 성공적으로 등록되었습니다.');
    router.push({ name: 'neighborBoardList' }); // 작성 후 목록으로 이동
  } catch (error) {
    alert('게시글 등록 중 오류가 발생했습니다.');
  }
};

// 뒤로가기
const goBack = () => {
  router.back();
};
</script>

<style scoped>
/* 전체 컨테이너 */
.board-create-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 10px;
}

/* 상단바 */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px; /* 높이를 줄여 상단으로 밀착 */
  border-bottom: 1px solid #ddd;
  padding: 0 10px;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1000;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #ff5722;
}

.submit-button {
  background-color: #ff5722;
  color: white;
  font-size: 1rem;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #e64a19;
}

/* 게시글 내용 입력 */
.content-input {
  width: 100%;
  height: 100px;
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 10px;
  font-size: 1rem;
  resize: none;
}

/* 이미지 컨테이너 */
.image-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 20px;
  gap: 10px;
}

/* 이미지 미리보기 */
.image-preview-wrapper {
  position: relative;
  width: 100px;
  height: 100px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #ddd;
}

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(255, 87, 34, 0.8);
  border: none;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 0.8rem;
  cursor: pointer;
}

.delete-button:hover {
  background-color: rgba(230, 74, 25, 0.8);
}

/* + 버튼 */
.add-image {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border: 1px dashed #ddd;
  border-radius: 5px;
  font-size: 2.5rem;
  color: #ddd;
  position: relative; /* 텍스트 위치 조정을 위한 설정 */
}

.add-image::before {
  content: '+'; /* 텍스트를 직접 추가 */
  position: absolute;
  top: 18%; /* 텍스트를 위로 이동 */
  font-size: 2.5rem;
  color: #ddd;
}

.add-image:hover::before {
  color: #bbb;
}
.file-input {
  display: none; /* 실제 input은 숨김 */
}
</style>
