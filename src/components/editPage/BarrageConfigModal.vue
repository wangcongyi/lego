<template>
  <el-dialog
    title="新消息"
    :visible="true"
    append-to-body
    :close-on-click-modal="false"
    @close="$emit('close')"
  >
    <el-form ref="form" :model="formData">
      <el-form-item
        prop="title"
        label="消息内容"
        :rules="{ required: true, message: '请输入消息内容', trigger: 'blur' }"
      >
        <el-input v-model="formData.title" />
      </el-form-item>
      <el-form-item prop="link" label="跳转链接">
        <LinkToolItem :link="formData.link" @remove="formData.link = null" @confirm="linkToolConfirm"/>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="$emit('close')">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import LinkToolItem from './LinkToolItem.vue'
export default {
  components: {
    LinkToolItem
  },
  data () {
    return {
      formData: {
        title: '',
        link: null
      }
    }
  },
  methods: {
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('confirm', this.formData)
        }
      })
    },
    linkToolConfirm (result) {
      this.formData.link = result
    }
  }
}
</script>

<style>
</style>