<template>
  <div class="edit-floating-nav">
    <!-- 同类型级别配置 -->
    <template v-for="editItem in editList">
      <el-form-item :label="editItem.title" :key="editItem.key">
        <el-radio-group
          v-if="editItem.options"
          v-model="editModel[editItem.key]"
          :disabled="editItem.disableInEdit"
        >
          <el-radio
            v-for="(item, index) in editItem.options"
            :key="'radio-' + index"
            :label="item.value"
          >{{item.title}}</el-radio>
        </el-radio-group>
      </el-form-item>
    </template>
    <!-- 会场级别配置 -->
    <el-tabs
      v-if="editModel.childList.length > 0"
      v-model="editableTabsValue"
      type="card"
      class="meeting-tabs"
      closable
      @tab-remove="removeMeeting"
    >
      <el-tab-pane
        v-for="({ mid, model, config }, idx) in editModel.childList"
        :key="mid"
        :label="model.name"
        :name="mid"
      >
        <el-form-item
          v-for="(item, key) in config"
          :key="'form-' + key"
          :label="item.title"
        >
          <el-checkbox v-if="item.checkBox" v-model="editModel.childList[idx].model[key]" />
          <el-input
            v-else
            type="input"
            v-model="editModel.childList[idx].model[key]"
          />
        </el-form-item>
      </el-tab-pane>
    </el-tabs>
    <!-- 添加会场按钮 -->
    <div class="btns">
      <el-button
        type="primary"
        @click="addMeeting()"
      >添加会场</el-button>
    </div>
  </div>
</template>

<script>
import get from 'lodash/get'
import { guid } from '@/utils'
import FloatingNavItemConfig from '@/modules/FloatingNavItem.js'

export default {
  name: 'FloatingNavEdit',
  props: {
    editModel: {
      type: Object,
      required: true
    },
    editList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      editableTabsValue: get(this.editModel, 'childList.0.mid')
    }
  },
  methods: {
    addMeeting () {
      const mid = guid()
      this.editModel.childList.push({
        name: '会场导航',
        id: 'FloatingNavItem',
        mid,
        model: {
          name: '会场名称',
          point: '会场利益点',
          logo: '',
          url: '',
          active: false
        },
        config: FloatingNavItemConfig
      })
      this.editableTabsValue = mid;
    },
    removeMeeting (targetName) {
      let tabs = this.editModel.childList;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.mid === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.mid;
            }
          }
        });
      }

      this.editableTabsValue = activeName;
      this.editModel.childList = tabs.filter(tab => tab.mid !== targetName);
    },
  }
}
</script>

<style lang="scss" scoped>
  .meeting-tabs {
    padding: 0 18px;
  }
  .btns {
    text-align: center;
  }
</style>
<style lang="scss">
  .meeting-tabs {
    &.el-tabs--card>.el-tabs__header .el-tabs__item .el-icon-close {
      line-height: 14px;
    }
  }
</style>
