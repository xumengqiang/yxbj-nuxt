<template>
    <div class="tinymce-container">
        <div class="tool" id="tool"></div>
        <div class="editor-box">
            <div :id="tinymceId" class="tinymce-box"></div>
        </div>
    </div>
</template>

<script>
/**
 * docs:
 * https://panjiachen.github.io/vue-element-admin-site/feature/component/rich-editor.html#tinymce
 */
import plugins from "./plugins";
import toolbar from "./toolbar";
import load from "./dynamicLoadScript";
import { upload } from "@/api/upload";
// why use this cdn, detail see https://github.com/PanJiaChen/tinymce-all-in-one
const tinymceCDN = "https://file.youxiubiji.com/CDN/js/tinymce/tinymce.min.js";
// "https://cdn.tiny.cloud/1/p14bmcetehd0ffi82fy5ytvunr5oc0ndyic4qnwul54k4i14/tinymce/5/tinymce.min.js";
//  'https://cdn.jsdelivr.net/npm/tinymce-all-in-one@4.9.3/tinymce.min.js'

export default {
    name: "Tinymce",
    props: {
        id: {
            type: String,
            default: function () {
                return "vue-tinymce-";
            },
        },
        value: {
            type: String,
            default: "",
        },
        toolbar: {
            type: Array,
            required: false,
            default() {
                return [];
            },
        },
        menubar: {
            type: String,
            default: "file edit insert view format table",
        },
        height: {
            type: [Number, String],
            required: false,
            default: 360,
        },
        width: {
            type: [Number, String],
            required: false,
            default: "auto",
        },
    },
    data() {
        return {
            hasChange: false,
            hasInit: false,
            tinymceId: this.id,
            fullscreen: false,
            languageTypeList: {
                en: "en",
                zh: "zh_CN",
                es: "es_MX",
                ja: "ja",
            },
        };
    },
    // computed: {
    //   containerWidth() {
    //     const width = this.width;
    //     if (/^[\d]+(\.[\d]+)?$/.test(width)) {
    //       // matches `100`, `'100'`
    //       return `${width}px`;
    //     }
    //     return width;
    //   },
    // },
    watch: {
        value(val) {
            if (!this.hasChange && this.hasInit) {
                this.$nextTick(() =>
                    window.tinymce.get(this.tinymceId).setContent(val || "")
                );
            }
        },
    },
    mounted() {
        this.init();
    },
    activated() {
        if (window.tinymce) {
            this.initTinymce();
        }
    },
    deactivated() {
        this.destroyTinymce();
    },
    destroyed() {
        this.destroyTinymce();
    },
    methods: {
        init() {
            // dynamic load tinymce from cdn
            load(tinymceCDN, (err) => {
                if (err) {
                    this.$message.error(err.message);
                    return;
                }
                this.initTinymce();
            });
        },
        initTinymce() {
            const _this = this;
            window.tinymce.init({
                selector: `#${this.tinymceId}`,
                custom_ui_selector: "body",
                language: this.languageTypeList["zh"],
                fixed_toolbar_container: "#tool",
                inline: true,
                auto_focus: true,
                toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar, //
                menubar: false,
                toolbar_mode: "wrap",
                toolbar_sticky: true,
                autosave_ask_before_unload: false,
                fontsize_formats:
                    "12px 14px 16px 18px 24px 36px 48px 56px 72px", //
                font_formats:
                    "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif",
                // statusbar: false,
                // menubar: this.menubar,
                plugins: plugins, //
                // end_container_on_empty_block: true,
                // powerpaste_word_import: "clean",
                // code_dialog_height: 450,
                // code_dialog_width: 1000,
                // advlist_bullet_styles: "square",
                // advlist_number_styles: "default",
                // imagetools_cors_hosts: ["www.tinymce.com", "codepen.io"],
                default_link_target: "_blank",
                // link_title: false,
                // nonbreaking_force_tab: true, // inserting nonbreaking space &nbsp; need Nonbreaking Space Plugin
                init_instance_callback: (editor) => {
                    if (_this.value) {
                        editor.setContent(_this.value);
                    }
                    _this.hasInit = true;
                    editor.on("NodeChange Change KeyUp SetContent", () => {
                        this.hasChange = true;
                        this.$emit("input", editor.getContent());
                    });
                },
                setup(editor) {
                    editor.on("FullscreenStateChanged", (e) => {
                        _this.fullscreen = e.state;
                    });
                },
                // it will try to keep these URLs intact
                // https://www.tiny.cloud/docs-3x/reference/configuration/Configuration3x@convert_urls/
                // https://stackoverflow.com/questions/5196205/disable-tinymce-absolute-to-relative-url-conversions
                convert_urls: false,
                images_upload_handler(blobInfo, success, failure, progress) {
                    progress(0);
                    const formData = new FormData();
                    formData.append(
                        "file",
                        blobInfo.blob(),
                        blobInfo.filename()
                    );
                    console.log(blobInfo.blob().size)
                    upload(formData)
                        .then((res) => {
                            if (res.code == 200) {
                                // 上传成功后，返回正确的图片地址
                                success(res.data.imgUrl);
                            }
                            progress(100);
                        })
                        .catch((err) => {
                            failure("出现未知问题，刷新页面，或者联系程序员");
                            console.log(err);
                        });
                },
            });
        },
        destroyTinymce() {
            const tinymce = window.tinymce.get(this.tinymceId);
            if (this.fullscreen) {
                tinymce.execCommand("mceFullScreen");
            }

            if (tinymce) {
                tinymce.destroy();
            }
        },
        setContent(value) {
            window.tinymce.get(this.tinymceId).setContent(value);
        },
        getContent() {
            window.tinymce.get(this.tinymceId).getContent();
        },
    },
};
</script>

<style lang="less" scoped>
.tinymce-container {
    height: 100%;
    width: 100%;
    .tool {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        width: 100%;
        min-height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        z-index: 1;
        box-shadow: 0px 4px 5px 0px rgba(0, 0, 0, 0.08);
    }
    .editor-box {
        margin: 120px auto 20px;
        padding: 60px 100px;
        width: 900px;
        box-sizing: border-box;
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
        .tinymce-box {
            width: 100%;
            min-height: calc(100vh - 290px);
            box-sizing: border-box;
            outline: none;
        }
    }
}
</style>
