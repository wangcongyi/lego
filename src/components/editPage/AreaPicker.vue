<template>
  <el-dialog
    title="设置图片热区"
    width="60%"
    append-to-body
    :visible.sync="show"
    :before-close="done"
    :close-on-click-modal="false"
  >
    <div class="m-content">
      <div class="detail">
        <div class="imge-area" id="areaImage">
          <ImageView :url="data.url" :items="data.items" :barrageSwitch="false" />
        </div>
      </div>
      <p>上传图片应不要大于750*1200的尺寸,建议多切几刀提高加载速度,热区只删不改</p>
      <div class="list">
        <div v-if="jcp && info.w">实时位置：{{info.x}} {{info.y}} {{info.w}} {{info.h}}</div>
        <div v-if="!isEdit">
          <h2>热区列表</h2>
          <div class="areaList" v-for="(item, index) in data.items" :key="index">
            #{{index+1}}:&nbsp;&nbsp;&nbsp;&nbsp;
            <a @click="delArea(index)">删除</a>
            <a @click="editConfig(index)">编辑</a>
          </div>
        </div>
      </div>
    </div>
    <el-footer class="foot">
      <el-button type="primary" @click="addArea" v-if="!jcp">添加热区</el-button>
      <el-button type="primary" @click="linkToolVisible = true" v-if="jcp">添加链接</el-button>
      <el-button type="primary" @click="done" v-if="data.items.length">完成</el-button>
    </el-footer>
    <LinkTool
      @confirm="linkToolConfirm"
      @close="linkToolVisible = false"
      v-if="linkToolVisible"
      imageSwitch
    />
    <AreaEdit ref="modal" />
  </el-dialog>
</template>

<script>
import ImageView from '@/modules/ImageView.vue'
import AreaEdit from './AreaEdit.vue'
import LinkTool from './LinkTool.vue'
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'AreaPicker',
  components: {
    ImageView,
    AreaEdit,
    LinkTool
  },
  props: ['data', 'moduleName'],
  data () {
    return {
      show: true,
      linkToolVisible: false,
      isEdit: false,
      editIndex: -1,
      jcp: null,
      pageId: '',
      info: {
        x: 0,
        y: 0,
        w: 100,
        h: 100
      }
    }
  },
  methods: {
    Area (item, index) {
      this.editIndex = index
      this.info.x = item.x
      this.info.y = item.y
      this.info.w = item.w
      this.info.h = item.h
      this.addArea()
    },
    editConfig (index) {
      this.$refs.modal.showModal(this.data.items[index])
    },
    delArea (index) {
      this.data.items.splice(index, 1)
    },
    resetAll () {
      this.editIndex = -1
      this.isEdit = false
      this.info = {
        x: 0,
        y: 0,
        w: 100,
        h: 100
      }
    },
    addArea () {
      if (!this.jcp) {
        var ele = document.querySelector('#areaImage .imageView-img')
        Jcrop.load(ele).then(img => {
          this.imgWidth = img.width
          this.imgHeight = img.height
          this.jcp = Jcrop.attach(img)
          const rect = Jcrop.Rect.create(this.info.x, this.info.y, this.info.w, this.info.h)
          this.jcp.newWidget(rect, {})
          this.jcp.focus()
          this.isEdit = true
          this.jcp.listen('crop.change', (widget, e) => {
            this.info = widget.pos
          })
        })
      }
    },
    pushImageItem (props) {
      const { x, y, w, h } = this.info
      this.data.items.push({
        x,
        y,
        w,
        h,
        imgHeight: this.imgHeight,
        imgWidth: this.imgWidth,
        moduleName: this.moduleName,
        ...props
      })
    },
    linkToolConfirm (result) {
      this.pushImageItem(result)
      this.linkToolVisible = false
      this.isEdit = false
    },
    done () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.smart-textarea-title {
  color: #000;
}
.smart-footer {
  position: relative;
  padding-bottom: 10px;
  text-align: right;
  .smart-footer-inner {
    display: inline-block;
  }
}
.f-fr {
  float: right;
}
.m-content {
  background-color: #fff;
  .image {
    width: 375px;
    margin: 0 auto;
  }
  .detail {
    max-height: 620px;
    overflow: auto;
  }
}
.imge-area {
  margin: 0 auto;
  width: 379px;
  border: 2px solid red;
}
.edit {
  margin-top: 50px;
  text-align: center;
  width: 100%;
  height: 50px;
}
.foot {
  display: flex;
  justify-content: center;
  align-items: center;
}
a {
  cursor: pointer;
}
</style>
