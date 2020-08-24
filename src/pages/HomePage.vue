<template>
  <el-row class="m-page">
    <!-- 工具栏 -->
    <el-row class="s-br" ref="toolbar">
      <el-button type="primary" @click="createPage">创建活动页</el-button>
      <el-button type="primary" @click="getPageList(1000)">刷新</el-button>
    </el-row>
    <!-- 搜索栏 -->
    <el-row :gutter="20" class="s-br" ref="search">
      <el-col :span="12">
        <el-input
          placeholder="页面名称"
          v-model="search"
          class="input-with-select"
          clearable
          @keyup.enter.native="searchList"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchList" />
        </el-input>
      </el-col>
    </el-row>
    <!-- 列表 -->
    <el-table :data="list" stripe :height="height">
      <el-table-column label="页面ID" prop="id" sortable min-width="100" fixed>
        <template slot-scope="{ row }">
          <span class="s-link" @click="enterEdit(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="页面名称" prop="name" sortable min-width="100" fixed>
        <template slot-scope="{ row }">
          <span class="s-link" @click="enterEdit(row)">{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布状态" min-width="100">
        <template slot-scope="{ row }">
          <span
            class="text"
            @click="openPage(row, 'deployed_prod')"
            :class="{'s-active': row.deployed_prod}"
          >线上</span>
          <span
            class="text"
            :class="{'s-active': row.deployed_test}"
            @click="openPage(row, 'deployed_test')"
          >测试</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者" prop="creator" sortable min-width="100" class="f-txc" />
      <el-table-column label="最近编辑" prop="editor" sortable min-width="100" class="f-txc" />
      <el-table-column
        label="更新时间"
        prop="updated_at"
        min-width="165"
        sortable
        :formatter="parseTime"
      ></el-table-column>
      <el-table-column label="操作" min-width="150" fixed="right">
        <template slot-scope="{ row }">
          <el-button type="text" @click="enterEdit(row)">编辑</el-button>
          <el-button type="text" @click="cloneItem(row)" v-if="row.pid ===1">复制</el-button>
          <el-button type="text" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 -->
    <el-row class="f-fr" ref="pagination">
      <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        @current-change="currentPageChange"
        layout="total, prev, pager, next"
      />
    </el-row>
  </el-row>
</template>

<script>
  import axios from 'axios'
  import { DOMAIN_URL } from '../../config/ossConfig'
  import { copy } from '@/utils'
  import { parseTime } from '@/utils'

  export default {
    computed: {
      env() {
        return this.$store.state.user.info.env
      },
    },
    data() {
      return {
        height: null,
        activity: null,
        activityId: null,
        selectIndex: 1,
        list: [],
        search: '',
        currentPage: 1,
        pageSize: 20,
        offset: 0,
        total: 0,
        drawer: true,
        selectItem: [{
          text: '活动模块',
          value: 1,
        }, {
          text: '种草模块',
          value: 2,
        }],
        trueDelete: false,
      }
    },
    async created() {
      this.activityId = this.$route.query.activityId
      window.GLOBAL_VM.HOME_PAGE = this
      await this.getPageList()
      this._initTableHieght()
    },
    methods: {
      _initTableHieght() {
        const { search = {}, toolbar = {}, pagination = {} } = this.$refs
        const searchHeight = search.$el && search.$el.clientHeight
        const toolbarHeight = toolbar.$el && toolbar.$el.clientHeight
        const paginationHeight = pagination.$el ? pagination.$el.clientHeight : 0
        console.log(searchHeight, toolbarHeight, paginationHeight)
        this.height = window.innerHeight - searchHeight - toolbarHeight - paginationHeight - 90
      },
      parseTime(row, column, value) {
        return parseTime(new Date(value.replace('Z', '')).getTime())
      },
      currentPageChange(current) {
        this.currentPage = current
        this.getPageList()
      },
      change() {
        this.getPageList()
      },
      setEditProduct(product) {
        this.$store.commit('setEditProduct', product)
      },
      getPageList(delay = 0) {
        const loading = this.$loading()
        return axios.post('/api/pages', {
          activityId: this.activityId,
          pid: this.selectIndex,
          offset: (this.currentPage - 1) * this.pageSize,
          limit: this.pageSize,
          search: this.search,
          more: window.CLONE_FLAG || false,
        }).then(data => {
          if (data.code === 200) {
            this.list = data.msg.list
            this.total = data.msg.total
          } else {
            this.$message.error('获取列表失败')
          }
          return data
        }).catch(error => {
          // error && this.$message.error(JSON.stringify(error))
          console.error('getPageList::error: ', JSON.stringify(error))
        }).then(_ => {
          setTimeout(_ => {
            loading.close()
          }, delay)
        })
      },
      createPage() {
        this.$router.push({
          path: 'byYourSelf',
          query: {
            pid: this.selectIndex,
            activityId: this.activityId,
          },
        })
      },
      enterEdit(pageModel) {
        this.$store.commit('setEditPage', pageModel)
        this.$router.push({
          path: 'byYourSelf',
          query: {
            pid: pageModel.pid,
            pageId: pageModel.id,
            activityId: pageModel.activity_id,
          },
        })
      },
      deleteItem(pageModel) {
        if (!this.trueDelete) {
          var name = prompt('删除后不可恢复，请输入页面标题进行确认')
          if (name === null) {
            // null为取消
            return
          }
          if (name !== pageModel.name) {
            this.$message.error('输入的名称不正确')
            return
          }
        }
        const url = this.trueDelete ? 'api/trueDeletePage' : 'api/deletePage'
        axios.post(url, { pageId: pageModel.id })
          .then(data => {
            if (data.code === 200) {
              this.getPageList()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(error => {
            this.$message.error(error)
          })
      },
      cloneItem(pageModel) {
        pageModel = window.CLONE_PAGE || pageModel
        if (window.CLONE_FLAG) {
          copy(JSON.stringify(pageModel))
        }
        var name = prompt('请输入新页面名称')
        if (!name) {
          return
        }

        if (
          this.list.find(page => {
            return page.name === name
          })
        ) {
          return this.$message.error('名称重复，请重命名')
        }
        axios.post('/api/clonePage', {
          origin: JSON.stringify(pageModel),
          placeActivityId: this.activityId,
          cloneName: name,
        })
          .then(data => {
            if (data.code === 200) {
              this.currentPage = 1
              this.getPageList()
            } else {
              this.$message.error(data.msg)
            }
          })
          .catch(e => {
            this.$message.error(e)
          })
          .then(_ => {
            window.CLONE_PAGE = null
          })
      },
      openPage(item, env) {
        var time = +new Date()
        var pd = this.product
        if (!item[env]) {
          this.$message.error('尚未部署，请进入编辑器部署')
          return
        }
        var from = (item.pid === 1) ? `from=${item.name}` : ''
        if (env === 'deployed_test') {
          // 用户点击测试  并已部署到本地路径下
          window.open(`/deployed/${this.env === 'development' ? 'test/' : ''}${item.sub_path}/index.html?${from}`, '_blank')
        } else if (item.deployed_prod) {
          window.open(`${DOMAIN_URL}activity/${this.env === 'development' ? 'test/' : ''}${item.sub_path}/index.html?${from}`, '_blank')
          return
        }
      },
      searchList() {
        this.currentPage = 1
        this.getPageList()
      },
    },
  }
</script>

<style scoped>
  .m-page {
    padding: 0 10px;
  }

  .text {
    padding: 5px;
  }

  .s-active {
    padding: 5px;
    cursor: pointer;
    background: #1976d2;
    color: #fff;
  }
</style>
