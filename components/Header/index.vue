<template>
  <div class="header">
    <img class="logo" src="https://file.youxiubiji.com/nuxt/logo.png" />
    <input class="input" :value="value" @input="changeTitle" placeholder="请输入标题" />
    <el-button v-if="isEdit" icon="el-icon-edit" size="small" type="success" @click="publish">更新</el-button>
    <el-button v-else icon="el-icon-edit" size="small" type="primary" @click="publish">发布</el-button>
    <el-button icon="el-icon-close" size="small" plain type="danger" @click="cancle">关闭</el-button>
  </div>
</template>
<script>
export default {
  name: "Editor",
  props: {
    value: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    publish() {
      this.$emit("create")
    },
    cancle() {
      this.$emit("close")
    },
    changeTitle(event) {
      this.$emit('input', event.target.value)
    }
  }
};
</script>
<style lang="less" scoped>
.header {
  width: 100%;
  height: 60px;
  padding: 0 20px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  .logo {
    width: 40px;
    height: 40px;
  }
  .input {
    flex: 1;
    padding: 0 10px;
    box-sizing: border-box;
    height: 40px;
    border: 0;
    outline: none;
    color: #000;
    font-size: 20px;
    &::placeholder {
      color: #c1c1c1;
    }
  }
}
</style>