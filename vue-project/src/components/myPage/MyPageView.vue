<template>
  <div class="my-page">
    <!-- 유저 정보 섹션 -->
    <div class="user-info">
        <img
            v-if="userInfo.userImg"
            :src="userInfo.userImg"
            alt="프로필 사진"
            class="profile-img"
        />
        <img
            v-else
            src="/src/assets/default-profile.png"
            alt="기본 프로필 사진"
            class="profile-img"
        />
        <div class="user-details">
            <h2>{{ userInfo.nickname }}</h2>
            <p>총 거리: {{ userInfo.userDist }}km</p>
            <p>평균 페이스: {{ userInfo.userPace }}</p>
        </div>
    </div>
    <div>
        <span>게시글 수: {{ userInfo.boardNum }} |</span>
        <span> 팔로워: {{ userInfo.followerNum }} |</span>
        <span> 팔로잉: {{ userInfo.followingNum }}</span>
    </div>
    <br>

    <!-- 탭 내비게이션 -->
    <nav class="tab-navigation">
      <RouterLink :to="{ name: 'myBoard', params: { id: $route.params.id } }"
        >게시글</RouterLink>
      <RouterLink :to="{ name: 'myRun', params: { id: $route.params.id } }"
        >러닝 기록</RouterLink>
    </nav>

    <!-- 탭 콘텐츠 -->
    <RouterView />
</div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useMyPageStore();
const userInfo = ref({});

onMounted(async () => {
  try {
    userInfo.value = await store.getUserInfo(route.params.id);
  } catch (error) {
    console.error("유저 정보 조회 실패:", error);
  }
});
</script>

<style scoped>
.my-page {
  padding: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
}

.user-details h2 {
  margin: 0;
  font-size: 24px;
}

.user-details p {
  margin: 5px 0;
  color: #555;
}

.tab-navigation {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tab-navigation a {
  text-decoration: none;
  color: #007bff;
}

.tab-navigation a.router-link-active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
