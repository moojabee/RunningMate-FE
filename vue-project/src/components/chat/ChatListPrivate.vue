<template>
    <div class="chat-room-container">
        <template v-for="room in store.chatRoomList" :key="room.roomId">
            <div class="chat-room-card" @click="enterChatRoom(room.roomId, room.roomName)">
                <!-- 채팅방 사진과 텍스트 -->
                <div class="chat-room-info">
                    <!-- 동그란 채팅방 사진 -->
                    <img
                        v-if="room.userList[1].userImg"
                        :src="room.userList[1].userImg"
                        alt="프로필 이미지"
                        class="chat-room-image"
                        />
                    <img
                        v-else
                        src="@/assets/default-profile.png"
                        alt="기본 프로필 이미지"
                        class="chat-room-image"
                        />
                    <!-- 방 이름과 최근 메시지 -->
                    <div class="chat-room-text">
                        <!-- 채팅방 이름 -->
                        <span class="chat-room-name">
                            {{ getRoomName(room) }}
                        </span>

                        <!-- 최근 메시지 -->
                        <span class="last-chat-content">
                            {{ room.lastChat ? room.lastChat.content : '' }}
                        </span>
                    </div>
                </div>

                <!-- 나가기 버튼과 시간 -->
                <div class="chat-room-actions">
                    <span class="last-chat-time">
                        {{ room.lastChat ? formatTime(room.lastChat.sendedDate) : '' }}
                    </span>
                    <button class="leave-button" @click.stop="leaveChatRoom(room)">나가기</button>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
    import router from '@/router';
    import { useChatRoomStore } from '@/stores/chatRoom';
    import { computed, onMounted } from 'vue';

    const store = useChatRoomStore();
    const userId = sessionStorage.getItem('userId')
    const fetchChatRoomList = function() {
        store.loadChatRoomList();
    };

    const enterChatRoom = function(roomId, roomName) {
        router.push({ name: 'entryRoom', params: { roomId: roomId, roomName: roomName } });
    };

    // 시간 포맷팅 메서드 추가
    const formatTime = (dateTime) => {
        if (!dateTime) return '';
        const now = new Date();
        const past = new Date(dateTime);

        const diffInSeconds = Math.floor((now - past) / 1000); // 현재 시간과 과거 시간의 차이 (초 단위)
        const diffInMinutes = Math.floor(diffInSeconds / 60); // 차이를 분 단위로 변환
        const diffInHours = Math.floor(diffInMinutes / 60); // 차이를 시간 단위로 변환
        const diffInDays = Math.floor(diffInHours / 24); // 차이를 일 단위로 변환

        if (diffInMinutes < 60) {
            return `${diffInMinutes}분 전`;
        } else if (diffInHours < 24) {
            return `${diffInHours}시간 전`;
        } else {
            return `${diffInDays}일 전`;
        }
    };

    import Swal from "sweetalert2"; // SweetAlert2 가져오기

    const leaveChatRoom = async function (room) {
    const result = await Swal.fire({
        title: `채팅방 : ${room.roomName}\n 나가시겠습니까?`,
        icon: "warning", // 경고 아이콘
        showCancelButton: true, // 취소 버튼 표시
        confirmButtonText: "나가기", // 확인 버튼 텍스트
        cancelButtonText: "취소", // 취소 버튼 텍스트
    });

        if (result.isConfirmed) {
            store.leaveChatRoom({roomId: room.roomId,});
            Swal.fire({
            title: "나갔습니다!",
            text: `채팅방 '${room.roomName}'에서 나왔습니다.`,
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
            });
        }
    };

    // computed로 채팅방 이름을 계산하는 변수
    const getRoomName = computed(() => {
    return (room) => {
        if (room.roomType == 'PERSONAL') {
        // 'PERSONAL'일 때, userList에서 나와 일치하지 않는 상대방의 userNick을 반환
        const otherUser = room.userList.find(user => user.userId != userId);
        room.roomName = otherUser ? `[개인] ${otherUser.nickname}` : '알 수 없음';
        return otherUser ? `[개인] ${otherUser.nickname}` : '알 수 없음'; // 상대방 userNick 또는 '알 수 없음'
        }
        return `[그룹] ${room.roomName}`; // 'PERSONAL'이 아닐 때는 기본 roomName
    };
    });

    onMounted(() => {
    fetchChatRoomList()
    console.log(store.chatRoomList.value)
    });
</script>
<style scoped>
.chat-room-container {
    padding: 20px;
    font-family: Arial, sans-serif;
}

h2 {
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 10px;
}

hr {
    margin: 10px 0 20px;
    border: 0;
    height: 1px;
    background: #ddd;
}

.chat-room-card {
    display: flex;
    justify-content: space-between; /* 사진과 나가기 버튼 간격 유지 */
    align-items: center;
    padding: 10px 15px;
    margin-bottom: 15px;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative; /* 시간 위치 조정을 위해 필요 */
    transition: transform 0.2s, box-shadow 0.2s;
}

.chat-room-card:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.chat-room-info {
    display: flex;
    align-items: center; /* 사진과 텍스트를 수평으로 정렬 */
}

.chat-room-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 15px; /* 이미지와 텍스트 간격 추가 */
    object-fit: cover; /* 이미지 비율 유지 */
    border: 1px solid #ddd;
}

.chat-room-text {
    display: flex;
    flex-direction: column; /* 제목과 내용을 세로로 정렬 */
    align-items: flex-start; /* 왼쪽 정렬 */
}

.chat-room-name {
    font-size: 1em; /* 채팅방 이름 크기 */
    font-weight: bold;
    color: #555;
    margin-bottom: 5px; /* 이름과 내용 간격 추가 */
    white-space: nowrap; /* 한 줄로 표시 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    text-overflow: ellipsis; /* 넘치는 내용에 '...' 표시 */
    max-width: 10em; /* 제목 길이를 제한하는 최대 너비 */
}

.last-chat-content {
    font-size: 0.8em; /* 최근 메시지는 작게 */
    color: #555;
    white-space: nowrap; /* 한 줄로 표시 */
    overflow: hidden; /* 넘치는 내용 숨김 */
    text-overflow: ellipsis; /* 넘치는 내용에 '...' 표시 */
    max-width: 18em; /* 내용 길이를 제한하는 최대 너비 */
}
.chat-room-actions {
    display: flex;
    align-items: center;
    position: absolute; /* 나가기 버튼과 시간을 하단 고정 */
    bottom: 10px;
    right: 15px;
}

.last-chat-time {
    font-size: 0.5em; /* 시간은 작게 */
    color: #555;
    margin-right: 10px; /* 시간과 버튼 간격 추가 */
    position: relative; /* 상대적 위치 조정 */
    top: 5px; /* 아래로 5px 이동 */
}

.leave-button {
    padding: 5px 10px;
    background-color: #ff9561;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

</style>
