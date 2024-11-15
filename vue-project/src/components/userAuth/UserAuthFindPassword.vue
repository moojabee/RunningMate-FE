<template>
    <div>
        <h2>FindPassWord</h2>
        <h4>이메일 입력</h4>
        <input type="text" placeholder="EMAIL 입력" v-model.trim="email" @keyup-enter="find">
        <button @click="find">비밀번호 찾기</button> 
        <hr>
        <RouterLink :to= "{name:'login'}">Login</RouterLink> | 
        <RouterLink :to= "{name:'regist'}">regist</RouterLink>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useUserAuthStore } from '@/stores/userAuth';

    const email = ref('')
    const store = useUserAuthStore()
    const find = function(){
        store.findPassword(email.value)
    }
</script>

<style scoped>

</style>