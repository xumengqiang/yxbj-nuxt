<template>
    <div class="sub-view-box">
        <h1 class="header">个人资料</h1>
        <div class="menu">
            <div class="item">
                <div class="label">头像</div>
                <div class="content">
                    <img
                        class="avatar-uploader"
                        :src="info.avatar ? info.avatar : circleUrl"
                    />
                    <div class="btn-uploader">
                        <div class="upload-desc">
                            支持 jpg、png、jpeg 格式大小 5M 以内的图片
                        </div>
                        <el-upload
                            class="upload-demo"
                            :multiple="false"
                            :show-file-list="false"
                            :on-success="handleImageSuccess"
                            :before-upload="handleImageBrfore"
                            :headers="headers"
                            action="/api/upload"
                        >
                            <el-button
                                size="mini"
                                :loading="loading"
                                type="primary"
                                >点击上传</el-button
                            >
                        </el-upload>
                    </div>
                </div>
            </div>
            <div class="item" v-for="(item, index) in setList" :key="index">
                <div class="label">{{ item.label }}</div>
                <div class="input-auto">
                    <input
                        class="input"
                        v-model="item.value"
                        :placeholder="item.placeholder"
                        :ref="'input_' + index"
                        @blur="changeBlur(index)"
                        @focus="changeFocus(index)"
                    />
                    <div class="input-rg">
                        <el-link
                            class="link"
                            v-if="!item.isFocus"
                            type="primary"
                            :underline="false"
                            @click="Save(index)"
                            >保存</el-link
                        >
                        <el-link
                            class="link"
                            v-if="!item.isFocus"
                            type="info"
                            @click="Cancel(index)"
                            :underline="false"
                            >取消</el-link
                        >
                        <el-link
                            class="link"
                            v-if="item.isFocus"
                            type="primary"
                            icon="el-icon-edit"
                            :underline="false"
                            @click="Edit(index)"
                            >修改</el-link
                        >
                    </div>
                </div>
            </div>
            <!-- <div class="item">
                <div class="label">修改密码</div>
                <div class="input-auto">
                    <div class="input"></div>
                    <div class="input-rg">
                        <el-link
                            class="link"
                            type="primary"
                            icon="el-icon-edit"
                            :underline="false"
                            @click="changePassword"
                            >修改</el-link
                        >
                    </div>
                </div>
            </div> -->
        </div>
        <el-dialog
            title="修改密码"
            width="30%"
            :visible.sync="dialogFormVisible"
        >
            <el-form :model="form" ref="updateForm" :rules="rules">
                <el-form-item
                    label="原密码"
                    prop="old_password"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="form.old_password"
                        autocomplete="off"
                        type="password"
                        maxlength="20"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="新密码"
                    prop="new_password"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="form.new_password"
                        autocomplete="off"
                        type="password"
                        maxlength="20"
                        show-password
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="确认密码"
                    prop="once_password"
                    :label-width="formLabelWidth"
                >
                    <el-input
                        v-model="form.once_password"
                        autocomplete="off"
                        type="password"
                        maxlength="20"
                        show-password
                    ></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button
                    type="primary"
                    @click="changepassUpdate"
                    :loading="loading"
                    >确 定</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { upd_avatar, upd_nickname, upd_blog, upd_password } from "api/user";
