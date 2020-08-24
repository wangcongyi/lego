<template>
  <el-dialog
    title="添加导航内容"
    append-to-body
    :visible.sync="show"
    width="40%"
    :close-on-click-modal=false
  >
    <el-container>
      <el-main>
        <el-form>
          <el-form-item label="名称">
            <el-input v-model="name" placeholder="导航项的显示名称" class="ipt" />
          </el-form-item>
          <el-form-item label="定位标识">
            <el-input v-model="mid" placeholder="请复制模块列表的组件id" class="ipt" />
          </el-form-item>
        </el-form>
      </el-main>
      <el-footer>
        <el-button @click="show = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </el-footer>
    </el-container>
  </el-dialog>
</template>

<script>
  import eventBus from '@/utils/eventBus'

  export default {
    data() {
      return {
        show: false,
        mid: '',
        name: '',
      }
    },
    created() {
      eventBus.$on('showBarEdit', () => {
        this.reset()
        this.show = true
      })
    },
    methods: {
      reset() {
        this.mid = ''
        this.name = ''
      },
      save() {
        eventBus.$emit('addBarItem', {
          name: this.name,
          mid: this.mid,
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .el-form {
    width: 100%;
  }
</style>

