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

    const createChatRoom = function(chatRoom){
        axios({
            url:`${REST_API_URL}/new-room`,
            method:'POST',
            data:chatRoom,
            headers:getAuthHeaders(),
        })
        .then((res)=>{
            if(res)console.log("생성 성공");
            router.push({name: 'privateChatList'})
        })
        .catch((err)=>{
            console.log("생성 실패",error)
        })
    }

    return {loadChatRoomList,loadOpenChatRoomList,createChatRoom,chatRoomList,openChatRoomList};
})