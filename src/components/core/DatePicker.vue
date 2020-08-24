<template>
  <el-date-picker
    v-bind="newBind"
    :value="value"
    @input="$emit('input', $event)"
    @change="change"
    :picker-options="newPickerOptions"
    :class="defaultErrorStyle ? '' : 'disabled-error'"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String, Array],
      default: Date.now()
    },
    bind: {
      type: Object,
      default: () => ({})
    },
    pickerOptions: {
      type: Object,
      default: () => ({})
    },
    defaultErrorStyle: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    /**
     * @param type
     * date           日期
     * daterange      日期范围
     * datetime       日期和时间点
     * datetimerange  日期和时间范围
     */
    newBind () {
      const bind = this.bind
      const defaultBind = {
        'type': 'date',
        'value-format': 'timestamp',
        'align': 'left'
      }
      if (bind.type === 'daterange' || bind.type === 'datetimerange') {
        return Object.assign(defaultBind, {
          'unlink-panels': true,
          'range-separator': '至',
          'start-placeholder': '开始日期',
          'end-placeholder': '结束日期'
        }, bind)
      }
      return Object.assign(defaultBind, this.bind)
    },
    newPickerOptions () {
      return Object.assign({
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }, this.pickerOptions)
    }
  },
  methods: {
    change (value) {
      this.$emit('change', value)
    }
  }
}
</script>
<style lang="scss" scoped>
.disabled-error {
  border-color: #dcdfe6 !important;
}
</style>
