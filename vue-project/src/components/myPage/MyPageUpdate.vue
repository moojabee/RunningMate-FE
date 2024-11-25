<template>
  <div class="update-page">
    <!-- 상단바 -->
    <div class="header">
      <button class="back-button" @click="goBack">←</button>
      <h3>프로필 수정</h3>
    </div>

    <!-- 수정 폼 -->
    <form @submit.prevent="updateProfile">
      <!-- 프로필 이미지 -->
      <div class="form-group">
        <label for="userImg">프로필 사진</label>
        <div class="image-preview">
          <img
            v-if="previewImg"
            :src="previewImg"
            alt="미리보기 이미지"
            class="preview"
          />
          <img
            v-else
            src="/src/assets/default-profile.png"
            alt="기본 이미지"
            class="preview"
          />
        </div>
        <div class="image-buttons">
          <label class="file-label">
            사진 수정
            <input
              type="file"
              accept="image/*"
              @change="handleFileChange"
              class="file-input"
            />
          </label>
          <button type="button" class="delete-button" @click="resetImage">사진 삭제</button>
        </div>
      </div>

      <!-- 닉네임 -->
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="formData.nickname" placeholder="닉네임 입력" />
      </div>

      <!-- 비밀번호 -->
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="formData.password" placeholder="새 비밀번호 입력" />
      </div>

      <!-- 주소 -->
      <div class="form-group">
        <label for="address">주소</label>
        <select id="address" v-model="formData.address">
          <option v-for="loc in location" :key="loc" :value="loc">{{ loc }}</option>
        </select>
      </div>

      <button type="submit" class="submit-button">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRouter } from "vue-router";

const store = useMyPageStore();
const router = useRouter();

const formData = ref({
  nickname: "",
  password: "",
  address: "",
  userImg: null, // 선택된 이미지 파일
});

const location = ref([
  "서울시 강남구", "서울시 강동구", "서울시 강북구", "서울시 강서구", "서울시 관악구", "서울시 광진구", "서울시 구로구",
  "서울시 금천구", "서울시 노원구", "서울시 도봉구", "서울시 동대문구", "서울시 동작구", "서울시 마포구", "서울시 서대문구",
  "서울시 서초구", "서울시 성동구", "서울시 성북구", "서울시 송파구", "서울시 양천구", "서울시 영등포구", "서울시 용산구",
  "서울시 은평구", "서울시 종로구", "서울시 중구", "서울시 중랑구",
]);

const previewImg = ref("");

// 뒤로가기
const goBack = () => {
  router.back();
};

// 파일 선택 이벤트
const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    previewImg.value = URL.createObjectURL(file);
    formData.value.userImg = file;
  } else {
    alert("이미지 파일만 선택 가능합니다.");
  }
};

// 이미지 삭제
const resetImage = () => {
  previewImg.value = "/src/assets/default-profile.png";
  formData.value.userImg = null;
};

// 프로필 업데이트
const updateProfile = async () => {
  try {
    await store.updateUserInfo(formData.value, formData.value.userImg);
    alert("프로필이 성공적으로 수정되었습니다.");
  } catch (error) {
    alert("프로필 수정 중 오류가 발생했습니다.");
  }
};

// 페이지 로드 시 초기값 설정
onMounted(() => {
  const { nickname, address, userImg } = store.userInfo;
  formData.value.nickname = nickname;
  formData.value.address = address;
  previewImg.value = userImg || "/src/assets/default-profile.png";
});
</script>

<style scoped>
.update-page {
  max-width: 100%;
  padding: 20px;
  background: #fff;
}

/* 상단바 */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.back-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #007bff;
  cursor: pointer;
}

.back-button:hover {
  color: #0056b3;
}

.form-group {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.image-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.preview {
  width: 150px;
  height: 150px;
  border-radius: 15%;
  object-fit: cover;
}

.image-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.file-label {
  display: inline-block;
  padding: 10px 12px;
  background: #3195ff;
  color: #fff;
  border-radius: 5px;
  cursor: pointer;
  margin: 0px;
}

.file-label:hover {
  background: #006ee4;
}

.file-input {
  display: none;
}

.delete-button {
  padding: 0 12px;
  background: #ff7070;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.delete-button:hover {
  background: #ff1818;
}

.submit-button {
  width: 15%;
  padding: 10px;
  background: #752bffcc;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.submit-button:hover {
  background: #0056b3;
}
</style>
