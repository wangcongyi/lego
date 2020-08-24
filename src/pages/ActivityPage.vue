<template>
  <el-row class="m-activity">
    <!-- 搜索栏 -->
    <el-row class="s-br" ref="search">
      <el-form
        inline
        ref="searchForm"
        label-width="80px"
        width="100%"
        :model="searchForm"
        :rules="searchRules"
        @submit.native.prevent
      >
        <el-form-item label="活动名称" prop="activityName">
          <el-input placeholder="请输入活动名称" v-model="searchForm.activityName" clearable />
        </el-form-item>
        <el-form-item label="活动ID" prop="activityIds">
          <el-input
            type="textarea"
            placeholder="以英文逗号','分割活动Id"
            v-model="searchForm.activityIds"
            clearable
            style="min-width: 300px;"
          />
          <div
            v-if="searchForm.activityIds.replace(/(^\s*)|(\s*$)/g, '')"
          >{{ keyWordsStr(searchForm.activityIds.replace(/(^\s*)|(\s*$)/g, '')) }}
          </div>
        </el-form-item>
        <!-- <el-form-item label="活动创建人">
            <el-input placeholder="请输入活动创建人" v-model="search.activityFounder" />
        </el-form-item>-->
      </el-form>
    </el-row>
    <!-- 工具栏 -->
    <el-row ref="toolbar">
      <el-button type="primary" @click="showCreate">创建活动</el-button>
      <el-button type="primary" @click="getList(1000)">刷新</el-button>
      <el-button type="primary" @click="searchList">查询</el-button>
      <el-button @click="cleanSearch">清空</el-button>
    </el-row>
    <!-- <el-checkbox v-model="isMyActivity" /> -->
    <!-- <span>我的活动</span> -->
    <!-- 列表 -->
    <el-table
      class="s-br"
      :data="list"
      :default-sort="{prop: 'activityLevel', order: 'descending'}"
      stripe
      :height="height"
    >
      <el-table-column label="活动ID" prop="id" sortable min-width="100" fixed>
        <template slot-scope="{ row }">
          <span class="s-link" @click="goActivityPages(row)">{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称" prop="activityName" sortable min-width="100" fixed>
        <template slot-scope="{ row }">
          <span class="s-link" @click="goActivityPages(row)">{{ row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动级别" prop="activityLevel" sortable min-width="100" />
      <el-table-column label="创建者" prop="creator" sortable min-width="100" />
      <el-table-column label="最近编辑" prop="editor" sortable min-width="100" />
      <el-table-column
        label="更新时间"
        prop="updatedTime"
        min-width="165"
        sortable
        :formatter="parseTime"
      ></el-table-column>
      <el-table-column label="预热时间" min-width="165">
        <template slot-scope="{ row }">
          <div>{{ row.preStartTime | parseTime }}</div>
          <div>{{ row.preEndTime | parseTime }}</div>
          <div></div>
        </template>
      </el-table-column>
      <el-table-column label="正式时间" min-width="165">
        <template slot-scope="{ row }">
          <div>{{ row.formalStartTime | parseTime }}</div>
          <div>{{ row.formalEndTime | parseTime }}</div>
          <div></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="100" fixed="right">
        <template slot-scope="{ row }">
          <el-button @click="showUpdate(row)" type="text">编辑</el-button>
          <el-button @click="remove(row)" type="text">删除</el-button>
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
    <!-- 弹窗 -->
    <el-dialog
      :append-to-body="true"
      :visible="visible"
      ref="dialog"
      :title="title"
      width="800px"
      :before-close="closeModal"
      :close-on-click-modal="false"
    >
      <el-form ref="form" :model="formData" label-width="140px" :rules="rules">
        <el-form-item label="活动级别" prop="activityLevel">
          <el-select placeholder="请选择活动级别" v-model="formData.activityLevel">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in levels"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="formData.activityName" />
        </el-form-item>
        <el-form-item label="活动时间" prop="activityTime">
          <el-row>
            <el-col :span="2">
              <el-checkbox v-model="modal.isWarmUp" />
            </el-col>
            <el-col :span="4" :class="modal.isWarmUp? 's-require' : ''">预热</el-col>
            <el-col :span="14">
              <CoreDatePicker
                v-model="formData.activityWarmUpTime"
                :defaultErrorStyle="modal.isWarmUp"
                :bind="Object.assign({
                  disabled: !modal.isWarmUp
                }, dateBind) "
              />
            </el-col>
          </el-row>
          <el-row class="s-br">
            <el-col :span="4" :offset="2" class="s-require">正式</el-col>
            <el-col :span="14">
              <CoreDatePicker v-model="formData.activityFormalTime" :bind="dateBind" />
            </el-col>
            <el-col
              :span="18"
              class="s-gray"
              :offset="2"
            >注意：更改预热/正式时间需要重新部署页面方能生效；当不在此时间段，页面将重定向到404；
            </el-col>
          </el-row>
        </el-form-item>
        <!-- <el-form-item label="活动管理员" prop="activityManager">
        </el-form-item>-->
      </el-form>
      <div slot="footer">
        <el-button @click="closeModal">取 消</el-button>
        <el-button @click="submitModal" type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
  import { createActivity, updateActivity, requestActivityList, removeActivity } from '@/api/activity'
  import { parseTime } from '@/utils'
  import axios from 'axios'

  export default {
    computed: {
      title() {
        return this.isEdit ? '编辑活动' : '创建活动'
      },
    },
    data() {
      const validateActivityTime = (rule, value, callback) => {
        const { isWarmUp } = this.modal
        const { activityWarmUpTime, activityFormalTime } = this.formData
        if (!activityFormalTime || !activityFormalTime.length) {
          callback(new Error('请选择正式时间'))
        }
        if (isWarmUp) {
          if (!activityWarmUpTime || !activityWarmUpTime.length) {
            callback(new Error('请选择预热时间'))
          } else if (activityWarmUpTime[1] > activityFormalTime[0]) {
            callback(new Error('预热时间需早于正式时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      return {
        height: null,
        currentPage: 1,
        pageSize: 20,
        total: 0,
        list: [
          // {
          //   id: '000001',
          //   activityName: '双十一大促',
          //   activityLevel: 'A级',
          //   activityManager: 'Admin',
          //   preStartTime: +new Date(),
          //   preEndTime: +new Date() + 72 * 3600 * 1000,
          //   formalStartTime: +new Date() + 72 * 3600 * 1000,
          //   formalEndTime: +new Date() + 144 * 3600 * 1000
          // }
        ],
        searchForm: {
          activityName: '',
          activityIds: '',
          activityFounder: '',
        },
        searchRules: {},
        isMyActivity: false,

        // dialog model
        dateBind: {
          type: 'datetimerange',
        },
        modal: {
          isWarmUp: false,
        },
        levels: [
          { label: 'A级', value: 'A' },
          { label: 'B级', value: 'B' },
          { label: 'C级', value: 'C' },
          { label: 'S级', value: 'S' },
        ],
        formData: {
          id: null,
          activityLevel: '',
          activityName: '',
          activityWarmUpTime: [],
          activityFormalTime: [],
        },
        visible: false,
        isEdit: false,
        rules: {
          activityLevel: [
            { required: true, message: '请选择活动级别', trigger: 'blur change' },
          ],
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur change' },
          ],
          activityTime: [
            { required: true, validator: validateActivityTime, trigger: 'blur change' },
          ],
        },
      }
    },
    async created() {
      await this.getList()
      this._initTableHieght()
      window.axios = axios
      window.GLOBAL_VM.ACTIVITY_PAGE = this
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
      goActivityPages({ id }) {
        this.$router.push({
          path: '/page',
          query: {
            activityId: id,
          },
        })
      },
      keyWordsStr(str) {
        const keyWordsArr = str.split(',')
        const keyWords = keyWordsArr.join(', ')
        return `活动ID（${keyWordsArr.length}）：${keyWords}`
      },
      cleanSearch() {
        Object.assign(this.searchForm, {
          activityName: '',
          activityIds: '',
          activityFounder: '',
        })
        this.getList()
      },
      currentPageChange(current) {
        this.currentPage = current
        this.getList()
      },
      searchList() {
        this.currentPage = 1
        this.getList()
      },
      getList(delay) {
        const loading = this.$loading()
        const params = {
          activityName: this.searchForm.activityName,
          activityIds: this.searchForm.activityIds,
          offset: (this.currentPage - 1) * this.pageSize,
          limit: this.pageSize,
        }
        return requestActivityList(params).then(res => {
          this.list = res.msg.list
          this.total = res.msg.total
          return res
        }).catch(_ => {
        }).then(_ => {
          setTimeout(_ => {
            loading.close()
          }, delay)
        })
      },
      showCreate() {
        this.isEdit = false
        this.visible = true
      },
      showUpdate(row) {
        Object.assign(this.formData, {
          id: row.id,
          activityLevel: row.activityLevel,
          activityName: row.activityName,
          activityWarmUpTime: row.preStartTime && row.preEndTime ? [row.preStartTime, row.preEndTime] : [],
          activityFormalTime: [row.formalStartTime, row.formalEndTime],
        })
        this.modal.isWarmUp = !!row.preStartTime
        this.isEdit = true
        this.visible = true
      },
      remove(row) {
        const id = row.id
        this.$confirm(`确认删除吗?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          removeActivity({ id }).then(res => {
            this.getList()
          })
        }).catch(() => {
        })
      },
      closeModal() {
        this.visible = false
        Object.assign(this.formData, {
          id: null,
          activityLevel: '',
          activityName: '',
          activityWarmUpTime: [],
          activityFormalTime: [],
        })
        this.modal.isWarmUp = false
      },
      submitModal() {
        this.$refs.form.validate((valid) => {
          if (!valid) return
          const data = this.formData
          const params = {
            activityName: data.activityName,
            activityLevel: data.activityLevel,
            formalStartTime: data.activityFormalTime[0],
            formalEndTime: data.activityFormalTime[1],
          }
          this.isEdit && (params.id = data.id)
          if (!this.modal.isWarmUp) {
            Object.assign(params, {
              preStartTime: null,
              preEndTime: null,
            })
          } else if (data.activityWarmUpTime && data.activityWarmUpTime.length) {
            Object.assign(params, {
              preStartTime: data.activityWarmUpTime[0],
              preEndTime: data.activityWarmUpTime[1],
            })
          }
          const func = this.isEdit ? updateActivity : createActivity
          func(params).then(res => {
            this.getList()
            this.closeModal()
          })
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .m-activity {
    padding: 0 10px;
  }
</style>