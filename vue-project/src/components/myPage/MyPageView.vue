<template>
  <div class="my-page">
    <!-- 사용자 정보 상단 -->
    <div class="user-info">
      <!-- 프로필 이미지 -->
      <div class="profile-section">
        <img
          v-if="store.userInfo.userImg"
          :src="store.userInfo.userImg"
          alt="프로필 사진"
          class="profile-img"
        />
        <img
          v-else
          src="/src/assets/default-profile.png"
          alt="기본 프로필 사진"
          class="profile-img"
        />
        <div class="profile-details">
          <h2>{{ store.userInfo.nickname }}</h2>
          <br>
          <p class="user-region">지역: {{ store.userInfo.address }}</p>
        </div>
        <div class="button-container">
          <!-- 본인 페이지 -->
          <button
            v-if="isMyPage"
            @click="goToUpdatePage"
            class="update-btn"
          >
            프로필 수정
          </button>
          <!-- 비공개 계정에 팔로우 버튼 -->
          <button
            v-else-if="!isMyPage && isPrivate && !isFollower"
            @click="followUser"
            class="follow-btn"
          >
            팔로우
          </button>
          <!-- 팔로워일 경우 메시지 버튼 -->
          <button
            v-else-if="!isMyPage && (isFollower || !isPrivate)"
            @click="sendMessage"
            class="message-btn"
          >
            메세지
          </button>
        </div>
      </div>

      <!-- 유저 기록 -->
      <div class="user-stats">
        <p>총 거리 : {{ store.userInfo.userDist }} km</p>
        <p>평균 페이스 : {{ store.userInfo.userPace }}</p>
      </div>
    </div>

    <hr class="divider" />

    <!-- 게시글 / 팔로워 / 팔로잉 -->
    <div class="user-overview">
      <div>
        <h4>게시글</h4>
        <h3>{{ store.userInfo.boardNum }}</h3>
      </div>
      <div @click="openFollowList('follower')">
        <h4>팔로워</h4>
        <h3>{{ store.userInfo.followerNum }}</h3>
      </div>
      <div @click="openFollowList('following')">
        <h4>팔로잉</h4>
        <h3>{{ store.userInfo.followingNum }}</h3>
      </div>
    </div>

    <hr class="divider" />

    <div v-if="isMyPage || (!isPrivate || isFollower)">
      <!-- 탭 네비게이션 -->
      <nav class="tab-navigation">
        <RouterLink
          class="tab-link"
          :to="{ name: 'myBoard', params: { userId: $route.params.userId } }"
          >
          게시글
        </RouterLink>
        <RouterLink
          class="tab-link"
          :to="{ name: 'myRun', params: { userId: $route.params.userId } }"
          >
          런닝 기록
        </RouterLink>
      </nav>
      <hr class="divider" />
      <div class="content-container">
        <RouterView :key="$route.params.userId" />
      </div>
    </div>
    <div v-else>
      <p class="private-account">비공개 계정입니다.</p>
    </div>

    <!-- FollowList 모달 -->
    <FollowList
      v-if="isFollowModalVisible"
      :type="followType"
      :followList="followType === 'follower' ? store.followerList : store.followingList"
      @close="closeFollowList"
    />
  </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useMyPageStore } from "@/stores/myPage";
import { useRoute, useRouter } from "vue-router";
import FollowList from "@/components/myPage/FollowList.vue";
import { useChatRoomStore } from "@/stores/chatRoom";

const router = useRouter();
const route = useRoute();
const store = useMyPageStore();

const isFollowModalVisible = ref(false); // 팔로워/팔로잉 모달 상태
const followType = ref(""); // "follower" 또는 "following" 결정
const chatStore = useChatRoomStore();

const isMyPage = computed(() => {
  const loggedInUserId = sessionStorage.getItem("userId");
  return route.params.userId === loggedInUserId;
});
const isPrivate = ref(false); // 비공개 계정 여부
const isFollower = ref(false); // 팔로워 여부

// 데이터 로드 함수
const loadData = async (userId) => {
  try {
    await store.getUserInfo(userId);
    if (!isMyPage.value) {
      isPrivate.value = await store.checkPrivate(userId);
      if (isPrivate.value) {
        isFollower.value = await store.checkFollower(userId);
      }
    }
    await store.getFollower(userId);
    await store.getFollowing(userId);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

// 프로필 수정 페이지 이동
const goToUpdatePage = () => {
  router.push({ name: "MyPageUpdate", params: { userId: store.userInfo.userId } });
};

// 팔로우 요청
const followUser = async () => {
  
};

// 메세지 전송 페이지 이동
const sendMessage = () => {
  chatStore.createChatRoom({
    roomName: `[개인]`,
    roomType: 'PERSONAL',
    userList: [store.userInfo.nickname],
  })
};

// 팔로워/팔로잉 모달 열기
const openFollowList = (type) => {
  followType.value = type;
  isFollowModalVisible.value = true;
};

// 팔로워/팔로잉 모달 닫기
const closeFollowList = () => {
  isFollowModalVisible.value = false;
};

// 데이터 초기 로드
onMounted(() => {
  loadData(route.params.userId);
});

// userId 변경 시 데이터 갱신
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
  background-color: #fff;
}

/* 상단 사용자 정보 */
.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-section {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.profile-img {
  width: 100px;
  height: 100px;
  border-radius: 15%;
  object-fit: cover;
  margin: 5px;
}

.profile-details {
  margin-left: 20px;
  flex-grow: 1;
}

.user-region {
  font-size: 16px;
  color: #666;
}

.update-btn {
  background-color: #507efd;
  color: white;
  padding: 8px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.follow-btn {
  background-color: #e2e2e2;
  color: rgb(71, 71, 71);
  padding: 8px 15px;
  border: 1px solid;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.message-btn {
  background-color: #ffd86e;
  color: rgb(73, 73, 73);
  padding: 8px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

/* 버튼 컨테이너 */
.button-container {
  position: absolute;
  right: 20px;
  top: 2.4rem;
}


.user-stats {
  display: flex;
  justify-content: center; /* 중앙 정렬 */
  align-items: center; /* 세로 정렬 */
  gap: 40px; /* 요소 간 간격 */
  margin: 10px; /* 상하 여백 */
}

.user-stats p {
  margin-top: 10px;
  text-align: center;
  font-size: 16px;
}

/* 하단 경계선 */
.divider {
  border: none;
  border-top: 2px solid #ddd;
  margin: 10px 0;
}

/* 게시글/팔로워/팔로잉 섹션 */
.user-overview {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
}

.user-overview div {
  text-align: center;
}

.user-overview p {
  margin: 5px 0;
  font-size: 16px;
  color: #333;
}

/* 탭 네비게이션 */
.tab-navigation {
  display: flex;
  justify-content: space-around;
  margin: 10px;
  padding: 10px 0;
}

.tab-link {
  text-decoration: none;
  color: #000000;
  font-size: 19px;
}

.tab-link.router-link-active {
  font-weight: bold;
  font-size: 20px;
}

.content-container {
  height: calc(100vh - 490px); /* 상단 정보를 제외한 높이 설정 */
  overflow-y: auto; /* 스크롤 가능 */
  position: relative;
}

.private-account {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
</style>
