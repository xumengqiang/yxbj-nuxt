<template>
  <!-- 钟 -->
  <div class="clock">
    <!-- 循环 -->
    <span v-for="m in 60" :key="m" class="anchor">
      <!-- 刻度 -->
      <span
        v-if="m % 5 != 0"
        class="anchor_line"
        :style="{
          left: center.x + 'px',
          top: center.y - 1 + 'px',
          transform: 'rotate(' + m * 6 + 'deg) translate(130px)',
        }"
      />
      <!-- 数字 - 分钟 -->
      <span
        v-if="m % 5 === 0"
        class="minute-num"
        :style="{
          left: center.x - 16 + 'px',
          top: center.y - 14 + 'px',
          transform:
            'translate(' +
            Math.cos((m * 6 * Math.PI) / 180 - Math.PI / 2) * 138 +
            'px, ' +
            Math.sin((m * 6 * Math.PI) / 180 - Math.PI / 2) * 138 +
            'px)',
        }"
      >{{ m }}</span>
      <!-- 数字 - 小时 -->
      <span
        v-if="m % 5 === 0"
        class="hour-num"
        :style="{
          left: center.x + (center.w / 2 - 50) + 'px',
          top: center.y + (center.h / 2 - 26) + 'px',
          transform:
            'translate(' +
            Math.cos((m * 6 * Math.PI) / 180 - Math.PI / 2) * 96 +
            'px, ' +
            Math.sin((m * 6 * Math.PI) / 180 - Math.PI / 2) * 96 +
            'px)',
        }"
      >{{ m / 5 }}</span>
    </span>
    <!-- 刻度结束 -->
    <!-- 日期、星期 -->
    <span class="date">{{ date.mounth }}</span>
    <span class="year"> {{ date.year }} </span>
    <span class="week">{{ date.week }}</span>
    <span class="time">{{ date.time }}</span>
    <!-- 分针 - 最底层的指针 -->
    <span
      class="minute-hand"
      :style="{
        transform:
          'rotate(' + date.minute_rotate + 'deg) translate(-20px)',
      }"
    />
    <!-- 时针 - 在分针之上 - 中间层指针-->
    <span
      class="hour-hand"
      :style="{
        transform:
          'rotate(' + date.hour_rotate + 'deg) translate(-20px)',
      }"
    />
    <!-- 秒针 - 在时针之上 - 最上层指针 -->
    <span
      class="second-hand"
      :style="{
        transform:
          'rotate(' + date.second_rotate + 'deg) translate(-36px)',
      }"
    />
    <!-- 表盘中心 -->
    <span class="center" />
  </div>
</template>
<script>
export default {
  name: 'Clock',
  data () {
    return {
      // 表盘中心
      center: {
        x: 150,
        y: 150,
        w: 4,
        h: 4,
        r: 6
      },
      date: {
        date_week: '', // 日期、星期
        second_rotate: 0, // 秒针角度
        hour_rotate: 0, //  时针角度
        minute_rotate: 0, // 分针角度
        year: '',
        mounth: '',
        week: '',
        time: ''
      },
      weeks: [
        '星期日',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
    }
  },
  mounted () {
    // 每 0.1 秒
    this.timer1 = setInterval(this.current_time, 100)
  },
  destroyed () {
    clearInterval(this.timer1)
  },
  methods: {
    current_time () {
      const myDate = new Date()
      const t = {}

      t.y = myDate.getFullYear() // 获取完整的年份(4位,1970-????)
      t.mn = myDate.getMonth() + 1 // 获取当前月份(0-11,0代表1月)
      t.d = myDate.getDate() // 获取当前日(1-31)
      t.w = myDate.getDay() // 获取当前星期X(0-6,0代表星期天)

      // 日期、星期
      this.date.year = t.y
      this.date.mounth = t.mn + '月' + t.d + '日'
      this.date.week = this.weeks[t.w]

      t.s = myDate.getSeconds() // 获取当前秒数(0-59)
      t.ms = myDate.getMilliseconds() // 获取当前毫秒数(0-999)

      this.date.second_rotate = (t.s + t.ms / 1000) * 6 - 90 // 一秒钟 6 度

      // 时针、分针
      t.h = myDate.getHours() // 获取当前小时数(0-23)
      t.m = myDate.getMinutes() // 获取当前分钟数(0-59)

      this.date.hour_rotate = (t.h + t.m / 60 + t.s / 3600) * 30 - 90 // 一小时 30 度
      this.date.minute_rotate = (t.m + t.s / 60) * 6 - 90 // 一分钟 6
      const two = (n) => {
        return n < 10 ? `0${n}` : `${n}`
      }

      this.date.time =
                two(t.h) +
                ':' +
                two(t.m) +
                ':' +
                two(t.s) +
                ':' +
                Math.round(t.ms / 10)
    }
  }
}
</script>
<style lang="less" scoped>
/* 表盘 */
.clock {
    background-color: #091924;
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: 4px;
    opacity: 0.8;
    .anchor {
        background-color: royalblue;
        position: relative;
        /* 刻度线 */
        .anchor_line {
            position: absolute;
            width: 18px;
            height: 2px;
            transform-origin: 0px 1px;
            background: #72777e;
        }
        /* 数字 - 分 */
        .minute-num {
            text-align: center;
            font-size: 18px;
            position: absolute;
            color: #72777e;
            width: 30px;
            height: 30px;
        }
        /* 数字 - 时 */
        .hour-num {
            text-align: center;
            font-weight: bold;
            font-size: 30px;
            position: absolute;
            color: #72777e;
            width: 100px;
            height: 30px;
            text-shadow: 0 2px 1px #9b9489, 0px -2px 1px #fff;
        }
    }
    .date {
        position: absolute;
        top: 70px;
        left: 120px;
        font-size: 20px;
        color: #fff;
        opacity: 0.2;
        font-weight: 500;
    }
    .year {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 70px;
        color: #fff;
        opacity: 0.08;
        font-weight: 500;
    }
    .week {
        position: absolute;
        top: 95px;
        left: 190px;
        font-size: 12px;
        color: #fff;
        opacity: 0.1;
    }
    .time {
        position: absolute;
        top: 190px;
        left: 100px;
        font-size: 20px;
        color: #fff;
        opacity: 0.5;
        font-weight: 500;
    }

    /* 秒针 */
    .second-hand {
        transform-origin: 0px 1px;
        position: absolute;
        background-color: hsl(120, 100%, 65%);
        width: 180px;
        height: 2px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        box-shadow: 0 0 3rem 9px hsla(120, 95%, 62%, 0.61);
    }
    /* 时针 */
    .hour-hand {
        transform-origin: 0px 4px;
        position: absolute;
        background: #ff135e;
        width: 80px;
        height: 8px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 4px;
    }

    /* 分针 */
    .minute-hand {
        transform-origin: 0px 3px;
        position: absolute;
        background: #ffffff;
        width: 120px;
        height: 6px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 3px;
    }
    /* 中心点 */
    .center {
        position: absolute;
        background: white;
        width: 4px;
        height: 4px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 2px solid #fab350;
        border-radius: 50%;
    }
}
</style>
