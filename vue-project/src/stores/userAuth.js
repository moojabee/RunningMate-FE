import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

const REST_API_URL=import.meta.env.VITE_REST_API_URL

export const useUserAuthStore = defineStore('userAuth', () => {
    
    const user = ref(null);

    const login = function(email,password){
        const token = ref('');

        axios.post(`${REST_API_URL}/login`,{
            email:email,
            password:password
        })
        .then((res)=>{
            user.value = res.data
            alert(`${user.value}님 안녕하세요 !로그인 성공`)
            token.value = res.headers['authorization'];
            sessionStorage.setItem('session',token.value);
            router.push({name:'main'})
        })
        .catch((err)=>{
            alert("로그인 실패")
        })
    }

    const logout = function(){
        user.value = null
        sessionStorage.removeItem('session')
        router.push({name:'login'})
    }

    return { login, user, logout }
})
