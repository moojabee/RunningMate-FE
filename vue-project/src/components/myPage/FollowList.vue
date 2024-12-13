<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="follow-list-modal">
      <div class="modal-header">
        <h3>{{ type === "follower" ? "팔로워" : "팔로잉" }}</h3>
        <button class="close-button" @click="$emit('close')">✕</button>
      </div>
      <div class="modal-content">
        <ul v-if="isMyPage">
          <li v-for="user in followList.filter(user => user.status === 0)" :key="user.userId">
            <img
              v-if="user.userImg"
              :src="user.userImg"
              alt="프로필 사진"
            />
            <img
              v-else
              src="@/assets/default-profile.png"
              alt="기본 프로필 사진"
            />
            <div class="user-info">
              <p>{{ user.nickname }}</p>
              <p>{{ user.userDist }}km {{ user.userPace }}</p>
            </div>
            <div>
              <button v-if="type === 'follower'" @click="updateFollowStatus(user)">확인 </button>
              <button @click="deleteFollow(user)"> 취소</button>
            </div>
          </li>
        </ul>
        <hr v-if="isMyPage && followList.some(user => user.status === 0)" class="divider" />
        <ul>
          <li v-for="user in followList.filter(user => user.status === 1)" :key="user.userId">
            <img
              v-if="user.userImg"
              :src="user.userImg"
              alt="프로필 사진"
            />
            <img
              v-else
              src="@/assets/default-profile.png"
              alt="기본 프로필 사진"
            />
            <div class="user-info">
              <p>{{ user.nickname }}</p>
              <p>{{ user.userDist }}km {{ user.userPace }}</p>
            </div>
            <div v-if="isMyPage">
              <button @click="deleteFollow(user)">삭제</button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useMyPageStore } from "@/stores/myPage";

const props = defineProps({
  type: { type: String, required: true }, // "follower" 또는 "following"
  followList: { type: Array, required: true }, // 팔로워/팔로잉 리스트
});

const route = useRoute();
const store = useMyPageStore();

// 본인의 마이페이지인지 확인
const isMyPage = computed(() => {
  const loggedInUserId = sessionStorage.getItem("userId");
  return route.params.userId === loggedInUserId;
});

// 팔로우 상태 업데이트
const updateFollowStatus = async (user) => {
  try {
    await store.updateFollowStatus(user.userId); // 상태 업데이트
    console.log("팔로우 상태 업데이트 성공:", user.nickname);
    await refreshLists();
  } catch (error) {
    console.error("팔로우 상태 업데이트 실패:", error);
  }
};

// 팔로우 삭제
const deleteFollow = async (user) => {
  try {
    if (props.type === "follower") {
      await store.deleteFollower(user.userId); // 팔로워 삭제
      console.log("팔로워 삭제 성공:", user.nickname);
    } else if (props.type === "following") {
      await store.deleteFollowing(user.userId); // 팔로잉 삭제
      console.log("팔로잉 삭제 성공:", user.nickname);
    }
    await refreshLists();
  } catch (error) {
    console.error("팔로우 삭제 실패:", error);
  }
};

// 팔로워/팔로잉 리스트 및 카운트 갱신
const refreshLists = async () => {
  await Promise.all([
    store.getFollower(route.params.userId),
    store.getFollowing(route.params.userId),
    store.getUserInfo(route.params.userId), // 팔로워/팔로잉 숫자 갱신
  ]);
};
</script>

<style scoped>
/* 모달 배경 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* 회색 반투명 배경 */
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 모달 창 */
.follow-list-modal {
  background: white;
  border-radius: 10px;
  height: 60%;
  width: 90%; /* 고정된 너비 */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  max-height: 80vh; /* 고정된 최대 높이 */
  display: flex;
  flex-direction: column; /* 상단 고정을 위해 column 정렬 */
}

/* 모달 헤더 */
.modal-header {
  position: sticky; /* 상단 고정 */
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  top: 0;
  background: white;
  /* z-index: 10; */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 2px solid #bebebe;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: bold;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

/* 모달 내용 */
.modal-content {
  flex-grow: 1; /* 내용이 스크롤 가능하도록 설정 */
  overflow-y: auto;
  padding: 15px 20px;
}

/* 리스트 스타일 */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

li img {
  width: 50px;
  height: 50px;
  border-radius: 20%;
  margin-right: 15px;
}

.user-info {
  flex-grow: 1;
}

button {
  background-color: #ccc;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.divider {
  border: none;
  border-top: 2px solid #ddd;
  margin: 10px 0;
}
</style>
