import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

const REST_API_URL=import.meta.env.VITE_REST_API_URL+"/chat"

export const useChatRoomStore = defineStore('chatRoom', () => {

    const token = ref(sessionStorage.getItem('session'))
    const getAuthHeaders = () => ({
        Authorization : token.value
    })

    // 나의 채팅방 불러오기
    const chatRoomList = ref([])
    const loadChatRoomList = function(){
        axios.get(`${REST_API_URL}/room-list`,{
            headers:getAuthHeaders(),
        })
        .then((res)=>{
            chatRoomList.value = res.data
        })  
        .catch((error)=>{
            console.log("채팅방 목록 조회 실패",error)
        })
    }

    // 오픈 채팅방 불러오기
    const openChatRoomList = ref([])
    const loadOpenChatRoomList = function(){
        axios.get(`${REST_API_URL}/room-list/open`,{
            headers:getAuthHeaders(),
        })
        .then((res)=>{
            openChatRoomList.value = res.data
        })
        .catch((error)=>{
            console.log("오픈 채팅방 목록 조회 실패",error)
        })
    }

    // 채팅방 생성
    const createChatRoom = function(chatRoomCreatDto){
        console.log(chatRoomCreatDto)
        axios({
            url:`${REST_API_URL}/new-room`,
            method:'POST',
            data: chatRoomCreatDto ,
            headers:getAuthHeaders(),
        })
        .then((res)=>{
            if(res)console.log("생성 성공");
            router.push({name: 'privateChatList'})
        })
        .catch((err)=>{
            console.log(chatRoomCreatDto)
            console.log("생성 실패",err)
        })
    }

    // 채팅방 참가
    const joinChatRoom = function(party){
        console.log(party.roomId)
        axios({
            url:`${REST_API_URL}/join-room`,
            method:'POST',
            data:  party ,
            headers:getAuthHeaders(),
        })
        .then((res)=>{
            if(res)console.log("참가 성공");
            router.push({ name: 'entryRoom', params: { roomId: party.roomId, roomName:party.roomName} })
            .catch((err) => console.error("라우터 이동 중 에러:", err));
        })
        .catch((err)=>{
            console.log(party)
        })

    }
    return {loadChatRoomList,loadOpenChatRoomList,createChatRoom,chatRoomList,openChatRoomList,joinChatRoom};
})