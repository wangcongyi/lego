<template>
  <el-dialog
    :visible="visible"
    :close-on-click-modal="false"
    title="链接工具"
    width="50%"
    append-to-body
    @close="$emit('close')"
  >
    <el-tabs v-model="tabIndex" @tab-click="tabClick">
      <el-tab-pane label="自定义链接" name="custom">
        <div class="m-content">
          <el-input v-model.trim="customLink" placeholder="h5链接" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="热区链接" name="link">
        <div class="m-content">
          <!-- 渲染链接列表 -->
          <el-select v-model="selectIndex" placeholder="请选择" @change="linkChange">
            <el-option
              v-for="item in selectItems"
              :key="item.value"
              :label="item.text"
              :value="item.value"
            />
          </el-select>
          <template v-if="selectId === 'custom'">
            <el-input v-model.trim="wxLink" placeholder="小程序地址" class="s-br" />
            <el-input v-model.trim="appLink" placeholder="app地址" class="s-br" />
            <el-input v-model.trim="h5Link" placeholder="h5地址" class="s-br" />
          </template>
          <template v-else-if="paramList.length">
            <!-- 渲染链接参数 -->
            <template v-for="(item, index) in paramList">
              <el-input
                v-if="!item.list"
                :key="index"
                v-model.trim="paramProps[item.h5Prop]"
                :placeholder="item.label"
                class="s-br"
              />
              <el-select
                v-else
                :key="index"
                v-model="paramProps[item.h5Prop]"
                :placeholder="item.label"
                class="s-br"
              >
                <el-option
                  v-for="item in item.list"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </template>
            <!-- 通用参数 ↓ -->
            <el-input
              v-model.trim="smartValue"
              type="textarea"
              placeholder="「智能填写」粘贴完整链接，如 https://m.weilaijishi.cn/#/videos?videoId=5d91c1f1143c8b00017abc28&viewMode=2&authorId=18005183"
              class="s-br smart-textarea"
            />
            <!-- <span slot="label" class="smart-textarea-title">「智能填写」</span> -->
            <div class="smart-footer s-br">
              <div class="smart-footer-inner">
                <el-button size="small" @click="smartValue = ''">清空</el-button>
                <el-button size="small" type="primary" @click="smartHandle">智能填写</el-button>
              </div>
            </div>
          </template>
          <el-input
            v-if="selectIndex"
            v-model.trim="parameter"
            :placeholder="`${selectId === 'custom' ? '跳转' : '选填，更多'}参数，格式key=value&key=value，例：name=张三&id=1`"
            class="s-br"
          />
          <el-input
            v-if="selectId === 'live'"
            v-model.trim="notLiveLink"
            placeholder="未开播跳转链接"
            class="s-br"
          />
        </div>
      </el-tab-pane>
      <el-tab-pane label="领券" name="coupon">
        <div class="m-content">
          <el-input v-model.trim="couponId" placeholder="优惠券配置ID" />
        </div>
      </el-tab-pane>
      <el-input v-model.trim="imageSource" placeholder="热区图片" class="s-br" v-if="imageSwitch"/>
      <el-input v-model.trim="name" placeholder="热区名字（埋点用，请自行区分名字）" class="s-br" />
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { LINK_CONFIG } from '@/config'
import qs from 'qs'
export default {
  props: {
    imageSwitch: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectItems () {
      return this.linkConfig.map((item, index) => {
        return { value: `${index}`, text: item.label }
      })
    },
    selectConfig () {
      return this.linkConfig[this.selectIndex]
    },
    selectId () {
      return this.selectConfig && this.selectConfig.id
    }
  },
  data () {
    const linkConfig = [{
      id: 'custom',
      label: '自定义'
    }, ...LINK_CONFIG]
    return {
      linkConfig,
      visible: true,
      smartValue: '',
      selectIndex: '',
      paramList: [],
      paramProps: {},
      parameter: '',
      couponId: '',
      initiationID: '',
      customLink: '',
      wxLink: '',
      appLink: '',
      h5Link: '',
      tabIndex: 'custom',
      memberId: null,
      notLiveLink: null,
      name: '', // 热区埋点
      imageSource: '' // 热区图片
    }
  },
  methods: {
    smartHandle () {
      const search = this.smartValue.split('?')
      const params = qs.parse(search[search.length - 1].trim())
      const paramProps = this.paramList.map(item => item.h5Prop)
      const paramsKeys = Object.keys(params)
      paramsKeys.forEach(key => {
        if (paramProps.includes(key)) {
          this.$set(this.paramProps, key, params[key])
          delete params[key]
        }
      })
      if (Object.keys(params).length)
        this.parameter = qs.stringify(params)
    },
    linkChange () {
      this.paramList = this.linkConfig[this.selectIndex].params
      this.paramProps = {}
    },
    tabClick (tab, event) {
      this.tabIndex = tab.name
    },
    checkError (list = []) {
      let flag = false
      try {
        list.forEach(item => {
          if (item[0]) throw new Error(item[1])
        })
      } catch ({ message }) {
        this.$message.error(message)
        flag = true
      }
      return flag
    },
    checkErrorNotImage (list = []) {
      if (this.imageSource) return false
      return this.checkError(list)
    },
    confirm () {
      const { tabIndex, name, imageSource } = this
      let result = {}
      if (tabIndex === 'custom') {
        if (this.checkErrorNotImage([
          [!this.customLink, '请输入链接地址']
        ])) return
        result = {
          wxLink: this.customLink,
          appLink: this.customLink,
          h5Link: this.customLink
        }
      } else if (tabIndex === 'link') {
        if (this.checkError([
          [!this.selectIndex, '请选择热区链接'],
          [this.parameter && !/([^?&=]+)=([^=&]*)/g.test(this.parameter), '参数格式不正确']
        ])) return
        const selectId = this.selectId
        if (selectId === 'custom') {
          if (this.checkError([
            [!this.wxLink && !this.appLink && !this.h5Link, '请输入链接地址'],
            [!this.parameter, '请输入跳转参数'],
            [!this.name, '请输入埋点名字']
          ])) return
          result = {
            wxLink: this.wxLink,
            appLink: this.appLink,
            h5Link: this.h5Link,
            parameter: this.parameter
          }
        } else {
          const checkArg = this.paramList.map(item => {
            return [item.required ? !this.paramProps[item.h5Prop] : false, `请${item.list ? '选择' : '输入'}${item.label}`]
          })
          if (this.checkError([
            ...checkArg,
            [!this.name, '请输入埋点名字']
          ])) return
          result = {
            id: selectId,
            wxLink: this.selectConfig.wxLink,
            appLink: this.selectConfig.appLink,
            h5Link: this.selectConfig.h5Link,
            notLiveLink: this.notLiveLink,
            parameter: qs.stringify({
              ...this.paramProps,
              ...qs.parse(this.parameter)
            })
          }
        }
      } else if (tabIndex === 'coupon') {
        if (this.checkError([
          [!this.couponId, '请输入优惠券ID'],
          [!this.name, '请输入埋点名字']
        ])) return
        result = {
          couponId: this.couponId,
          initiationID: this.initiationID
        }
      }
      if (imageSource) {
        if (this.checkError([
          [!/^(http(s)?|\/\/).*/.test(imageSource), '请输入正确的图片地址']
        ])) return
      }
      Object.assign(result, {
        type: tabIndex,
        desc: name,
        imageSource
      })
      this.$emit('confirm', result)
    },
  }
}
</script>

<style lang="scss" scoped>
</style>