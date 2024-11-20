<template>
  <div class="my-page">
    <div class="user-info">
      <img v-if="userInfo.userImg" :src="userInfo.userImg" alt="프로필 사진" class="profile-img" />
      <img v-else src="/src/assets/default-profile.png" alt="기본 프로필 사진" class="profile-img" />
      <div class="user-details">
        <h2>{{ userInfo.nickname }}</h2>
        <p>총 거리: {{ userInfo.userDist }}km</p>
        <p>평균 페이스: {{ userInfo.userPace }}</p>
      </div>
    </div>
    <div>
      <span>게시글 수: {{ userInfo.boardNum }} |</span>
      <span>팔로워: {{ userInfo.followerNum }} |</span>
      <span>팔로잉: {{ userInfo.followingNum }}</span>
    </div>
    <br />

    <template v-if="isMyPage || isAuthorized">
      <nav class="tab-navigation">
        <RouterLink :to="{ name: 'myBoard', params: { userId: $route.params.userId } }">게시글</RouterLink>
        <RouterLink :to="{ name: 'myRun', params: { userId: $route.params.userId } }">러닝 기록</RouterLink>
      </nav>

      <RouterView :key="$route.params.userId" />
    </template>

    <template v-else>
      <p>비공개 계정입니다.</p>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute } from "vue-router";

const route = useRoute();
const store = useMyPageStore();
const userInfo = ref({});
const isAuthorized = ref(false);

const isMyPage = computed(() => {
  const loggedInUserId = sessionStorage.getItem("userId");
  return route.params.userId === loggedInUserId;
});

// 데이터 로드 함수
const loadData = async (userId) => {
  try {
    userInfo.value = await store.getUserInfo(userId);
    if (isMyPage.value) {
      isAuthorized.value = true; // 본인의 페이지는 항상 접근 가능
    } else {
      const isPrivate = await store.checkPrivate(userId);
      if (!isPrivate) {
        const isFollower = await store.checkFollower(userId);
        isAuthorized.value = isFollower; // 팔로워 여부 확인
      } else {
        isAuthorized.value = true; // 공개 계정은 접근 허용
      }
    }
  } catch (error) {
    console.error("페이지 로드 중 오류:", error);
  }
};

// 초기 데이터 로드
onMounted(() => {
  loadData(route.params.userId);
});

// userId 변경 시 데이터 갱신 및 RouterView 재렌더링
watch(
  () => route.params.userId,
  (newUserId) => {
    loadData(newUserId);
  }
);
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
  border-radius: 20%;
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
