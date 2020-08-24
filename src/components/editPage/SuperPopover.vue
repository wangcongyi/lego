<template>
  <!-- 魔法板子Popover -->
  <el-popover slot="suffix" placement="left" trigger="click">
    <el-form label-width="80px" size="small">
      <template v-for="(val, key) in editModel[editItem.key].style">
        <el-form-item v-if="showMagicItem(editItem, key)" :key="key" :label="styleGenLabel[key]">
          <el-input-number
            v-model="editModel[editItem.key].style[key]"
            v-if="styleGenType[key].inputNumber"
            controls-position="right"
            :step="styleGenType[key].step"
            :min="styleGenType[key].min || -3"
            :max="styleGenType[key].max || Infinity"
          />
          <el-input v-model="editModel[editItem.key].style[key]" v-else>
            <el-color-picker
              slot="suffix"
              v-if="styleGenType[key].colorPicker"
              v-model="editModel[editItem.key].style[key]"
              size="mini"
              show-alpha
              :style="{ marginTop: '2px' }"
            />
          </el-input>
        </el-form-item>
      </template>
    </el-form>
    <i class="el-icon-magic-stick el-input__icon f-pointer" slot="reference" />
  </el-popover>
</template>

<script>
import * as superUtil from '@/modules/super/util'
export default {
  props: {
    editModel: Object,
    editItem: Object
  },
  computed: {
    styleMap: _ => superUtil.map,
    styleGenLabel: _ => superUtil.genLabel,
    styleGenType: _ => superUtil.genType,
  },
  methods: {
    showMagicItem (editItem, styleKey) {
      if (styleKey === 'height') {
        const itemModel = this.editModel[editItem.key]
        const { imageAutoHeight, value } = itemModel
        const hasBgImg = /[h\/]/.test(value)
        if (imageAutoHeight && hasBgImg) {
          return false
        }
        return true
      }
      return true
    },
  }
}
</script>