export default {
    name: "Settings",
    layout: "main",
    data() {
        const validateold_password = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入原密码"));
            } else {
                callback();
            }
        };
        const validatenew_password = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入新密码"));
            } else if (value.length < 6) {
                callback(new Error("新密码至少6位数"));
            } else {
                callback();
            }
        };
        const validateonce_password = (rule, value, callback) => {
            if (!value) {
                callback(new Error("请输入确认密码"));
            } else if (value != this.form.new_password) {
                callback(new Error("新密码和确认密码不一致"));
            } else {
                callback();
            }
        };
        return {
            circleUrl: "https://file.youxiubiji.com/nuxt/head-bd.png",
            loading: false,
            setList: [
                {
                    label: "用户昵称",
                    placeholder: "填写你的昵称",
                    value: this.$store.state.info.nickname,
                    isFocus: true,
                },
                {
                    label: "个人主页",
                    placeholder: "填写你的个人主页",
                    value: this.$store.state.info.blog,
                    isFocus: true,
                },
            ],
            form: {
                old_password: "",
                new_password: "",
                once_password: "",
            },
            rules: {
                old_password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateold_password,
                    },
                ],
                new_password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validatenew_password,
                    },
                ],
                once_password: [
                    {
                        required: true,
                        trigger: "blur",
                        validator: validateonce_password,
                    },
                ],
            },
            dialogFormVisible: false,
            formLabelWidth: "120px",
        };
    },
    computed: {
        info() {
            return this.$store.state.info;
        },
        headers() {
            return {
                authorization: `Bearer ${this.$store.state.token}`, // 直接从本地获取token就行
            };
        },
    },
    methods: {
        //点击修改按钮
        Edit(index) {
            this.setList[index].isFocus = false;
            this.$refs["input_" + index][0].select();
        },
        //保存安扭
        Save(index) {
            switch (index) {
                case 0:
                    if (this.setList[index].value.length <= 10) {
                        upd_nickname({ nickname: this.setList[index].value })
                            .then(() => {
                                this.setList[index].isFocus = true;
                                this.info.nickname = this.setList[index].value;
                                this.$notify({
                                    title: "更新成功",
                                    message: "用户昵称更新成功~",
                                    type: "success",
                                });
                            })
                            .catch((err) => console.log(err));
                    } else {
                        this.$message({
                            message: "用户昵称不能超过十个字~",
                            type: "warning",
                        });
                    }
                    break;
                case 1:
                    if (this.setList[index].value.length > 100) {
                        this.$message({
                            message: "个人主页不能超过100个字符~",
                            type: "warning",
                        });
                    } else if (this.setList[index].value.indexOf("http") < 0) {
                        this.$message({
                            message: "个人主页不正确哦~",
                            type: "warning",
                        });
                    } else {
                        upd_blog({ blog: this.setList[index].value })
                            .then(() => {
                                this.setList[index].isFocus = true;
                                this.info.blog = this.setList[index].value;
                                this.$notify({
                                    title: "更新成功",
                                    message: "个人主页更新成功~",
                                    type: "success",
                                });
                            })
                            .catch((err) => console.log(err));
                    }
                    break;
            }
        },
        //取消按钮
        Cancel(index) {
            this.setList[index].isFocus = true;
            switch (index) {
                case 0:
                    this.setList[index].value = this.info.nickname;
                    break;
                case 1:
                    this.setList[index].value = this.info.blog;
                    break;
            }
        },
        //失去焦点
        changeBlur(index) {
            switch (index) {
                case 0:
                    if (this.info.nickname == this.setList[index].value) {
                        this.setList[index].isFocus = true;
                    }
                    break;
                case 1:
                    if (this.info.blog == this.setList[index].value) {
                        this.setList[index].isFocus = true;
                    }
                    break;
            }
        },
        //获取焦点
        changeFocus(index) {
            this.setList[index].isFocus = false;
        },
        //上传头像
        handleImageSuccess(file) {
            this.loading = true;
            let avatar = this.info.avatar;
            this.info.avatar = file.data.imgUrl;
            upd_avatar({ avatar: file.data.imgUrl })
                .then(async () => {
                    this.loading = false;
                })
                .catch(() => {
                    this.info.avatar = avatar;
                    this.loading = false;
                });
        },
        handleImageBrfore() {
            this.loading = true;
        },
        //修改密码
        changePassword() {
            this.dialogFormVisible = true;
        },
        //确认修改密码
        changepassUpdate() {
            this.$refs.updateForm.validate((valid) => {
                if (valid) {
                    this.loading = true;
                    upd_password(this.form)
                        .then(async () => {
                            this.loading = false;
                            await this.$store.dispatch("user/resetToken");
                            this.$router.push("/");
                        })
                        .catch(() => {
                            this.loading = false;
                        });
                }
            });
        },
    },
};
</script>
<style lang="less" scoped>
.sub-view-box {
    display: flex;
    padding: 0 40px;
    flex-direction: column;
    .header {
        color: #333;
        font-size: 24px;
    }
    .menu {
        display: flex;
        flex-direction: column;
        .item {
            display: flex;
            align-items: center;
            padding: 30px 0;
            box-sizing: border-box;
            border-top: 1px solid #f1f1f1;
            .label {
                width: 120px;
                color: #333;
                font-size: 15px;
                font-weight: 500;
            }
            .content {
                flex: 1;
                display: flex;
                .avatar-uploader {
                    width: 72px;
                    height: 72px;
                    margin-right: 30px;
                }
                .btn-uploader {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    padding: 10px 0;
                    box-sizing: border-box;
                    .upload-desc {
                        color: #909090;
                        font-size: 12px;
                    }
                }
            }
            .input-auto {
                flex: 1;
                display: flex;
                justify-content: space-between;
                .input {
                    flex: 1;
                    border: none;
                    outline: none;
                    color: #333;
                    // color: #909090;
                    font-size: 16px;
                    &::placeholder {
                        color: #c1c1c1;
                    }
                }
                .input-rg {
                    text-align: right;
                    .link {
                        padding-left: 20px;
                    }
                }
            }
            &:first-child {
                padding: 12px 0;
            }
            &:last-child {
                border-bottom: 1px solid #f1f1f1;
            }
        }
    }
}
</style>