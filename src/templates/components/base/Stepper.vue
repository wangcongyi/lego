<template>
  <div class="m-stepper">
  <div class="minus" :class="count<=1?'disable':''" @click="doMinus">-</div>
  <div class="input">{{count}}</div>
  <div class="plus"  :class="count>=99?'disable':''"  @click="doPlus">+</div>
</div>
</template>
<script>
export default {
  props: {
    count: Number,
    disabled: Boolean
  },
  methods: {
    doPlus () {
      if (this.count >= 99) {
        return false
      }
      this.$emit('changeCount', this.count + 1)
    },
    doMinus () {
      if (this.count <= 1) {
        return false
      }
      this.$emit('changeCount', this.count - 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.m-stepper{
  display: flex;
  align-items: center;
  justify-content: left;
}
.minus, .plus{
  width:24px;
  height:24px;
  background:#E7E7E7;
  color: #2D2D2D;
  text-align: center;
  line-height: 24px;
  font-size: 15px;
  border-radius:1px;
}
.minus.disable, .plus.disable{
  background: #fafafa;
  color: #cdcccd;
}

.input{
  width: 33px;
  height: 24px;
  margin: 0 1px;
  min-height: auto;
  background:#E7E7E7;
  box-sizing: border-box;
  border-radius: 1px;
  padding: 0;
  line-height: 24px;
  color: #000000;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}
</style>
