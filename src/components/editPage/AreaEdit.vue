<template>
  <el-dialog
    title="编辑"
    append-to-body
    :visible.sync="show"
    width="40%"
    :close-on-click-modal="false"
  >
    <div class="content" v-if="info">
      <div class="wrap">
        <span class="tt">小程序地址</span>
        <el-input v-model="info.wxLink" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">app地址</span>
        <el-input v-model="info.appLink" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">h5地址</span>
        <el-input v-model="info.h5Link" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">跳转参数</span>
        <el-input v-model="info.parameter" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">图片</span>
        <el-input v-model="info.imageSource" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">埋点</span>
        <el-input v-model="info.desc" placeholder="请输入内容" class="ipt"></el-input>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false" type="primary">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data () {
    return {
      show: false,
      info: null
    }
  },
  methods: {
    showModal (data) {
      this.show = true
      this.info = data
    },
    save () {

    }
  }
}
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  margin-bottom: 10px;
}
.tt {
  display: inline-block;
  width: 20%;
}
.ipt {
  display: inline-block;
  width: 70%;
}
</style>

