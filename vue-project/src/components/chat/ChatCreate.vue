<template>
    <div>
        <h2>ChatCreate</h2>
        <hr>
        
        <!-- 채팅방 이름 입력 -->
        <input 
            type="text" 
            placeholder="채팅방 이름" 
            v-model.trim="roomName" 
        />
        
        <!-- 채팅방 유형 선택 -->
        <div>
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
        
        <!-- 초대할 사람 이름 입력 -->
        <div>
            <input 
                type="text" 
                placeholder="초대할 사람 이름" 
                v-model.trim="inviteName" 
            />
            <button @click="addInvitee">초대</button>
        </div>
        
        <!-- 초대 명단 -->
        <h3>초대 명단</h3>
        <ul>
            <li v-for="(invitee, index) in invitees" :key="index">
                {{ invitee }}
                <button @click="removeInvitee(index)">X</button>
            </li>
        </ul>

        <!-- 선택한 유형과 초대 명단 확인 -->
        <p>채팅방 유형: {{ roomType }}</p>
        <p>초대한 사람들: {{ invitees.join(', ') }}</p>

        <button @click="createRoom">Create Room</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router'; // Vue Router 사용

// 상태 관리
const roomName = ref('');
const roomType = ref('PRIVATE'); // 기본값 PRIVATE
const inviteName = ref(''); // 초대할 사람 이름
const invitees = ref([]); // 초대 명단 배열

// Vue Router 사용 설정
const router = useRouter();

// 초대 명단에 추가
const addInvitee = () => {
    if (!inviteName.value.trim()) {
        alert('이름을 입력해주세요.');
        return;
    }
    if (invitees.value.includes(inviteName.value)) {
        alert('이미 초대된 사람입니다.');
        return;
    }
    invitees.value.push(inviteName.value.trim());
    inviteName.value = ''; // 입력 필드 초기화
};

// 초대 명단에서 삭제
const removeInvitee = (index) => {
    invitees.value.splice(index, 1);
};

// 방 생성 로직
const createRoom = () => {
    if (!roomName.value.trim()) {
        alert('채팅방 이름을 입력해주세요.');
        return;
    }
    alert(`채팅방 생성: 이름=${roomName.value}, 유형=${roomType.value}, 초대 명단=${invitees.value.join(', ')}`);
    
    // 생성 완료 후 채팅방 리스트로 이동
    router.push({name:'privateChatList'});
};
</script>

<style scoped>
ul {
    list-style: none;
    padding: 0;
}
li {
    margin-bottom: 5px;
    display: flex;
    align-items: center;
}
button {
    margin-left: 10px;
    cursor: pointer;
}
</style>
