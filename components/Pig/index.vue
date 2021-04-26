<template>
  <div class="main">
    <div class="title">
      我的猪
    </div>
    <div class="tarager">
      <div class="love" />
      <img class="gif" src="../../assets/404_images/love.gif">
      <div class="lovegrol" />
    </div>
    <p>{{ msg }}</p>
  </div>
</template>
<script>
export default {
  data () {
    return {
      msg: '',
      timer: null
    }
  },
  mounted () {
    this.timer = setInterval(this.init, 1000)
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    init () {
      const start = '2019-09-22 23:38:00'
      const diff =
                (new Date().getTime() -
                    new Date(start.replace(/-/g, '/')).getTime()) /
                1000
      const year = Math.floor(diff / 3600 / 24 / 365)
      const day = Math.floor((diff - year * 365 * 24 * 3600) / 3600 / 24)
      const hours = Math.floor(
        (diff - year * 365 * 24 * 3600 - day * 24 * 3600) / 3600
      )
      const mountie = Math.floor(
        (diff -
                    year * 365 * 24 * 3600 -
                    day * 24 * 3600 -
                    hours * 3600) /
                    60
      )
      const seconds = Math.floor(
        diff -
                    year * 365 * 24 * 3600 -
                    day * 24 * 3600 -
                    hours * 3600 -
                    mountie * 60
      )
      this.msg = `我们相恋了${year}年${day}天${hours}小时${mountie}分钟${seconds}秒啦`
    }
  }
}
</script>
<style lang="less" scoped>
.main {
    background-color: #fff;
    padding: 15px 10px;
    border-radius: 4px;
    .title {
        margin: 0 0 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #e7e7e7;
        font-size: 17px;
        position: relative;
        &::after {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 62px;
            height: 2px;
            background-color: #00a2ff;
            content: "";
        }
    }
    .tarager {
        display: flex;
        justify-content: center;
        .love {
            width: 60px;
            height: 60px;
            background-image: url("https://qiniu.youxiubiji.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210214160023.jpg");
            background-size: 100%;
            border-radius: 50%;
        }
        .gif {
            margin: 0 10px;
            width: 60px;
            border-radius: 50%;
        }
        .lovegrol {
            width: 60px;
            height: 60px;
            background-image: url("https://qiniu.youxiubiji.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20210214172717.jpg");
            background-size: 100%;
            border-radius: 50%;
        }
    }
    p {
        text-align: center;
        font-size: 14px;
        color: #333;
    }
}
</style>
