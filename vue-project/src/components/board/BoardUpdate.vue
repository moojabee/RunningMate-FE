<template>
    <div>
        <h4>게시글 수정</h4>
        <fieldset>
            <legend>수정</legend>
            <div>
                <label for="content">내용 : </label>
                <textarea id="content" cols="30" rows="10" v-model="localBoard.content"></textarea>
            </div>
            <div>
                <label>기존 이미지 :</label>
                <div v-for="(img, index) in localBoard.boardImg" :key="index" class="existing-img">
                    <img :src="img.boardUrl" alt="기존 이미지" style="width: 100px; height: auto; margin-top: 10px;" />
                    <button @click="removeExistingImage(img.imgId)">삭제</button>
                </div>
            </div>
            <div>
                <label>새로운 이미지 :</label>
                <div v-for="(file, index) in files" :key="index" class="file-input">
                    <input type="file" accept="image/*" @change="handleFileChange($event, index)" />
                    <div v-if="file.previewUrl" class="preview">
                        <img :src="file.previewUrl" alt="미리보기" style="width: 100px; height: auto; margin-top: 10px;" />
                        <button @click="removeFile(index)">삭제</button>
                    </div>
                </div>
                <!-- 기본적으로 하나의 파일 선택 버튼이 항상 존재하도록 보장 -->
                <div v-if="files.length === 0 || files[files.length - 1].file !== null" class="file-input">
                    <input type="file" accept="image/*" @change="addNewFileInput" />
                </div>
            </div>
            <div>
                <button @click="updateBoard">수정 완료</button>
                <button @click="cancelUpdate">취소</button>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useBoardStore } from '@/stores/board';
import { useRoute, useRouter } from 'vue-router';

const store = useBoardStore();
const route = useRoute();
const router = useRouter();

const localBoard = ref({
    content: '',
    boardImg: [] // 기존 이미지 리스트
});
const files = ref([]); // 새로 추가한 이미지 파일 리스트
const deleteImgIds = ref([]); // 삭제할 이미지 ID 리스트

// 게시글 ID를 라우터 파라미터로부터 가져오기
const boardId = route.params.id;

// 기존 게시글 데이터를 불러와 content와 이미지 설정
onMounted(() => {
    const boardData = store.followBoardList.find(b => b.boardId === Number(boardId)) || {};
    localBoard.value = { ...boardData };

    // 초기 파일 선택 버튼 유지
    if (files.value.length === 0) {
        files.value.push({ file: null, previewUrl: null });
    }
});

// 기존 이미지 삭제
const removeExistingImage = (imgId) => {
    deleteImgIds.value.push(imgId); // 삭제할 이미지 ID 추가
    localBoard.value.boardImg = localBoard.value.boardImg.filter(img => img.imgId !== imgId);
};

// 새 이미지 파일 선택
const handleFileChange = (event, index) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
        files.value[index] = {
            file: file,
            previewUrl: URL.createObjectURL(file)
        };

        // 마지막 인덱스에서 새 파일이 추가되면 새로운 선택창 추가
        if (index === files.value.length - 1) {
            files.value.push({ file: null, previewUrl: null });
        }
    } else {
        alert("이미지 파일만 선택 가능합니다.");
    }
};

// 새로운 파일 선택 버튼 클릭
const addNewFileInput = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
        files.value.push({
            file: file,
            previewUrl: URL.createObjectURL(file)
        });
    } else {
        alert("이미지 파일만 선택 가능합니다.");
    }
};

// 새 이미지 파일 삭제
const removeFile = (index) => {
    files.value.splice(index, 1);

    // 파일 삭제 후에도 선택 버튼을 유지하기 위해 빈 객체 추가
    if (files.value.length === 0 || files[files.value.length - 1].file !== null) {
        files.value.push({ file: null, previewUrl: null });
    }
};

// 게시글 수정 요청
const updateBoard = () => {
    const selectedFiles = files.value
        .filter(fileData => fileData.file !== null)
        .map(fileData => fileData.file);

    store.updateBoard(localBoard.value, selectedFiles, localBoard.value.boardId, deleteImgIds.value);
    router.push({ name: 'board' });
};

// 수정 취소
const cancelUpdate = () => {
    router.push({ name: 'board' });
};
</script>

<style scoped>
fieldset {
    margin-bottom: 1rem;
}

.existing-img {
    margin-top: 10px;
}

.file-input {
    margin-top: 10px;
}

.preview img {
    display: block;
    margin-top: 5px;
}

button {
    margin-top: 10px;
}
</style>
