<template>
  <div class="update-page">
    <h3>프로필 수정</h3>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="formData.nickname" />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="formData.password" placeholder="새 비밀번호 입력" />
      </div>
      <div class="form-group">
        <label for="address">주소</label>
        <select id="address" v-model="formData.address">
          <option value="서울">서울</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="인천">인천</option>
          <option value="광주">광주</option>
        </select>
      </div>
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
        <input type="file" id="userImg" @change="handleFileChange" />
        <button type="button" @click="resetImage">이미지 삭제</button>
      </div>
      <button type="submit">저장</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute } from "vue-router";

const store = useMyPageStore();
const route = useRoute();

const formData = ref({
  nickname: "",
  password: "",
  address: "",
});

const previewImg = ref("");

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    previewImg.value = URL.createObjectURL(file);
    formData.value.userImg = file;
  }
};

const resetImage = () => {
  previewImg.value = "/src/assets/default-profile.png";
  formData.value.userImg = null;
};

const updateProfile = async () => {
  await store.updateUserInfo(formData.value, formData.value.userImg);
};

onMounted(() => {
  const { nickname, address, userImg } = store.userInfo;
  formData.value.nickname = nickname;
  formData.value.address = address;
  previewImg.value = userImg || "/src/assets/default-profile.png";
});
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
.preview {
  width: 100px;
  height: 100px;
  border-radius: 20%;
  object-fit: cover;
  margin-bottom: 10px;
}
button {
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
