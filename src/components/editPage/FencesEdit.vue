<template>
  <el-tabs
    v-if="editModel.fencesCount > 0"
    v-model="tabsActive"
    type="card"
    class="tabs"
    closable
    @tab-remove="removeTab"
  >
    <el-tab-pane
      v-for="item in editModel.fences"
      :key="item.mid"
      :label="item.title"
      :name="item.mid"
    >
      <el-form-item label="区域名">
        <el-input type="input" v-model="item.title" clearable />
      </el-form-item>
      <el-form-item label="图片地址">
        <el-input type="input" v-model="item.imageSource" clearable />
      </el-form-item>
      <el-form-item label="链接">
        <LinkToolItem
          :link="item.link"
          @remove="item.link = null"
          @confirm="(result) => {item.link = result}"
        />
      </el-form-item>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { guid } from '@/utils'
import LinkToolItem from './LinkToolItem'
export default {
  name: 'FencesEdit',
  components: {
    LinkToolItem
  },
  props: {
    editModel: {
      type: Object,
      required: true
    },
    editList: {
      type: Array,
      required: true
    }
  },
  watch: {
    'editModel.fencesCount' (newVal, oldVal) {
      this.editModel.fences = this.editModel.fences.slice(0, newVal)
      if (newVal > oldVal) {
        new Array(newVal - oldVal).fill('').forEach(_ => {
          this.editModel.fences.push({
            title: `区域${this.editModel.fences.length + 1}`,
            mid: guid(),
            imageSource: '',
            link: null
          })
        })
      }
    }
  },
  data () {
    return {
      tabsActive: ''
    }
  },
  methods: {
    removeTab (targetName) {
      this.editModel.fences = this.editModel.fences.filter(item => item.mid !== targetName)
    }
  }
}
</script>

<style lang="scss">
.tabs {
  padding: 0 18px 0 50px;
}
</style>