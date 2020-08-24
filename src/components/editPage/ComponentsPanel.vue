<template>
  <el-collapse v-model="activeNames">
    <el-collapse-item title="模块新增操作" name="edit">
      <!-- <el-collapse-item title="模块新增操作" name="edit" class="m-modules-content"> -->
      <div v-if="!editPage.id">请先设置/保存页面</div>
      <template v-else>
        <template v-if="pid == 1">
          <!-- 模块预览 -->
          <!-- <el-select
            v-model="moduleKey"
            filterable
            placeholder="请选择模块"
            class="m-modules-create"
            @change="addModule(moduleKey)"
          >
            <template v-for="item in moduleList">
              <el-popover v-if="item.poster" :key="item.key" placement="left" trigger="hover">
                <el-image :src="item.poster" :preview-src-list="posterList" class="image">
                  <div slot="error" class="image-slot error__image-slot">
                    <i class="el-icon-picture-outline" />
                  </div>
                  <div slot="placeholder" class="image-slot placeholder__image-slot">
                    加载中
                    <span class="dot">...</span>
                  </div>
                </el-image>
                <el-option slot="reference" :label="item.name" :value="item.key" />
              </el-popover>
            </template>
          </el-select>-->
          <template v-for="item in moduleList">
            <el-popover
              v-if="showPopover && item.poster"
              :key="item.key"
              placement="left"
              trigger="hover"
              class="module-button"
            >
              <el-image :src="item.poster" :preview-src-list="posterList" class="image">
                <div slot="error" class="image-slot error__image-slot">
                  <i class="el-icon-picture-outline" />
                </div>
                <div slot="placeholder" class="image-slot placeholder__image-slot">
                  加载中
                  <span class="dot">...</span>
                </div>
              </el-image>
              <el-button slot="reference" @click="addModule(item.key)">{{item.name}}模块</el-button>
            </el-popover>
            <el-button v-else :key="item.key" @click="addModule(item.key)">{{item.name}}模块</el-button>
          </template>
          <el-button @click="addVideoView">短视频模块</el-button>
        </template>
        <VideoSelect
          :visible="videoSelect.visible"
          @close="videoSelect.visible = false"
          @confirm="videoSelectConfirm"
          ref="videoSelect"
        />
      </template>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
import { getModule, modules } from "@/modules"
import VideoSelect from './VideoSelect'

export default {
  components: {
    VideoSelect
  },
  computed: {
    editPage () {
      return this.$store.state.editPage
    },
    model () {
      return this.$store.state.tModel
    },
    pid () {
      return this.$route.query.pid || 1
    },
    moduleList () {
      const list = []
      const externals = ['videoExtraLarge', 'videoLarge', 'acps']
      Object.keys(modules).forEach(key => {
        if (!externals.some(i => i === key))
          list.push({
            key: key,
            ...modules[key]
          })
      })
      return list
    },
    posterList () {
      const list = []
      this.moduleList.forEach(item => item.poster && list.push(item.poster))
      return list
    }
  },
  data () {
    return {
      activeNames: ['edit'],
      videoSelect: {
        visible: false
      },
      showPopover: false
    };
  },
  mounted () {
    window.GLOBAL_VM.MODULES = this
  },
  methods: {
    addVideoView () {
      this.$refs.videoSelect.show()
    },
    videoSelectConfirm (value) {
      switch (value) {
        case 1:
          this.model.push(getModule('videoExtraLarge'))
          break
        case 2:
          this.model.push(getModule('videoLarge'))
          break
      }
    },
    addModule (moduleName) {
      this.model.push(getModule(moduleName))
    }
  }
};
</script>
<style lang="scss" scoped>
.el-button {
  margin-top: 10px;
}
.m-modules-content {
  text-align: left;
}
.m-modules-create {
  padding-left: 20px;
}
.module-button {
  margin-right: 10px;
}
.image {
  width: 400px;
  .image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;
    font-size: 14px;
  }
  .error__image-slot {
    font-size: 30px;
  }
  .placeholder__image-slot {
    .dot {
      animation: dot 2s steps(3, start) infinite;
      overflow: hidden;
    }
  }
}

@keyframes dot {
  0% {
    width: 0;
    margin-right: 1em;
  }

  to {
    width: 1em;
    margin-right: 0;
  }
}
</style>
