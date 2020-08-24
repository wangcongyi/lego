<template lang="html">
  <div @click="hideActionSheet" @touchmove.stop="scrollHandler" class="actionsheet-mask">
    <div class="actionsheet-content">
      <ul>
        <li v-for="(item, index) in data" :key='index' @click.stop="itemClick(index)" :class="[{'actionsheet-content-item-first': index == 0}, {'no-border' : index == (data.length-1)}, 'actionsheet-content-item']">{{item}}</li>
      </ul>
    </div>
    <div @click.stop="hideActionSheet" class="actionsheet-content-item-cancel">取消</div>
  </div>

</template>

<script>
export default {
  props: [
    'data'
  ],
  methods: {
    scrollHandler (e) {
      e.preventDefault()
    },
    hideActionSheet (e) {
      this.$emit('actionSheetHide')
    },
    itemClick (index) {
      // console.log(index)
      if (index === 0) {
        return
      }
      this.$emit('actionSheetHide')
      this.$emit('actionSheetClick', index - 1)
    }
  }
}
</script>

<style scoped lang="css">
.actionsheet-mask {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, .5);
  z-index: 999;
}
.actionsheet-content {
  width: 95%;
  margin-left: 2.5%;
  background-color: #fff;
  color: #000;
  font-size: .32rem;
  border-radius: .1rem;
  position: fixed;
  bottom: 1.2rem;
}
.actionsheet-content-item {
  width: 100%;
  line-height: 1rem;
  height: 1rem;
  text-align: center;
  border-bottom: 1px solid #e4e4e4;
}
.actionsheet-content-item:active {
  background-color: #ccc;
}
.actionsheet-content-item-first {
  height: .5rem;
  line-height: .5rem;
  color: #bcbcbc;
  font-size: .28rem;
}
.actionsheet-content-item-cancel {
  width: 95%;
  margin-left: 2.5%;
  background-color: #fff;
  color: #000;
  font-size: .32rem;
  border-radius: .1rem;
  height: 1rem;
  text-align: center;
  line-height: 1rem;
  position: fixed;
  bottom: .1rem;
}
.actionsheet-content-item-cancel:active {
  background-color: #ccc;
}
.no-border {
  border: none !important;
}
</style>
