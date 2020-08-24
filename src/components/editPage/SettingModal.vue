<template>
  <el-dialog
      title="设置"
      append-to-body
      :visible.sync="show"
      width="620px"
      :close-on-click-modal="false"
      top="5vh"
  >
    <div class="content" v-if="editPage">
      <el-form label-width="85px">
<!--        <el-form-item label="投放平台">-->
<!--          <el-select v-if="!editPage.root_path" v-model="editPage.platform" placeholder="保存之后不能更改" class="ipt">-->
<!--            <el-option value="1" label="流行日记" />-->
<!--            <el-option value="2" label="生活有鱼" />-->
<!--          </el-select>-->
<!--          <el-input v-else class="ipt" disabled :value="/lifeyouyu/gi.test(editPage.root_path)?'流行日记':'生活有鱼'">-->
<!--          </el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="页面名称">
          <el-input v-model="editPage.name" placeholder="唯一，用于制作区分" class="ipt" />
        </el-form-item>
        <el-form-item label="页面路径">
          <el-input :placeholder="`${editPage.sub_path || '当前时间戳'}`" class="ipt" disabled />
          <div>{{url}}（部署后不能更改）</div>
        </el-form-item>
        <el-form-item label="页面标题">
          <el-input v-model="editPage.deploy_title" placeholder="选填，页面标题，不填默认页面名称" class="ipt" />
        </el-form-item>
        <el-form-item label="页面描述">
          <el-input v-model="editPage.deploy_desc" placeholder="选填，页面描述" class="ipt" />
        </el-form-item>
        <el-form-item label="页面关键词">
          <el-input v-model="editPage.deploy_keywords" placeholder="选填，页面关键词" class="ipt" />
        </el-form-item>
        <el-form-item label="所属活动">
          <span class="s-danger">{{ activityInfo }}</span>
        </el-form-item>
        <el-form-item label="页面有效期（活动预热期及正式期生效）">
          <span v-html="activityDate" />
          <div class="s-gray">过期页面将重定向404</div>
        </el-form-item>
      </el-form>
      <!-- <div class="wrap">
        <span class="tt">分享标题</span>
        <el-input v-model="editPage.share_title" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">分享描述</span>
        <el-input v-model="editPage.share_desc" placeholder="请输入内容" class="ipt"></el-input>
      </div>
      <div class="wrap">
        <span class="tt">分享头图</span>
        <el-input v-model="editPage.share_img_url" placeholder="请输入内容" class="ipt"></el-input>
        <img :src="editPage.share_img_url" class="img"/>
      </div>
       <div class="wrap">
        <span class="tt">分享链接</span>
        <el-input v-model="editPage.share_link" placeholder="请输入内容" class="ipt"></el-input>
      </div>-->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="show = false">取&nbsp;消</el-button>
      <el-button type="primary" @click="_save">确&nbsp;定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import BaseModal from '@/components/BaseModal.vue'
  import { parseTime } from '@/utils'
  import { ROOTPATHURL } from '../../../config/ossConfig'

  export default {
    components: { BaseModal },
    data() {
      return {
        show: false,
      }
    },
    computed: {
      activityInfo() {
        return `${this.activity.id}-${this.activity.activityName}`
      },
      activityDate() {
        const {
          preStartTime,
          preEndTime,
          formalStartTime,
          formalEndTime,
        } = this.activity
        if (preStartTime) {
          if (preEndTime === formalStartTime) {
            return `<br />${parseTime(preStartTime)} - ${parseTime(formalEndTime)}`
          } else {
            return `<br />${parseTime(preStartTime)} - ${parseTime(preEndTime)}<br />${parseTime(formalStartTime)} - ${parseTime(formalEndTime)}`
          }
        } else {
          return `<br />${parseTime(formalStartTime)} - ${parseTime(formalEndTime)}`
        }
      },
      activity() {
        return this.$store.state.activity
      },
      editPage() {
        return this.$store.state.editPage
      },
      canEditPath() {
        var page = this.editPage
        if (!page) {
          return true
        }
        // 未部署才能更改
        return !page.deployed_test && !page.deployed_prod
      },
      url() {
        const sub_path = this.editPage.sub_path || new Date().getTime()
        return ROOTPATHURL + `activity/${sub_path}/index.html`
      },
    },
    methods: {
      _save() {
        // if (this.editPage.root_path) {
        //   if (/lifeyouyu/gi.test(this.editPage.root_path)) {
        //     this.editPage.platform = '1'
        //   } else {
        //     this.editPage.platform = '2'
        //   }
        // }
        // if (!this.editPage.platform) {
        //   return this.$alert('请选择投放平台')
        // }
        if (!this.editPage.name) {
          return this.$alert('请填写作品名称')
        }
        if (!this.editPage.id) {
          this.$store.dispatch('createPage', {
            callback: () => {
              this._saveConfigs()
            },
          })
        } else {
          this._saveConfigs()
        }
      },
      _saveConfigs() {
        this.$store.dispatch('saveEdit')
          .then(_ => {
            this.show = false
            this.$message.success('保存成功')
            if (!this.$route.query.pageId) {
              this.$router.replace({
                path: 'byYourSelf',
                query: {
                  pid: this.$route.query.pid,
                  pageId: this.editPage.id,
                  activityId: this.editPage.activity_id,
                },
              })
            }
          }).catch(error => {
          this.$message.error('保存失败,' + error)
        })
      },
    },
  }
</script>

<style style="scss" scoped>
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

  .img {
    margin-left: 10px;
    width: 40px;
    height: 40px;
  }

  .s-danger {
    color: #f00;
  }

  .s-gray {
    color: #ccc;
  }
</style>
