<template>
  <div class="register-page">
    <!-- 이미지와 로고 컨테이너 -->
    <div class="image-logo-container">
      <!-- 로고 이미지 -->
      <img 
        src="@/assets/logo.png" 
        alt="Company Logo" 
        class="company-logo" 
      />
    </div>

    <!-- 회원가입 박스 -->
    <div class="register-container">
      <h2 class="title">회원가입</h2>
      <p class="subtitle">회원 정보를 입력해주세요.</p>

      <!-- 이메일 -->
      <div class="input-group">
        <input 
          type="text" 
          placeholder="이메일 입력" 
          v-model.trim="registInfo.email" 
          class="input-field"
        />
        <span class="validation-message" :style="{ color: vaildEmail === '가능' ? 'green' : 'red' }">
          {{ vaildEmail }}
        </span>
        <button class="validation-button" @click="isValidEmail">
          이메일 중복 체크
        </button>
      </div>

      <!-- 비밀번호 -->
      <div class="input-group">
        <input 
          type="password" 
          placeholder="비밀번호 입력" 
          v-model.trim="registInfo.password" 
          class="input-field"
        />
        <input 
          type="password" 
          placeholder="비밀번호 재입력" 
          v-model.trim="passwordCheck" 
          class="input-field"
        />
        <span class="validation-message" :style="{ color: isPasswordValid ? 'green' : 'red' }">
          {{ passwordValidationMessage }}
        </span>
      </div>

      <!-- 닉네임 -->
      <div class="input-group">
        <input 
          type="text" 
          placeholder="닉네임 입력" 
          v-model.trim="registInfo.nickname" 
          class="input-field"
        />
        <span class="validation-message" :style="{ color: vaildNickname === '가능' ? 'green' : 'red' }">
          {{ vaildNickname }}
        </span>
        <button class="validation-button" @click="isValidNickname">
          닉네임 중복 체크
        </button>
      </div>

      <!-- 지역 선택 -->
      <div class="input-group">
        <select v-model="registInfo.address" class="input-field">
          <option value="" disabled>지역을 선택하세요</option>
          <option v-for="loc in location" :key="loc">{{ loc }}</option>
        </select>
      </div>

      <!-- 회원가입 버튼 -->
      <button class="register-button" @click="regist">
        회원가입
      </button>

      <div class="link-group">
        <RouterLink :to="{ name: 'findPassword' }" class="link">비밀번호 찾기</RouterLink>
        <RouterLink :to="{ name: 'login' }" class="link">로그인</RouterLink>
      </div>
    </div>
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
        if (registInfo.value.password === '' || passwordCheck.value === '') 
            return ''; // 단순히 빈 문자열 반환
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
    '서울시 강남구', '서울시 강동구', '서울시 강서구', '서울시 강북구', '서울시 관악구', '서울시 구로구', '서울시 금천구', 
    '서울시 노원구', '서울시 도봉구', '서울시 동작구'
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
/* 전체 페이지 스타일 */
.register-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #FAB058; /* 배경색 */
}

/* 이미지와 로고 컨테이너 */
.image-logo-container {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 50px;
  margin-top: 20px
}

.company-logo {
  width: 240px;
  height: auto;
}

/* 회원가입 박스 스타일 */
.register-container {
  max-width: 400px;
  width: 70%;
  padding: 20px;
  border-radius: 12px;
  background-color: #f8f8f8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 100px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.input-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.input-field:focus {
  border-color: #F7555C;
  outline: none;
}

.validation-message {
  font-size: 12px;
  text-align: left;
}

.validation-button {
  padding: 8px;
  font-size: 14px;
  color: #fff;
  background-color: #F7555C;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.validation-button:hover {
  background-color: #8300b3;
}

.register-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background-color: #F7555C;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.register-button:hover {
  background-color: #8300b3;
}

.link-group {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.link {
  font-size: 14px;
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s;
}

.link:hover {
  color: #8300b3;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .image-logo-container {
    flex-direction: column;
    gap: 10px;
  }

  .running-image {
    width: 140px;
  }

  .company-logo {
    width: 180px;
  }

  .register-container {
    padding: 15px;
    max-width: 90%;
  }

  .title {
    font-size: 20px;
    margin-bottom: 1em;
  }

  .subtitle {
    font-size: 12px;
  }

  .input-field {
    font-size: 12px;
  }

  .register-button {
    font-size: 14px;
    padding: 10px;
  }

  .link {
    font-size: 12px;
  }
}
</style>
