<template>
    <div class="upload-container">
        <el-upload
            :multiple="false"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="handleImageBrfore"
            :headers="headers"
            drag
            action="/api/upload"
            :loading="loading"
        >
            <i class="el-icon-upload" />
            <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
            </div>
        </el-upload>
        <div v-show="imageUrl.length > 0" class="image-preview">
            <div class="image-preview-wrapper">
                <img :src="imageUrl" />
                <div class="image-preview-action">
                    <i class="el-icon-delete" @click="rmImage" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SingleImageUpload3",
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
                authorization: `Bearer ${this.$store.state.token}`, // 直接从本地获取token就行
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
        width: 300px;
        height: 180px;
        border: 1px dashed #d9d9d9;
        margin-left: 10px;
        .image-preview-wrapper {
            position: relative;
            width: 100%;
            height: 100%;
            img {
                width: 100%;
                height: 100%;
            }
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
            line-height: 200px;
            .el-icon-delete {
                font-size: 36px;
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
