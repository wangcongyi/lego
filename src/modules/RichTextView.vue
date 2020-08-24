<template>
  <div v-html="richText"/>
</template>

<script>
import config from './RichTextView.js'
export default {
  name: 'RichText',
  module: '富文本',
  props: config
}
</script>