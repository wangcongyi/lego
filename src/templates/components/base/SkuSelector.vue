<template>
  <div class="m-sku">
    <div class="list" v-for="(item,index) in propsKeys" :key="index">
      <div class="tt">{{item}}</div>
      <div class="props">
        <div
          class="item"
          v-for="(itm,index) in propsValues[item]"
          :key="index"
          :class="[propsSelect[itm.key] === itm.value ?'selected': '', itm.disable?'disable':''] "
          @click="select(itm)"
        >{{itm.value}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import cloneDeep from 'lodash/cloneDeep'
export default {
  props: {
    stocks: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      skuMap: {},
      propsValues: {}, // 规格属性
      propsKeys: [], // 规则列表
      propsSelect: {}, // 判断选择了哪个类型
      spuMap: {}
    }
  },
  computed: {
    selectInfo () {
      var that = this
      var arr = []
      this.propsKeys.forEach(item => {
        arr.push(`${item}:${that.propsSelect[item]}`)
      })
      return this.skuMap[arr.join(',')]
    }
  },
  watch: {
    stocks: function (newVal, oldVal) {
      this._reset()
      this.genSku()
      this.genSpu()
    }
  },
  created () {
    this.genSku()
    this.genSpu()
  },
  methods: {
    select (item) {
      if (item.disable) {
        return false
      }
      if (this.propsSelect[item.key] === item.value) {
        this.propsSelect[item.key] = ''
      } else {
        this.propsSelect[item.key] = item.value
      }
      this.checkValid()
      this.notify()
    },
    checkValid () {
      var rules = this._genRules()
      this._checkPropsValues(rules)
    },
    // 生成规格每种规格的合法其他规格
    // 例a：选A了  b只能选 1，2
    // 每种规则统统遍历一遍就合规
    _genRules () {
      var propsSelect = this.propsSelect
      var rules = []
      for (const key in propsSelect) {
        if (propsSelect.hasOwnProperty(key)) {
          var value = propsSelect[key]
          if (value) {
            var info = {
              key,
              value: this.spuMap[`${key}:${value}`]
            }
            rules.push(info)
          }
        }
      }
      return rules
    },
    _checkPropsValues (rules) {
      var propsValues = this.propsValues
      var propsList
      if (rules.length === 0) {
        for (const key in propsValues) {
          if (propsValues.hasOwnProperty(key)) {
            propsList = propsValues[key]
            propsList.forEach(itm => {
              itm.disable = false
            })
          }
        }
      } else {
        for (const key in propsValues) {
          if (propsValues.hasOwnProperty(key)) {
            propsList = propsValues[key]
            propsList.forEach(itm => {
              var flag = true
              for (let index = 0; index < rules.length; index++) {
                const element = rules[index]
                if (element.key === key) {
                  continue
                } else {
                  if (!element.value[itm.name]) {
                    flag = false
                    break
                  }
                }
              }
              if (flag) {
                itm.disable = false
              } else {
                itm.disable = true
              }
            })
          }
        }
      }
    },
    notify () {
      var that = this
      var arr = []
      var valueArr = []
      this.propsKeys.forEach(item => {
        arr.push(`${item}:${that.propsSelect[item]}`)
        that.propsSelect[item] && valueArr.push(that.propsSelect[item])
      })
      this.$emit('changeSpu', {
        text: valueArr.join(','),
        info: this.skuMap[arr.join(',')]
      })
    },
    genSku () {
      if (this.stocks.length === 0) {
        return false
      } else {
        let stocks = cloneDeep(this.stocks)
        let skuMap = {}
        let propsKeys = this.propsKeys
        let propsSelect = {}
        // unique 处理
        let keySet = new Set()
        let valueSet = new Set()
        let propsValues = {}
        let defaultSelect = false
        if (stocks.length === 1) {
          defaultSelect = true
        }
        // 遍历库存
        stocks.forEach(item => {
          let skuName = item.name.trim()
          if (skuName.indexOf(':') === -1) {
            skuName = '请选择:' + skuName
          }
          skuMap[skuName] = item
          // 解析规格 ，分割类型  ：分割类型与值
          skuName.split(',').forEach(prop => {
            let [propName, propValue] = prop.split(':')
            if (!propValue) {
              return
            }
            if (!propsValues[propName]) {
              propsValues[propName] = []
            }
            if (!keySet.has(propName)) {
              keySet.add(propName)
              propsKeys.push(propName)
              propsSelect[propName] = ''
            }
            if (!valueSet.has(prop)) {
              valueSet.add(prop)
              propsValues[propName].push({ value: propValue, select: defaultSelect, key: propName, name: prop, disable: false })
            }
            if (defaultSelect) {
              propsSelect[propName] = propValue
            }
          })
        })
        this.propsSelect = Object.assign({}, this.propsSelect, propsSelect)
        this.skuMap = skuMap
        this.propsValues = Object.assign({}, this.propsValues, propsValues)
        if (defaultSelect) {
          this.notify()
        }
      }
    },
    genSpu () {
      var spuMap = {}
      this.stocks.forEach(item => {
        let skuName = item.name.trim()
        if (skuName.indexOf(':') === -1) {
          skuName = '请选择:' + skuName
        }
        let arr = skuName.split(',')
        if (arr.length === 1) {
          spuMap[skuName] = true
        } else {
          for (let index = 0; index < arr.length; index++) {
            let element = arr[index]
            for (let j = arr.length - 1; j > index; j--) {
              let element2 = arr[j]
              if (!spuMap[element]) {
                spuMap[element] = {}
              }
              spuMap[element][element2] = true
              if (!spuMap[element2]) {
                spuMap[element2] = {}
              }
              spuMap[element2][element] = true
            }
          }
        }
      })
      this.spuMap = Object.assign({}, this.spuMap, spuMap)
    },
    _reset () {
      this.skuMap = {}
      this.propsKeys = []
      this.propsValues = {}
      this.propsSelect = {}
      this.spuMap = {}
    }
  }
}
</script>
<style lang="scss" scoped>
.m-sku {
  .tt {
    text-align: left;
    font-size: 14px;
    color: #333;
    font-weight: 400;
  }
  .list {
    margin-bottom: 25px;
  }
  .props {
    display: flex;
    flex-wrap: wrap;
  }
  .item {
    font-size: 13px;
    font-weight: 300;
    color: #333333;
    background: #f5f4f5;
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    margin-top: 10px;
    margin-right: 15px;
    border-radius: 3px;
    white-space: nowrap;
    &.disable {
      color: #e0e0e0;
    }
    &.selected {
      color: rgba(255, 255, 255, 1);
      background: rgba(255, 176, 0, 1);
    }
  }
}
</style>
