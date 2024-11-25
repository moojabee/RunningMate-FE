<template>
  <div class="board-create-container">
    <!-- 상단바 -->
    <div class="header">
      <button class="back-button" @click="cancelUpdate">←</button>
      <h4>게시글 수정</h4>
      <button class="submit-button" @click="updateBoard">수정 완료</button>
    </div>

    <!-- 게시글 작성 영역 -->
    <div class="content">
      <textarea
        v-model="localBoard.content"
        class="content-input"
        placeholder="내용을 입력하세요."
      ></textarea>

      <!-- 기존 이미지 -->
      <div class="image-container">
        <div
          v-for="(img, index) in localBoard.boardImg"
          :key="'existing-' + index"
          class="image-preview-wrapper"
        >
          <div class="image-preview">
            <img :src="img.boardUrl" alt="기존 이미지" />
            <button class="delete-button" @click="removeExistingImage(img.imgId)">X</button>
          </div>
        </div>

        <!-- 새로운 이미지 -->
        <div
          v-for="(file, index) in files"
          :key="'new-' + index"
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

        <!-- + 버튼: 항상 새 이미지 추가 가능 -->
        <div v-if="files.length === 0 || files[files.length - 1].file !== null" class="add-image">
          <input type="file" accept="image/*" @change="addNewFileInput" class="file-input" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useMyPageStore } from "@/stores/myPage";

const route = useRoute();
const router = useRouter();
const store = useMyPageStore();

const localBoard = ref({
  content: "",
  boardImg: [], // 기존 이미지 리스트
});
const files = ref([{ file: null, previewUrl: null }]); // 새 이미지 파일 리스트
const deleteImgIds = ref([]); // 삭제할 이미지 ID 리스트

// 게시글 ID를 라우터 파라미터로부터 가져오기
const boardId = route.params.boardId;

// 기존 게시글 데이터를 불러오기
onMounted(() => {
  const boardData =
    store.myBoardList.find((b) => b.boardId === Number(boardId)) || {};
  localBoard.value = { ...boardData };

  // 초기 파일 선택 버튼 유지
  if (files.value.length === 0) {
    files.value.push({ file: null, previewUrl: null });
  }
});

// 기존 이미지 삭제
const removeExistingImage = (imgId) => {
  deleteImgIds.value.push(imgId); // 삭제할 이미지 ID 추가
  localBoard.value.boardImg = localBoard.value.boardImg.filter(
    (img) => img.imgId !== imgId
  );
};

// 새 이미지 파일 선택
const handleFileChange = (event, index) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    files.value[index].file = file;
    files.value[index].previewUrl = URL.createObjectURL(file);

    // 마지막 인덱스에서 새 파일이 추가되면 새로운 선택창 추가
    if (index === files.value.length - 1) {
      files.value.push({ file: null, previewUrl: null });
    }
  } else {
    alert("이미지 파일만 선택 가능합니다.");
  }
};

// 파일 추가를 위한 새 입력 버튼
const addNewFileInput = (event) => {
  const file = event.target.files[0];

  if (file && file.type.startsWith("image/")) {
    files.value.push({
      file: file,
      previewUrl: URL.createObjectURL(file),
    });
  } else {
    alert("이미지 파일만 선택 가능합니다.");
  }
};

// 새 이미지 파일 삭제
const removeFile = (index) => {
  files.value.splice(index, 1);

  // 파일 삭제 후에도 선택 버튼을 유지하기 위해 빈 객체 추가
  if (files.value.length === 0 || files[files.length - 1].file !== null) {
    files.value.push({ file: null, previewUrl: null });
  }
};

// 게시글 수정 요청
const updateBoard = async () => {
  const selectedFiles = files.value
    .filter((fileData) => fileData.file !== null)
    .map((fileData) => fileData.file);

  try {
    await store.updateBoard(
      localBoard.value,
      selectedFiles,
      localBoard.value.boardId,
      deleteImgIds.value
    );
    alert("게시글이 성공적으로 수정되었습니다.");
    router.push({ name: "myPage", params: { userId: localBoard.value.userId } });
  } catch (error) {
    alert("게시글 수정 중 오류가 발생했습니다.");
  }
};

// 수정 취소
const cancelUpdate = () => {
  router.push({ name: "myPage", params: { userId: localBoard.value.userId } });
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
  width: 120px;
  height: 120px;
}

.image-preview img {
  width: 120px;
  height: 120px;
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
  width: 120px;
  height: 120px;
  border: 2px dashed #ddd;
  border-radius: 5px;
  font-size: 2.5rem;
  color: #ddd;
  position: relative; /* 텍스트 위치 조정을 위한 설정 */
}

.add-image::before {
  content: '+'; /* 텍스트를 직접 추가 */
  position: absolute;
  top: 15%; /* 텍스트를 위로 이동 */
  font-size: 3rem;
  color: #ddd;
}

.add-image:hover::before {
  color: #bbb;
}
.file-input {
  display: none; /* 실제 input은 숨김 */
}
</style>
