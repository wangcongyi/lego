<template>
  <div v-if="visible">
    <div class="g-result">
      <BaseTpl ref="tComponent" :model="model"></BaseTpl>
    </div>
    <div class="g-edit">
      <EditPanel class="m-edit-panel" ref="editPanel" @exit="_exit" />
      <ComponentsPanel class="m-product-panel" />
      <DeployPanel v-if="pid===1" class="m-deploy-panel" @save="_onSaveClick" @exit="_exit" />
    </div>
  </div>
</template>

<script>
  import BaseTpl from '@/templates/BaseTpl.vue'
  import EditPanel from '@/components/editPage/EditPanel.vue'
  import DeployPanel from '@/components/editPage/DeployPanel.vue'
  import ComponentsPanel from '@/components/editPage/ComponentsPanel.vue'

  export default {
    components: {
      EditPanel,
      DeployPanel,
      BaseTpl,
      ComponentsPanel,
    },
    name: 'ByYourSelf',
    data() {
      return {
        model: [],
        pid: 1,
        activityId: null,
        flag: true, //判断是否编辑页
        visible: false,
        pageId: null,
      }
    },
    watch: {
      pageModel(data) {
        if (!data['t_model']) {
          this.model = []
        } else {
          var serverTemplateModel = JSON.parse(data['t_model'])
          this.model = serverTemplateModel
        }
        this.$store.commit('settModel', this.model)
      },
    },
    computed: {
      pageModel() {
        return this.$store.state.editPage
      },
    },
    created() {
      this.init()
    },
    beforeDestroy() {
      this.$store.dispatch('resetPageDetail')
      this.$store.dispatch('resetCurrentActivity')
    },
    methods: {
      /**
       * 初始化
       */
      async init() {
        const pid = this.pid = parseInt(this.$route.query.pid, 10)
        const activityId = this.activityId = this.$route.query.activityId
        const pageId = this.pageId = this.$route.query.pageId

        if (!pid || !activityId) {
          this.$alert('请选择活动后，再操作')
          this.$router.push('/')
        }
        this.$store.dispatch('getActivityDetail', { activityId }).catch(_ => {
          this.$router.push('/')
          return
        })
        const currentPage = await this.$store.dispatch('getPageDetail', { pageId, pid })
        this.visible = currentPage.hasPower
        if (!this.visible) {
          this._exit()
          return
        }
        this.$store.commit('settName', BaseTpl.name)
      },
      _onSaveClick() {
        if (!this.pageModel.id) {
          var name = prompt('请输入保存的页面名')
          if (!name) return
          this.$store.dispatch('createPage', {
            name: name,
            callback: this._save.bind(this),
          })
        } else {
          this._save()
        }
      },
      /**
       *保存编辑结果
       */
      _save() {
        this.$store.dispatch('saveEdit').then(_ => {
          this.$message.success('保存成功')
        }).catch(error => {
          this.$message.error(error)
        })
      },
      /**
       * 退出编辑
       */
      _exit() {
        if (this.$route.query.activityId) {
          this.$router.push({
            path: 'page',
            query: {
              activityId: this.$route.query.activityId,
            },
          })
        } else {
          this.$router.go(-1)
        }
      },
    },
  }
</script>
<style lang="scss">
  .g-edit {
    .el-collapse-item__header {
      padding-left: 20px;
    }

    // .el-tree-node__children .el-tree-node__expand-icon.is-leaf {
    //   width: 0;
    //   padding: 0;
    // }
    .el-form {
      text-align: left;

      .el-form-item__content {
        padding-right: 20px;
      }
    }

    .el-upload-dragger .el-upload__text {
      margin-top: 0;
    }

    .btnWrap {
      text-align: center;
    }
  }
</style>
<style lang="scss" scoped>
  * {
    text-align: center;
  }

  .p-edit {
    display: flex;
  }

  *::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 0; /*高宽分别对应横竖滚动条的尺寸*/
    height: 0;
  }

  *::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 5px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.2);
  }

  *::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 0;
    background: rgba(0, 0, 0, 0.1);
  }

  .g-result {
    vertical-align: top;
    box-sizing: border-box;
    width: calc(100% - 520px);
    height: 100vh;
    overflow: auto;
    min-width: 377px;

    .m-confirm {
      right: 301px;
    }

    .m-contact {
      right: calc((100% - 290px) / 2 + 290px - 170px);
      top: 520px;
      bottom: auto;
    }

    .g-box {
      min-width: 1180px;
    }

    .g-box-pc {
      position: relative;

      .nav-box {
        width: calc(100% - 300px);
      }
    }

    .g-box-mobile {
      position: relative;
      border: 1px solid #333;
      width: 377px;
      height: 667px;
      margin: 50px auto 0;
      box-sizing: border-box;
      overflow: auto;
    }
  }

  .g-edit {
    height: 100%;
    position: fixed;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    right: 0px;
    top: 0;
    overflow-y: scroll;
    vertical-align: top;
    width: 480px;
    box-sizing: border-box;
  }

  .m-edit-panel,
  .m-deploy-panel,
  .m-product-pannel {
    width: 100%;
    box-sizing: border-box;
  }

  .m-deploy-panel,
  .m-product-panel {
    margin-top: 10px;
  }

  .sel-view {
    height: 30px;
    line-height: 30px;
  }
</style>
