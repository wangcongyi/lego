<template>
  <el-dialog
    title="修改密码"
    append-to-body
    :visible.sync="dialogVisible"
    width="30%"
    :before-close="beforeClose"
    :close-on-click-modal="false"
  >
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      label-width="80px"
      class="demo-ruleForm"
    >
      <el-form-item label="旧密码" prop="oldPass">
        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" />
      </el-form-item>
      <el-form-item label="新密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      var checkAge = (rule, value, callback) => {
        if (value.trim() === '') {
          return callback(new Error('密码不能为空'))
        }
        callback()
      }
      var validatePass = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请输入新密码'))
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value.trim() === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        dialogVisible: true,
        ruleForm: {
          pass: '',
          checkPass: '',
          oldPass: '',
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' },
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' },
          ],
          oldPass: [
            { validator: checkAge, trigger: 'blur' },
          ],
        },
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('submit', this.ruleForm)
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      beforeClose() {
        this.$emit('close')
      },
    },
  }
</script>
