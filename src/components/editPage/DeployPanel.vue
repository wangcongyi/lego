<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="功能列表" name="deploy">
      <div v-if="!editPage.id">
        <el-button @click="createPage()" type="primary">创建</el-button>
        <el-button @click="$emit('exit')">退出</el-button>
      </div>
      <div v-else>
        <el-popover placement="top" trigger="manual" v-model="autosaveLoading">
          <i class="el-icon-loading" />&nbsp;&nbsp;&nbsp;自动保存草稿中...
          <el-button slot="reference" v-debounce="[_ => { _save() }, 1000, true]" type="primary">保存</el-button>
        </el-popover>
        <el-button @click="$emit('exit')" style="margin-left: 10px;">退出</el-button>
        <el-button @click="enterUpload">资源上传</el-button>
        <el-button @click="showModal()">设置</el-button>
        <el-button
            v-debounce="[_ => { _saveThenDeploy('test') }, 1000, true]"
            class="s-br"
        >部署到测试/本地环境
        </el-button>
        <el-button v-debounce="[_ => { _saveThenDeploy('prod') }, 1000, true]">部署到线上环境</el-button>
        <br />
        <span>状态：{{deployStatus}}</span>
        <div v-if="deployResultPath" class="showResult s-br">
          <el-checkbox v-if="hasTimestampSwitch" v-model="hasTimestamp">带时间戳</el-checkbox>&nbsp;
          <el-button @click="copyLink">复制链接</el-button>
          <el-button @click="_openDeployResult">打开链接</el-button>
        </div>
        <div class="qrcode s-br" ref="qrcode" v-show="deployResultPath"></div>
      </div>
      <setting-modal ref="setting" />
    </el-collapse-item>
  </el-collapse>
</template>

