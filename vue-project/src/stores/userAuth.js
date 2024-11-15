import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'

const REST_API_URL=import.meta.env.VITE_REST_API_URL

export const useUserAuthStore = defineStore('userAuth', () => {
    
    const user = ref(null);   
    const login = function(email,password){
        const token = ref('');

        axios.post(`${REST_API_URL}/userAuth/login`,{
            email:email,
            password:password
        })
        .then((res)=>{
            user.value = res.data
            alert(`${user.value}님 안녕하세요! 로그인 성공`)
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

    const findPassword = function(email){
        axios.post(`${REST_API_URL}/userAuth/find-password`,{
            email:email
        })
        .then((res)=>{
            alert("패스워드가 변경되었습니다. 로그인을 완료해주세요")
            router.push({name:'login'})
        })
        .catch((err)=>{
            alert("이메일을 확인해주세요.")
        })
    }

    const regist = function(registInfo){
        axios.post(`${REST_API_URL}/userAuth/regist`,registInfo)
        .then((res)=>{
            alert("회원가입 완료")
            router.push({name:'login'})
        })
        .catch((err)=>{
            alert("회원가입 실패")
        })
    }

    return { login, logout, findPassword, regist, user}
})
