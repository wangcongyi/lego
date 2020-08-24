<template lang="html">
    <div class="top-popup-wrapper" @click.stop="closePopup">
      <div class="top-popup-content" @click.stop="preventSlotClick">
        <!-- <transition name="dropdown"> -->
          <slot></slot>
        <!-- </transition> -->
      </div>
    </div>
</template>

<script>
export default {
  methods: {
    closePopup () {
      this.$emit('closePopup')
    },
    preventSlotClick (e) {
      e.preventDefault()
    }
  }
}
</script>

<style scoped lang="css">
.top-popup-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.top-popup-content {
  width: 92%;
  max-height: 92%;
  margin: 0 auto;
  background-color: #fff;
  z-index: 999;
  border-radius: 5px;
  margin-top: -5px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
/*animation*/
.dropdown-enter-active {
  transition: all .3s cubic-bezier(1.0, .5, .8, 1.0);
}
.dropdown-leave-active {
  transition: all .5s cubic-bezier(0, 1, .33, .91);
}
.dropdown-enter, .dropdown-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