<script>
  import axios from 'axios'
  import SettingModal from './SettingModal.vue'
  import { isNeedLogin, copy } from '@/utils'

  export default {
    components: { SettingModal },
    data() {
      return {
        isNodeProdEnv: false,
        pid: 1,
        deployName: '', //部署路径名称
        deployStatus: '', //部署结果状态
        deployResultPath: '', //部署成功后，返回的访问路径
        qrcode: null,
        activeNames: ['deploy'],
        activityId: null,
        hasTimestamp: false,
        loading: false,
        hasTimestampSwitch: false,
        autosaveLoading: false,
        autosaveTime: 60 * 1000,
        pageId: null,
      }
    },
    computed: {
      tModel() {
        return this.$store.state.tModel
      },
      tName() {
        return this.$store.state.tName
      },
      editPage() {
        return this.$store.state.editPage
      },
      activity() {
        return this.$store.state.activity
      },
    },
    created() {
      this.isNodeProdEnv = process.env.NODE_ENV === 'production'
      this.activityId = this.$route.query.activityId
    },
    mounted() {
      window.GLOBAL_VM.DEPLOY_PANEL = this
      this.pageId = this.$route.query.pageId
      this._restorePage()
    },
    beforeDestroy() {
      this._saveDraft()
    },
    methods: {
      // 从草稿恢复页面
      _restorePage() {
        try {
          const UNEXPECTED_EXIT = !!+localStorage.getItem(`UNEXPECTED_EXIT${this.pageId}`)
          if (UNEXPECTED_EXIT) {
            const currentPage = JSON.parse(
              localStorage.getItem(this._getDraftName('UNEXPECTED')) ||
              localStorage.getItem(this._getDraftName()),
            )
            if (currentPage) {
              this.$confirm('是否读取草稿?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
              }).then(() => {
                const loading = this.$loading({
                  lock: true,
                  text: '恢复中，请不要关闭当前页面',
                  spinner: 'el-icon-loading',
                  background: 'rgba(0, 0, 0, 0.7)',
                })
                this.$store.dispatch('saveEdit', { tModel: currentPage }).then(_ => {
                  loading.close()
                  localStorage.setItem(`UNEXPECTED_EXIT${this.pageId}`, 0)
                  this.$message.success('恢复成功')
                  setTimeout(_ => {
                    location.reload()
                  }, 200)
                }).catch(error => {
                  this.$message.error('恢复失败' + error && JSON.stringify(error))
                })
              })
            }
          } else {
            this._saveDraftInterval()
          }
        } catch (error) {
          this.message.error('恢复失败')
        }
      },
      // 获取页面信息
      _getPageDetail() {
        const state = this.$store.state
        return JSON.stringify(state.tModel)
      },
      // 轮询保存草稿
      _saveDraftInterval() {
        const timmer = setInterval(_ => {
          this.autosaveLoading = true
          this._saveDraft()
          setTimeout(_ => {
            this.autosaveLoading = false
          }, 1000)
        }, this.autosaveTime)
        this.$once('hook:beforeDestroy', _ => {
          clearInterval(timmer)
        })
      },
      _save() {
        this._saveDraft()
        this.$emit('save')
      },
      _saveDraft(PREFIX = 'DRAFT') {
        localStorage.setItem(this._getDraftName(PREFIX), this._getPageDetail())
      },
      _getDraftName(PREFIX = 'DRAFT') {
        return `${PREFIX}_PAGE${this.pageId}`
      },
      /**
       * 保存然后部署
       */
      _saveThenDeploy(env) {
        if (this.deployStatus === '部署中') {
          return this.$alert('正在部署中，请勿重复点击')
        }
        this.loading = this.$loading({
          lock: true,
          text: '正在部署中，请不要关闭当前页面',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        this.$store.dispatch('saveEdit')
          .then(_ => {
            this.deployResultPath = ''
            this._deploy(env)
          })
          .catch(error => {
            this.$message.error('保存失败' + error && JSON.stringify(error))
          })
      },
      /**
       * 部署 env: {test or prod}
       */
      _deploy(env) {
        if (this.deployStatus === '部署中') {
          return
        }
        this.deployStatus = '部署中'
        const {
          preStartTime,
          preEndTime,
          formalStartTime,
          formalEndTime,
        } = this.activity
        axios.post('/api/deploy', {
          env: env,
          id: this.editPage.id,
          aid: `${preStartTime ? preStartTime : ''};${preEndTime ? preEndTime : ''};${formalStartTime};${formalEndTime}`,
          needLogin: isNeedLogin(this.tModel),
        })
          .then(data => {
            if (data.code === 200) {
              this.deployStatus = '部署成功'
              this.deployResultPath = data.msg
              if (!this.qrcode) {
                this.qrcode = new QRCode(this.$refs.qrcode, {
                  text: this.genCodeUrl(),
                  width: 128,
                  height: 128,
                  colorDark: '#000000',
                  colorLight: '#ffffff',
                  correctLevel: QRCode.CorrectLevel.H,
                })
              } else {
                this.qrcode.clear()
                this.qrcode.makeCode(this.genCodeUrl())
              }
              this.$store.commit('updatePage', {
                [env !== 'prod' ? 'deployed_test' : 'deployed_prod']: 1,
              })
              this.loading.close()
            } else {
              this.loading.close()
              this.deployStatus = '部署失败，' + data.msg
            }
          })
          .catch(err => {
            this.loading.close()
            this.deployStatus = '部署失败，' + err.message
          })
      },
      /**
       * 打开链接
       */
      _openDeployResult() {
        if (this.deployResultPath) {
          window.open(this.genUrl(), '_blank')
        }
      },
      genCodeUrl() {
        // var time = +new Date()
        // if (this.hasTimestamp)
        //   return this.deployResultPath + '?t=' + time
        // else
        return this.deployResultPath
      },
      genUrl() {
        // var time = +new Date()
        // var url = ''
        // if (this.hasTimestamp)
        //   url = this.deployResultPath + '?t=' + time + '&from=' + this.editPage.name
        // else
        //   url = this.deployResultPath + '?from=' + this.editPage.name

        return encodeURI(this.deployResultPath)
      },
      copyLink() {
        if (this.deployResultPath) {
          copy(this.genUrl(), () => {
            this.$message.info('复制成功')
          })
        }
      },
      createPage() {
        this.editPage.sub_path = +new Date()
        this.editPage.activity_id = this.activityId
        this.$refs.setting.show = true
      },
      showModal() {
        this._saveDraft()
        this.$refs.setting.show = true
      },
      enterUpload() {
        window.open(`/upload`, '_blank')
      },
    },
  }
</script>

<style lang="scss" scoped>
  .showResult {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;

    .checkbox {
      flex: 0 0 100px;
    }
  }

  .qrcode {
    display: inline-block;
  }
</style>

