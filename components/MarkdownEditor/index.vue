<template>
    <div class="markdown">
        <div :id="vditorId"></div>
    </div>
</template>
<script>
import Vditor from "vditor";
import "vditor/dist/index.css";
export default {
    name: "MarkDown",
    props: {
        id: {
            type: String,
            default: function () {
                return "vue-vditor";
            },
        },
        value: {
            type: String,
            default: "",
        },
    },
    data() {
        return {
            vditorId: this.id,
            hasInit: false,
        };
    },
    watch: {
        value(val) {
            if (this.hasInit) {
                this.$nextTick(() => window.vditor.setValue(val || ""));
            }
        },
    },
    mounted() {
        window.vditor = new Vditor(this.vditorId, {
            height: window.innerHeight - 60,
            mode: "sv",
            toolbar: [
                "emoji",
                "headings",
                "bold",
                "italic",
                "strike",
                "|",
                "line",
                "quote",
                "list",
                "ordered-list",
                "check",
                "outdent",
                "indent",
                "code",
                "inline-code",
                "insert-after",
                // "insert-before ,undo",
                "redo",
                "upload",
                "link",
                "table",
                // "record",
                "edit-mode",
                "both",
                "preview",
                "fullscreen",
                "outline",
                "code-theme",
                "content-theme",
                "export",
                "br",
            ],
            //是否使用 localStorage 进行缓存
            cache: {
                enable: true,
                id: this.vditorId,
            },
            //是否启用计数器
            counter: {
                enable: true,
                type: "text",
            },
            //预览
            preview: {
                mode: "both",
                hljs: {
                    enable: true,
                    style: "dracula",
                    lineNumber: false,
                },
            },
            //文件上传
            upload: {
                url: "/api/upload",
                headers: {
                    authorization: `Bearer ${this.$store.state.token}`,
                },
                multiple: false,
                fieldName: "file",
                accept: ".jpg,.png,.jpeg,.psd",
                format: (files, responseText) => {
                    const { code, data, msg } = JSON.parse(responseText);
                    return JSON.stringify({
                        msg,
                        code,
                        data: {
                            errFiles: [],
                            succMap: {
                                "xxx.png": data.imgUrl,
                            },
                        },
                    });
                },
            },
            input: () => {
                this.hasInit = false;
                this.$emit("input", window.vditor.getValue());
            },
            after: () => {
                this.hasInit = true;
                window.vditor.setValue(this.value);
            },
        });
    },
};
</script>
<style lang="less" scoped>
.markdown {
    margin: 60px auto 0;
    width: 100%;
    height: 100%;
}
</style>