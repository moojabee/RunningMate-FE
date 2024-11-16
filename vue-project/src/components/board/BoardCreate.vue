<template>
    <div>
        <h4>게시글 작성</h4>
        <fieldset>
            <legend>등록</legend>
            <div>
                <label for="content">내용 : </label>
                <textarea id="content" cols="30" rows="10" v-model="board.content"></textarea>
            </div>
            <div>
                <label>이미지 : </label>
                <div v-for="(file, index) in files" :key="index" class="file-input">
                    <input type="file" accept="image/*" @change="handleFileChange($event, index)" />
                    <div v-if="file.previewUrl" class="preview">
                        <img :src="file.previewUrl" alt="미리보기" style="width: 100px; height: auto; margin-top: 10px;" />
                        <button @click="removeFile(index)">삭제</button> <!-- 이미지 삭제 버튼 추가 -->
                    </div>
                </div>
            </div>
            <div>
                <button @click="createBoard">등록</button>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useBoardStore } from '@/stores/board';

const store = useBoardStore();

const board = ref({
    content: '',
});

const files = ref([{ file: null, previewUrl: null }]);

const handleFileChange = (event, index) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
        files.value[index].file = file;
        files.value[index].previewUrl = URL.createObjectURL(file);

        if (index === files.value.length - 1) {
            files.value.push({ file: null, previewUrl: null });
        }
    } else {
        alert("이미지 파일만 선택 가능합니다.");
    }
};

// 파일 삭제 함수 추가
const removeFile = (index) => {
    files.value.splice(index, 1); // 선택된 파일 제거
};

const createBoard = () => {
    const selectedFiles = files.value.filter(fileData => fileData.file !== null).map(fileData => fileData.file);
    store.createBoard(board.value, selectedFiles);
};
</script>

<style scoped>
fieldset {
    margin-bottom: 1rem;
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
