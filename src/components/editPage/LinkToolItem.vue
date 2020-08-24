<template>
  <el-row>
    <span v-if="!objectNull(link)">
      <span class="s-danger">#1&nbsp;&nbsp;</span>
      <el-button type="text" @click="remove">删除</el-button>
      <el-button type="text" @click="showEditConfig">编辑</el-button>
    </span>
    <el-button v-else size="small" @click="linkToolVisible = true">+ 配置</el-button>
    <LinkTool @confirm="linkToolConfirm" @close="linkToolVisible = false" v-if="linkToolVisible" />
    <AreaEdit ref="areaEditModal" />
  </el-row>
</template>

<script>
import AreaEdit from './AreaEdit.vue'
import LinkTool from './LinkTool.vue'
export default {
  components: {
    AreaEdit,
    LinkTool
  },
  props: {
    link: {
      type: Object,
      default: null
    }
  },
  watch: {
    link () {
    }
  },
  data () {
    return {
      linkToolVisible: false
    }
  },
  methods: {
    objectNull (obj) {
      if (obj) {
        return typeof obj === 'object' && JSON.stringify(obj) === '{}'
      }
      return !obj
    },
    showEditConfig (index) {
      this.$refs.areaEditModal.showModal(this.link)
    },
    linkToolConfirm (result) {
      this.$emit('confirm', result)
      this.linkToolVisible = false
    },
    remove () {
      this.$emit('remove')
    }
  }
}
</script>

<style>
</style>