<template>
    <div>
        <h2>Login</h2>
        <input type="text" placeholder="ID 입력" v-model.trim="id">
        <input type="password" placeholder="PW입력" v-model.trim="password" />
        <button @click="login">로그인</button>
        <hr>
        <button><RouterLink :to= "{ name: 'findPassword'}">find</RouterLink></button>
        <button><RouterLink :to= "{ name: 'regist'}">regist</RouterLink></button>
    </div>
</template>

<script setup>
    import { useUserAuthStore } from '@/stores/userAuth';
    import { onMounted, ref } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();

    const userAuthStore = useUserAuthStore();
    const id = ref('')
    const password = ref('');

    const login = function(){
        userAuthStore.login(id.value,password.value);
    }
    
    onMounted(() => {
    if (sessionStorage.getItem('session')) {
        router.push('/main'); // main으로 리다이렉트
    }
});
</script>

<style scoped>

</style>