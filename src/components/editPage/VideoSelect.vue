<template>
  <el-dialog
    title="添加短视频模块"
    append-to-body
    :visible.sync="visible"
    width="40%"
    :close-on-click-modal="false"
  >
    <el-form>
      <el-form-item label="样式">
        <el-select v-model="select" placeholder="请选择" filterable>
          <el-option
            v-for="item in selectItem"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button @click="confirm" type="primary">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'VideoSelect',
  data () {
    return {
      visible: false,
      select: 1,
      selectItem: [
        { label: '模块1', value: 1 },
        { label: '模块2', value: 2 },
      ]
    }
  },
  methods: {
    show () {
      this.visible = true
    },
    confirm () {
      this.$emit('confirm', this.select)
      this.visible = false
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style>
</style>