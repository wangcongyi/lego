<template>
  <div>
    <RichText :content="content" />
    <div v-html="content"></div>
  </div>
</template>
<script>
  import RichText from '@/components/RichText'

  export default {
    components: {
      RichText,
    },
    data() {
      return {
        content: '',
      }
    },
  }
</script>
