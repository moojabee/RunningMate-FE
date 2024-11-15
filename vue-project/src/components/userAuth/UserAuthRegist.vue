<template>
    <div>
        <h2>Regist</h2>
        <h4>회원가입</h4>

        <!--email-->
        <input type="text" placeholder="EMAIL 입력" v-model.trim="registInfo.email">
        <span :style="{color: vaildEmail==='가능'? 'green':'red' }">{{vaildEmail}}</span>
        <button @click="isValidEmail">이메일 중복 체크</button><br>
        
        <!--password-->
        <input type="password" placeholder="PASSWORD 입력" v-model.trim="registInfo.password"><br>
        <input type="password" placeholder="PASSWORD 재입력" v-model.trim="passwordCheck">
        <span :style="{ color: isPasswordValid ? 'green' : 'red' }">
            {{ passwordValidationMessage }}
        </span><br>
        
        <!--nickname-->
        <input type="text" placeholder="닉네임 입력" v-model.trim="registInfo.nickname">
        <span :style="{color: vaildNickname==='가능'? 'green' : 'red' }">{{vaildNickname}}</span>
        <button @click="isValidNickname">닉네임 중복 체크</button><br>
        <!--닉네임 중복 체크 넣어야함-->
        <select v-model="registInfo.address">
            <option value="" disabled>지역을 선택하세요</option>
            <option v-for="loc in location" :key="loc">{{ loc }}</option>
        </select>
        <button @click="regist">회원가입</button>
        <hr>
        <RouterLink :to= "{ name : 'findPassword'}">find</RouterLink> | 
        <RouterLink :to= "{ name : 'login'}">login</RouterLink>
    </div>
</template>

<script setup>
    import { useUserAuthStore } from '@/stores/userAuth';
    import axios from 'axios';
    import { ref,computed} from 'vue';
    const REST_API_URL=import.meta.env.VITE_REST_API_URL
    const store = useUserAuthStore();
    
    const registInfo = ref({
        email : '',
        password : '',
        nickname :'',
        address:''
    })

    // email
    const vaildEmail = ref('');
    const isValidEmail = function(){
        if(registInfo.value.email===''){
            vaildEmail.value='불가능'
            return;
        }
        axios.get(`${REST_API_URL}/userAuth/email-check`,{
            params : {
                email : registInfo.value.email
            }
        })
        .then((res)=>{
            if(res.data)vaildEmail.value ='가능';
            else vaildEmail.value='불가능';
        })
        .catch((err)=>{
            alert("이메일 인증 오류")
        })  
    }

    // password
    const passwordCheck = ref('');
    const isPasswordValid = computed(() => {
        return registInfo.value.password === passwordCheck.value && registInfo.value.password !== '';
    });
    const passwordValidationMessage = computed(() => {
        if(registInfo.value.password ==='' || registInfo.value.passwordCheck ==='') return isPasswordValid.value =""
        return isPasswordValid.value ? '일치' : '불일치';
    });

    // nickname
    const vaildNickname = ref('');
    const isValidNickname = function(){
        if(registInfo.value.nickname===''){
            vaildNickname.value='불가능'
            return;
        }
        axios.get(`${REST_API_URL}/userAuth/nickname-check`,{
            params : {
                nickname : registInfo.value.nickname
            }
        })
        .then((res)=>{
            if(res.data)vaildNickname.value ='가능';
            else vaildNickname.value='불가능';
        })
        .catch((err)=>{
            alert("닉네임 입력 오류")
        })
    }

    // address 
    const location = ref([
    '서울특별시 강남구', '강동구', '서울특별시 강서구', '서울특별시 강북구', '서울특별시 관악구', '서울특별시 구로구', '서울특별시 금천구', 
    '서울특별시 노원구', '서울특별시 도봉구', '서울특별시 동작구'
  ]);

    // regist
    const regist = function(){
        if(registInfo.value.email=== '' || 
        vaildEmail.value==='불가능' ||
        registInfo.value.nickname=== '' || 
        vaildNickname.value==='불가능' ||
        registInfo.value.password===''||
        isPasswordValid.value==='불일치') {
            alert("회원 가입 정보를 확인하세요")
            return;
        }
        
        store.regist(registInfo.value);
    }
</script>

<style scoped>

</style>