<template>
  <div class="sift-item">
    <div v-if="item.cover" class="item_img">
      <img :src="item.cover" lazy="loaded">
    </div>
    <div class="item_info">
      <nuxt-link v-slot="{href, navigate }" :to="`/article/${item.id}`" target="_blank" custom>
        <a
          :href="href"
          @click="navigate"
        >
          <h4 class="item-title">
            {{ item.title }}
          </h4>
        </a>
      </nuxt-link>
      <p v-if="item.cate" class="item-p">
        {{ item.cate.cateName }} <span>浏览 {{ item.views }}</span>
      </p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Aside',
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
.sift-item {
    display: flex;
    height: 90px;
    margin: 0 10px 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #eee;
    .item_img {
        width: 100px;
        height: 90px;
        box-sizing: border-box;
        padding: 5px;
        img {
            border-radius: 4px;
            width: 100%;
            height: 100%;
        }
    }
    .item_info {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 5px;
        justify-content: space-between;
        a {
            text-decoration: none;
            .item-title {
                margin: 0;
                color: #333;
                font-size: 16px;
                max-height: 40px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                line-clamp: 2;
                -webkit-box-orient: vertical;
                cursor: pointer;
            }
        }
        .item-p {
            font-size: 14px;
            color: #999;
            margin: 0;
            padding-bottom: 5px;
            span {
                margin-left: 10px;
            }
        }
        &:hover h4 {
            color: #00a8ff;
        }
    }
    &:last-child {
        border: none;
    }
}
</style>
