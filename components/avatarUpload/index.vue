<template>
    <div class="upload-container">
        <div v-if="imageUrl.length > 0" class="image-preview">
            <img :src="imageUrl" />
            <div class="image-preview-action">
                <i class="el-icon-delete" @click="rmImage" />
            </div>
        </div>
        <el-upload
            v-else
            :multiple="false"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="handleImageBrfore"
            :headers="headers"
            action="/api/upload"
        >
            <el-button size="small" :loading="loading" type="primary"
                >点击上传</el-button
            >
        </el-upload>
    </div>
</template>

<script>
import { getToken } from 'utils/auth'
export default {
    name: "SingleImageUpload",
    props: {
        value: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            tempUrl: "",
            loading: false,
        };
    },
    computed: {
        imageUrl() {
            return this.value;
        },
        headers() {
            return {
                authorization: `Bearer ${getToken()}`, // 直接从本地获取token就行
            };
        },
    },
    methods: {
        rmImage() {
            this.emitInput("");
        },
        emitInput(val) {
            this.$emit("input", val);
        },
        handleImageSuccess(file) {
            this.loading = false;
            this.emitInput(file.data.imgUrl);
        },
        handleImageBrfore() {
            this.loading = true;
        },
    },
};
</script>

<style lang="less" scoped>
.upload-container {
    width: 100%;
    display: flex;
    .image-preview {
        width: 100px;
        height: 100px;
        position: relative;
        border: 1px dashed #d9d9d9;
        img {
            width: 100%;
            height: 100%;
        }
        .image-preview-action {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, 0.5);
            transition: opacity 0.3s;
            cursor: pointer;
            text-align: center;
            line-height: 100px;
            .el-icon-delete {
                font-size: 30px;
            }
        }
        &:hover {
            .image-preview-action {
                opacity: 1;
            }
        }
    }
}
</style>
