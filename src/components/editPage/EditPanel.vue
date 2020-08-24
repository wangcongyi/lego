<template>
  <div class="m-component-tree">
    <AreaPicker
      v-if="areasConfigVisible"
      :data="editModel"
      :moduleName="editName"
      @close="areasConfigVisible = false"
    />
    <BarrageConfigModal
      v-if="barrageConfigVisible"
      @close="barrageConfigVisible = false"
      @confirm="barrageConfigConfirm"
    />
    <el-collapse v-model="activeNames">
      <el-collapse-item title="模块列表" name="list">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :allowDrag="allowDrag"
          :allow-drop="handleDrop"
          highlight-current
          draggable
          accordion
          @node-click="handleNodeClick"
          :expand-on-click-node="false"
        >
          <span
            class="custom-tree-node"
            slot-scope="{ node, data }"
            @mouseout="removeModal(data.mid)"
            @mouseover="addModal(data.mid)"
          >
            <span>{{ `#${node.id} ` }}</span>
            <input
              :ref="`rename-${data.mid}`"
              v-if="data.isRename"
              type="text"
              v-model="data.name"
              @keydown.enter="rename(node, data)"
            />
            <span v-else>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click.stop="rename(node, data)"
              >{{ data.renameBtnText || '重命名' }}</el-button>
              <el-button
                type="text"
                size="mini"
                @click.stop="showItem(data)"
              >{{data.show?'隐藏':'显示'}}</el-button>
              <el-button type="text" size="mini" @click.stop="deleteItem(data, node)">Delete</el-button>
              <el-button type="text" size="mini" @click.stop="copyMid(data)">复制组件id</el-button>
              <el-button type="text" size="mini" @click.stop="copyItem(data)">复制组件</el-button>
            </span>
          </span>
        </el-tree>
      </el-collapse-item>
      <el-collapse-item title="模块配置参数" name="config" style="margin-top: 10px;">
        <el-form ref="form" label-width="120px">
          <p v-if="editList.length === 0" style="text-align: center; margin-top: 10px;">当前无编辑模块</p>
          <!-- 会场悬浮导航 - 编辑 -->
          <FloatingNavListEdit
            v-if="editType === 'FloatingNavList'"
            :key="editId"
            :edit-list="editList"
            :edit-model="editModel"
          />
          <template v-else v-for="editItem in editList">
            <template v-if="!editItem.hidden">
              <template v-if="editItem.hiddenInNull">
                <el-form-item
                  v-if="editModel[editItem.key]"
                  :label="editItem.title"
                  :key="editItem.key"
                >
                  <el-input
                    v-model="editModel[editItem.key]"
                    :disabled="editItem.disableInEdit"
                    clearable
                  />
                </el-form-item>
              </template>
              <el-form-item v-else :label="editItem.title" :key="editItem.key">
                <el-radio-group
                  v-if="editItem.options"
                  v-model="editModel[editItem.key]"
                  :disabled="computedDisabled(editItem)"
                >
                  <el-radio
                    v-for="(item, index) in editItem.options"
                    :key="index"
                    :label="item.value"
                  >{{item.title}}
                  </el-radio>
                </el-radio-group>
                <el-checkbox
                  v-else-if="editItem.checkBox"
                  v-model="editModel[editItem.key]"
                  :disabled="computedDisabled(editItem)"
                />
                <el-input
                  v-else-if="editItem.textarea"
                  v-model="editModel[editItem.key]"
                  class="textarea"
                  type="textarea"
                  rows="6"
                  :disabled="computedDisabled(editItem)"
                />
                <el-input-number
                  v-else-if="editItem.inputNumber"
                  v-bind="typeof editItem.inputNumber === 'object' ? editItem.inputNumber : {}"
                  v-model="editModel[editItem.key]"
                  class="input-number"
                  size="mini"
                  :disabled="computedDisabled(editItem)"
                />
                <el-collapse v-else-if="editItem.collapse">
                  <el-collapse-item
                    v-for="(item) in editItem.collapse"
                    :key="item.key"
                    :title="item.title"
                  >
                    <el-form label-width="120px">
                      <template v-for="({ key, title }) in item.children">
                        <el-form-item :label="title" :key="key" style="margin-top: 10px;">
                          <el-input
                            type="input"
                            v-model="editModel[editItem.key][item.key][key]"
                            clearable
                          />
                        </el-form-item>
                      </template>
                    </el-form>
                  </el-collapse-item>
                </el-collapse>
                <!-- 单独超级板子 -->
                <SuperPopover
                  v-else-if="editItem.onlySuper"
                  :editModel="editModel"
                  :editItem="editItem"
                />
                <!-- 超级板子 -->
                <el-input
                  v-else-if="editItem.super"
                  v-model="editModel[editItem.key].value"
                  :disabled="computedDisabled(editItem)"
                >
                  <!-- 魔法板子Popover -->
                  <SuperPopover slot="suffix" :editModel="editModel" :editItem="editItem" />
                </el-input>
                <!-- 气泡 + 链接 -->
                <template v-else-if="editItem.tagLink">
                  <el-tag
                    v-for="(tag, tagIndex) in editModel[editItem.key]"
                    :key="tagIndex"
                    :disable-transitions="false"
                    closable
                    @close="handleCloseTag(editModel[editItem.key], tagIndex)"
                    class="m-tag"
                  >{{tag.title}}
                  </el-tag>
                  <el-button
                    size="small"
                    @click="showBarrageConfig(editModel[editItem.key])"
                    :disabled="computedDisabled(editItem)"
                  >+ 新消息
                  </el-button>
                </template>
                <template v-else-if="editItem.linkTool">
                  <LinkToolItem
                    :link="editModel[editItem.key]"
                    @remove="editModel[editItem.key] = null"
                    @confirm="(result) => {editModel[editItem.key] = result}"
                  />
                </template>
                <el-input
                  v-else
                  v-model="editModel[editItem.key]"
                  clearable
                  :placeholder="getPlaceholder(editItem.key)"
                  :disabled="computedDisabled(editItem)"
                />
              </el-form-item>
            </template>
          </template>
          <!-- 图片热区 - 等分区域 -->
          <FencesEdit
            v-if="editType === 'ImageView'"
            :key="editId"
            :edit-list="editList"
            :edit-model="editModel"
          />
          <!-- 编辑按钮 -->
          <div class="btnWrap">
            <el-button
              type="primary"
              @click="areasConfigVisible = true"
              v-if="editType === 'ImageView'"
            >设置热区
            </el-button>
            <el-button
              v-if="editType === 'ProductView'"
              type="primary"
              :disabled="!!editModel.recommendId"
              @click="addProductItem(editModel)"
            >添加商品
            </el-button>
            <el-button
              v-if="editType === 'FloatingNavView'"
              type="primary"
              @click="addFloatingNavList()"
            >添加会场列表
            </el-button>
            <el-button
              v-if="editType === 'BottomNavView'"
              type="primary"
              :disabled="!!editModel.recommendId"
              @click="addBottomNavItem()"
            >添加底部导航
            </el-button>
            <el-button
              v-if="editType === 'StickyNavView'"
              type="primary"
              @click="addStickyNavItem()"
            >添加吸顶导航
            </el-button>
            <el-button
              v-if="editType === 'CouponView'"
              type="primary"
              :disabled="!!editModel.recommendId"
              @click="addStaticCoupon()"
            >添加静态卡券
            </el-button>
            <template v-if="isDynamicModule">
              <el-button type="primary" @click="relyRecommend()">关联资源位</el-button>
              <el-button
                type="primary"
                @click="deleteRecommend()"
                v-if="editModel.recommendId"
              >清除资源位
              </el-button>
              <el-button
                type="primary"
                @click="refresh(editModel)"
                v-if="editModel.recommendId"
              >刷新预览
              </el-button>
            </template>

            <el-upload
              v-if="editType === 'ImageView'"
              class="uploadImage"
              drag
              action="/lego"
              :http-request="uploadImage"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                热区图片：将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">请上传小于2M的文件</div>
            </el-upload>
          </div>
        </el-form>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
  import AreaPicker from './AreaPicker'
  import SuperPopover from './SuperPopover'
  import BarrageConfigModal from './BarrageConfigModal'
  import FloatingNavListEdit from './FloatingNavListEdit'
  import FencesEdit from './FencesEdit'
  import LinkToolItem from './LinkToolItem'
  import ProductItemConfig from '@/modules/ProductItem.js'
  import FloatingNavListConfig from '@/modules/FloatingNavList.js'
  import BottomNavItemConfig from '@/modules/BottomNavItem.js'
  import StickyNavItemConfig from '@/modules/StickyNavItem.js'
  import CouponItemConfig from '@/modules/CouponItem.js'
  import { handleModelProps } from '@/modules/utils'
  import { guid, copy, parseTime, isContains } from '@/utils'
  import eventBus from '@/utils/eventBus'
  import cloneDeep from 'lodash/cloneDeep'
  import get from 'lodash/get'
  import { upload } from '@/api/upload'
  import recommendMixins from '@/mixins/recommend'

  // 视窗滚动到选定id容器
  function scrollIntoViewIfNeeded(id) {
    setTimeout(() => {
      var node = document.getElementById(id)
      node && node.scrollIntoViewIfNeeded()
    }, 0)
  }

  const PLACEHOLDER_MAP = {
    anchor: '模块的id，点击复制获取',
    barrages: '以中文逗号，分隔',
  }

  const DYNAMIC_MODULES = [
    'ProductView',
    'SpikeView',
    'SpikeFightView',
    'ShopView',
    'BrandView',
    'CouponView',
    'VideoExtraLarge',
    'VideoLarge',
    'ImageView',
    'BottomNavView',
    'CardProductView',
    'CardBrandView',
    'CardShopView',
    'LiveView',
    'LiveList',
    'LiveListItem'
  ]

  export default {
    mixins: [recommendMixins],
    components: {
      AreaPicker,
      FloatingNavListEdit,
      FencesEdit,
      BarrageConfigModal,
      SuperPopover,
      LinkToolItem,
    },
    created() {
      var pid = this.$route.query.pid || 1
      this.pid = parseInt(pid, 10)
      if (pid == 1) {
        eventBus.$on('addCoupon', this.addCouponItem)
      }
    },
    computed: {
      model() {
        return this.$store.state.tModel || []
      },
      pageModel() {
        return this.$store.state.editPage
      },
      treeData() {
        var model = this.$store.state.tModel || []
        for (let index = 0; index < model.length; index++) {
          var element = model[index]
          this.$set(element, 'children', element.model.childList || [])
        }
        return model
      },
      isDynamicModule() {
        return DYNAMIC_MODULES.includes(this.editType)
      },
    },
    watch: {
      editType(editType) {
        this._initGrassSourceSelect()
      },
    },
    data() {
      return {
        pid: 1,
        editTarget: null,
        editId: null,
        editType: null,
        editModel: {},
        editName: '',
        editList: [], // 当前选中组件的属性列表
        editConfig: {},
        areasConfigVisible: false,
        barrageConfigVisible: false,
        currentBarrage: null,
        componentList: [],
        btnName: '批量上传',
        uploading: false,
        selectProduct: {},
        defaultProps: {
          children: 'children',
          mid: 'mid',
          label: 'name',
        },
        activeNames: ['list'],
        parentNode: null,
      }
    },
    mounted() {
      window.GLOBAL_VM.EDIT_PANEL = this
    },
    methods: {
      async relyRecommend(recommendId) {
        try {
          const editType = this.editType
          const value = recommendId || await this.getRecommendId()
          const { list, context: { currentTime } } = await this.getDynamicRecommend(value, editType)
          this.editModel.recommendId = value
          const needHandleModel = [
            'ProductView',
            'LiveList',
            'BottomNavView',
            'CardProductView',
          ]
          const needReplaceProps = [
            'VideoExtraLarge',
            'VideoLarge',
          ]
          const needHandleSuper = [
            'CardBrandView',
            'CardProductView',
            'CardShopView',
          ]

          if (isContains(needHandleModel, editType)) {
            this.editModel.dynamicChildList = await this.handleDynamicList(list)
          } else if (editType === 'CouponView') {
            this.editModel.dynamicChildList = await this.handleDynamicCouponList(list)
          } else if (isContains(needReplaceProps, editType)) {
            const target = list[0]
            Object.keys(this.editModel).forEach(key => {
              handleModelProps(this.editModel, target[key])
            })
            this.editModel.dynamicChildList = list
            this.editModel.currentTime = currentTime
          } else if (editType === 'ImageView') {
            const target = list[0]
            const { effectiveStartTime = '', effectiveEndTime = '', link = '', url = '' } = target
            if (!effectiveStartTime && !url) {
              this.$message.error('资源位数据异常')
              return
            }
            if (effectiveStartTime && effectiveEndTime) {
              this.editModel.effectiveDate = `${parseTime(effectiveStartTime)} - ${parseTime(effectiveEndTime)}`
            }
            this.editModel.url = url
            this.editModel.link = link
          } else {
            this.editModel.dynamicChildList = list
            this.editModel.currentTime = currentTime
          }
          this.editModel.childList = []
        } catch (error) {
          this.$message.error(error || '数据异常')
        }
      },
      refresh(editModel) {
        editModel.recommendId && this.relyRecommend(editModel.recommendId)
      },
      deleteRecommend() {
        if (this.editModel.recommendId) {
          this.editModel.recommendId = null
          this.editModel.dynamicChildList = []
        }
      },
      getRecommendIds() {
        return this.$prompt('请输入资源位Id', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^(\d+\,\d*|\d*)+\d+$/,
          inputPlaceholder: '多个资源位ID，使用英文逗号“,”进行分割',
          inputErrorMessage: '格式不正确',
        }).then(({ value }) => {
          return value
        })
      },
      getRecommendId() {
        return this.$prompt('请输入资源位Id', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^\d+$/,
          inputErrorMessage: '格式不正确',
        }).then(({ value }) => {
          return value
        })
      },
      allowDrag(draggingNode) {
        return true
      },
      handleDrop(draggingNode, dropNode, type) {
        if ((type === 'prev' || type === 'next') && draggingNode.parent === dropNode.parent) {
          return true
        }
        return false
      },
      addFloatingNavList() {
        this.editModel.childList.push({
          name: '会场列表',
          id: 'FloatingNavList',
          mid: guid(),
          show: true,
          model: {
            styleType: '1',
            childList: [],
          },
          config: FloatingNavListConfig,
        })
      },
      addBottomNavItem() {
        this.editModel.childList.push({
          name: '底部导航',
          id: 'BottomNavItem',
          mid: guid(),
          show: true,
          model: {
            name: '主会场',
            url: '',
            selectIcon: 'http://iph.href.lu/50x50',
            icon: 'http://iph.href.lu/50x50',
            selectColor: '',
            color: '',
          },
          config: BottomNavItemConfig,
        })
      },
      addStickyNavItem() {
        this.editModel.childList.push({
          name: '吸顶导航',
          id: 'StickyNavItem',
          mid: guid(),
          show: true,
          model: {
            title: '导航',
            icon: '',
            anchor: '',
            showIcon: false,
          },
          config: StickyNavItemConfig,
        })
      },
      addCouponItem(item) {
        this.editModel.childList.push({
          name: '卡券',
          id: 'CouponItem',
          mid: guid(),
          show: true,
          model: {
            selfStyle: CouponItemConfig.selfStyle.default(),
            recommendId: 123,
            ...item,
          },
          config: CouponItemConfig,
        })
      },
      addStaticCoupon() {
        this.editModel.childList.push({
          name: '卡券',
          id: 'CouponItem',
          mid: guid(),
          show: true,
          model: {
            status: 'valid',
            selfStyle: CouponItemConfig.selfStyle.default(),
            couponValue: '0',
            // couponType: '1',
            limit: '满100元可用',
            area: '限部分商品使用',
            shopImg: '',
            shopLogo: '',
            shopName: '',
            couponId: '',
            productUrl: '',
            shopId: '',
            jumpLink: '',
            couponUseRemarkType: '',
          },
          config: CouponItemConfig,
        })
      },
      handleNodeClick(data, path) {
        this.parentNode = path.parent
        this.edit(data)
        var set = new Set(this.activeNames)
        if (!set.has('config')) {
          this.activeNames.push('config')
        }
      },
      showItem(data) {
        this.findItem(data, (i, items) => {
          if (items[i].show === undefined) {
            this.$set(items[i], 'show', false)
          } else {
            this.$set(items[i], 'show', !items[i].show)
          }
        })
      },
      findItem(data, callback) {
        var mid = data.mid
        var findItem = false
        for (let index = 0; index < this.model.length; index++) {
          const element = this.model[index]
          if (element.mid === mid) {
            callback(index, this.model)
            break
          } else if (element.model.childList) {
            var items = element.model.childList
            for (let i = 0; i < items.length; i++) {
              const item = items[i]
              if (item.mid === mid) {
                findItem = true
                callback(i, items)
                break
              }
            }
          }
          if (findItem) {
            break
          }
        }
      },
      rename(node, data) {
        this.findItem(data, (i, items) => {
          if (items[i].isRename === undefined) {
            this.$set(items[i], 'isRename', true)
          } else {
            this.$set(items[i], 'isRename', !items[i].isRename)
          }
          this.$set(items[i], 'renameBtnText', items[i].isRename ? '确定' : '')
          this.$nextTick(() => {
            this.$refs[`rename-${data.mid}`] && this.$refs[`rename-${data.mid}`].focus()
          })
        })
      },
      copyMid(data) {
        copy(data.mid)
      },
      deleteItem(data, node) {
        this.findItem(data, (i, items) => {
          this.splItem(i, items)
        })
        const parentId = this.parentNode && this.parentNode.id
        if (data.mid === this.editId || parentId === node.id) {
          this.editId = ''
          this.editModel = {}
          this.editList = []
          this.editType = ''
        }
      },
      copyItem(data) {
        const newItem = cloneDeep(data)
        Object.assign(newItem, {
          mid: guid(),
        })
        newItem.model.childList && newItem.model.childList.forEach(item => {
          item.mid = guid()
        })
        this.findItem(data, (i, items) => {
          this.splItem(i, items, newItem)
        })
      },
      splItem(index, arr, newItem) {
        var list = arr || this.model
        !newItem && list.splice(index, 1)
        newItem && list.splice(index + 1, 0, newItem)
      },
      _initGrassSourceSelect() {
        if (this.editType === 'GrassView') {
          for (let i = 0, len = this.editList.length; i < len; i++) {
            const editItem = this.editList[i]
            if (editItem.key === 'type') {
              this.grassSourcType = this.editModel[editItem.key]
              this.editList.find(item => item.key === 'direction').hidden = this.grassSourcType === 1
              break
            }
          }
        }
      },
      addProductItem(editModel) {
        if (editModel) {
          let list = editModel.childList
          list.push({
            name: '商品标题',
            id: 'ProductItem',
            mid: guid(),
            show: true,
            model: {
              h5Url: '',
              price: '0.00',
              salePricePrefix: '',
              marketPrice: '0.00',
              prefixIcon: '',
              subtitleColor: '',
              subtitleFontSize: '',
              titleColor: '',
              titleFontSize: '',
              name: '商品标题',
              subTitle: '这里最多八个字符',
              masterImg: '商品图',
              corner: '',
              btnText: '',
              tips: '',
              tipsSize: '',
              tipsColor: '',
              commission: '',
              discountIcon: '',
              prefixIconSize: '',
            },
            config: ProductItemConfig,
          })
        }
      },

      edit(obj) {
        const config = obj.config
        this.editTarget = obj
        this.editModel = obj.model
        this.editId = obj.mid || obj.id
        this.editConfig = obj.config
        this.editName = obj.name
        const arr = []
        for (const key in obj.model) {
          if (config[key] && !config[key].hiddenInEdit) {
            arr.push(Object.assign({
              key: key,
            }, config[key]))
          }
        }
        this.editList = arr
        this.editType = obj.id // 监听，依赖editList
        scrollIntoViewIfNeeded(this.editId)
        this._initGrassSourceSelect()
      },
      addModal(id) {
        setTimeout(() => {
          const el = document.getElementById(id)
          if (!el) return
          var modal = el.getElementsByClassName('dev-modal')[0]
          if (modal) {
            return
          }
          var modal = document.createElement('div')
          modal.className = 'dev-modal'
          modal.style.position = 'absolute'
          modal.style.backgroundColor = 'rgba(137, 191, 245, .6)'
          modal.style.width = '100%'
          modal.style.height = '100%'
          modal.style.top = 0
          modal.style.left = 0
          if (el.style.position && el.style.position === 'static' || getComputedStyle(el).position === 'static') el.style.position = 'relative'
          el.appendChild(modal)
        }, 10)
      },
      /**
       * 移除编辑指示蒙层
       */
      removeModal(id) {
        setTimeout(() => {
          const el = document.getElementById(id)
          if (!el) return
          var modal = el.getElementsByClassName('dev-modal')[0]
          modal && el.removeChild(modal)
        }, 10)
      },
      uploadImage(e) {
        const file = e.file
        if (!file) {
          return
        }
        upload(file).then(res => {
          this.editModel.url = res
          e.onSuccess(res)
        }).catch(e => {
          e.onError(e)
          this.$message.error(e)
        })
      },
      checkUploadDone() {
        this.uploadCount--
        if (this.uploadCount === 0) {
          this.uploading = false
        }
      },
      computedDisabled(editItem) {
        const { disableInEdit, disableCondition } = editItem
        if (disableInEdit) {
          return disableInEdit
        }
        let res = false
        if (Array.isArray(disableCondition)) {
          disableCondition.map(c => {
            if (typeof c.value === 'boolean') {
              res = res || !!get(this, c.path)
            } else {
              res = res || (get(this, c.path) === c.value)
            }
          })
        }
        return res
      },
      getPlaceholder(key) {
        return key && PLACEHOLDER_MAP[key] ? PLACEHOLDER_MAP[key] : ''
      },
      handleCloseTag(target, index) {
        target.splice(index, 1)
      },
      showBarrageConfig(target) {
        this.barrageConfigVisible = true
        this.currentBarrage = target
      },
      barrageConfigConfirm(item) {
        this.currentBarrage.push(item)
        this.barrageConfigVisible = false
      },
    },
  }
</script>

<style lang="scss" scoped>
  .uploadImage {
    margin-top: 10px;
  }

  .m-tag {
    height: auto;
    white-space: normal;
    margin-right: 10px;
  }
</style>
