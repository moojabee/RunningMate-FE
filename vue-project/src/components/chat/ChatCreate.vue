<template>
    <div class="chat-create-container">  
      <!-- 채팅방 이름 입력 -->
      <div class="input-group">
        <label for="roomName">채팅방 이름</label>
        <input
          id="roomName"
          type="text"
          placeholder="채팅방 이름을 입력하세요"
          v-model.trim="roomName"
        />
      </div>
  
      <!-- 채팅방 유형 선택 -->
      <div class="input-group">
        <label>채팅방 유형</label>
        <div class="radio-group">
          <label>
            <input
              type="radio"
              value="PRIVATE"
              v-model="roomType"
            />
            PRIVATE
          </label>
          <label>
            <input
              type="radio"
              value="OPEN"
              v-model="roomType"
            />
            OPEN
          </label>
        </div>
      </div>
  
      <!-- 초대할 사람 이름 입력 -->
      <div class="input-group">
        <label for="inviteName">초대할 사람</label>
        <div class="invite-input">
          <!-- 팔로워 목록에서 선택할 수 있는 드롭다운 -->
          <select v-model="inviteName" class="invite-dropdown">
            <option value="" disabled>팔로워를 선택하세요</option>
            <option v-for="follower in followerList" :key="follower.userId" :value="follower.nickname">
              {{ follower.nickname }}
            </option>
          </select>

          <!-- 직접 입력 -->
          <input
            id="inviteName"
            type="text"
            placeholder="직접 입력"
            v-model.trim="inviteName"
          />

          <button @click="addInvitee" class="add-button">+</button>
        </div>
      </div>
  
      <!-- 초대 명단 -->
      <div class="input-group">
        <label>초대 명단</label>
        <ul class="invitee-list">
          <li
            v-for="(invitee, index) in invitees"
            :key="index"
            class="invitee-item"
          >
            {{ invitee }}
            <button
              @click="removeInvitee(index)"
              class="remove-button"
            >
              X
            </button>
          </li>
        </ul>
      </div>
      <button @click="createRoom" class="create-button">채팅방 생성</button>
    </div>
  </template>
  
  <script setup>
  import { useChatRoomStore } from "@/stores/chatRoom";
  import { useMyPageStore } from "@/stores/myPage";
  import Swal from "sweetalert2";
  import { computed, onMounted, ref } from "vue";
  
  const store = useChatRoomStore();
  const myPageStore = useMyPageStore();
  const followerList = computed(()=> myPageStore.followerList)

  // 상태 관리
  const roomName = ref("");
  const roomType = ref("PRIVATE"); // 기본값 PRIVATE
  const inviteName = ref(""); // 초대할 사람 이름
  const invitees = ref([]); // 초대 명단 배열
  const userId =ref(sessionStorage.getItem('userId'));

  const chatRoomCreateDto = computed(() => ({
    roomName: roomName.value,
    roomType: roomType.value,
    userList: invitees.value,
  }));
  
  // 초대 명단에 추가
  const addInvitee = () => {
    if (!inviteName.value.trim()) {
      Swal.fire({
        icon: "warning", // 경고 아이콘
        title: "이름을 입력해주세요.",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }
    if (invitees.value.includes(inviteName.value)) {
      Swal.fire({
        icon: "info", // 정보 아이콘
        title: "이미 초대된 사람입니다.",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }

    invitees.value.push(inviteName.value.trim());

    Swal.fire({
      icon: "success", // 성공 아이콘
      title: "초대가 완료되었습니다!",
      text: `${inviteName.value} 님을 초대했습니다.`,
      showConfirmButton: true,
      confirmButtonText: "확인",
    });

    inviteName.value = ""; // 입력 필드 초기화
  };

  // 초대 명단에서 삭제
  const removeInvitee = (index) => {
    invitees.value.splice(index, 1);
  };
  
  // 방 생성 로직
  const createRoom = () => {
    if (!roomName.value.trim()) {
      Swal.fire({
        icon: "warning", // 경고 아이콘
        title: "채팅방 이름을 입력해주세요.",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      return;
    }

    Swal.fire({
      icon: "success", // 성공 아이콘
      title: "채팅방 생성 완료!",
      text: `${roomName.value} 채팅방이 생성되었습니다.`,
      showConfirmButton: true,
      confirmButtonText: "확인",
    }).then(() => {
      store.createChatRoom(chatRoomCreateDto.value);
    });
  };

  onMounted(()=>{
    myPageStore.getFollower(userId.value);
  })
  </script>
  
  <style scoped>
  .chat-create-container {
    max-width: 500px;
    margin: 20px auto;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
  }
  
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 10px;
  }
  
  hr {
    border: none;
    border-top: 2px solid #f0f0f0;
    margin: 20px 0;
  }
  
  .input-group {
    margin-bottom: 15px;
  }
  
  .input-group label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #555;
  }
  
  .input-group input[type="text"] {
    width: 100%;
    padding: 8px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .radio-group {
    display: flex;
    gap: 10px;
  }
  
  .radio-group label {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .invite-input {
    display: flex;
    gap: 10px;
  }
  
  .add-button {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 0.9rem;
  }
  
  .add-button:hover {
    background-color: #ff9845;
  }
  
  .invitee-list {
    list-style: none;
    padding: 0;
  }
  
  .invitee-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 5px;
  }
  
  .remove-button {
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 5px 10px;
    cursor: pointer;
    font-size: 0.8rem;
  }
  
  .remove-button:hover {
    background-color: #cc0000;
  }

  
  .create-button {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #ff911b;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .create-button:hover {
    background-color: #ff5722;
  }
  </style>
  