<template>
  <div class="m-upload">
    <h2>资源上传页</h2>
    <h3>上传云盘目录</h3>
    <div>
      <input class="u-path-prefix" disabled :value="DOMAIN_URL + BASE_PATH" />
      <input v-model="userCustomPath" placeholder="自定义路径例如：abc/" />
      <span style="color: #ccc;">* 支持数字及字母组合</span>
    </div>
    <h3>选择文件</h3>
    <upload-dragger @file="onSelectFile" @click.native="handleUploadClick">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </upload-dragger>
    <input
      type="file"
      name="demofile"
      v-show="false"
      ref="fileInput"
      @change="handlechange"
      multiple
    />
    <div class="m-list-cell m-header">
      <span class="m-span-2-10">文件名</span>
      <span class="m-span-1-10">上传状态</span>
      <span class="m-span-6-10">文件链接</span>
      <span class="m-span-1-10">操作</span>
    </div>
    <div class="m-list-cell" v-for="(file, i) in filelist" :key="i" :class="{'even': i%2==1}">
      <span class="m-span-2-10">{{file.name}}</span>
      <span class="m-span-1-10">{{file.status}}</span>
      <span class="m-span-6-10">
        <a :href="file.link" target="_blank">{{file.link}}</a>
      </span>
      <span class="m-span-1-10" @click="copyLink(file.link)" v-if="file.status === 'success'">
        <a>复制链接</a>
      </span>
    </div>
    <div style="margin: 20px 0;">
      <button @click="startUpload">开始上传</button>
      <button @click="reset">重置</button>
      <button @click="refreshDir">刷新目录</button>
    </div>
    <h3>云文件浏览</h3>
    <div class="m-list-cell m-header">
      <span class="m-span-7-10">文件对象</span>
      <span class="m-span-2-10">预览</span>
      <span class="m-span-1-8">更新时间</span>
      <span class="m-span-1-8">大小</span>
      <span class="m-span-1-10">操作</span>
    </div>
    <div
      class="m-list-cell"
      v-for="(file, i) in remoteFileList"
      :key="file.key"
      :class="{'even': i%2==1}"
    >
      <span class="m-span-7-10">
        <a target="_blank" :href="DOMAIN_URL + file.name">{{DOMAIN_URL + file.name}}</a>
      </span>
      <span class="m-span-2-10">
        <img
          class="m-img s-box-shadow"
          v-lazy="DOMAIN_URL + file.name"
          alt
          @click="$imodal(DOMAIN_URL + file.name)"
        />
      </span>
      <span class="m-span-1-8">{{new Date(`${file.lastModified}`) | toDate}}</span>
      <span class="m-span-1-8">{{ getSize(file.size) }}</span>
      <span class="m-span-1-10">
        <a @click="deleteFile(i)">删除</a>&nbsp;&nbsp;&nbsp;
        <a @click="copyLink(DOMAIN_URL + file.name)">复制地址</a>
      </span>
    </div>
  </div>
</template>

<script>
  import UploadDragger from '@/components/UploadDragger.vue'
  import axios from 'axios'
  import { DOMAIN_URL, BASE_PATH } from '../../config/ossConfig'
  import { copy } from '@/utils'

  export default {
    components: {
      UploadDragger,
    },
    data() {
      return {
        DOMAIN_URL,
        BASE_PATH,
        userCustomPath: '',
        filelist: [], //待上传文件列表
        remoteFileList: [], //nos文件列表
        CR: 0,
      }
    },
    computed: {
      product() {
        return this.$store.state.editProduct
      },
    },
    mounted() {
      window.GLOBAL_VM.UPLOAD_PAGE = this
    },
    methods: {
      getSize(size) {
        const kb = size / 1000
        const mb = kb / 1000
        return mb > 1 ? `${mb.toFixed(1)}MB` : `${kb.toFixed(1)}KB`
      },
      upload(file) {
        var formData = new FormData()
        if (!file) {
          this.$message.error('File Empty')
          return
        }
        formData.append('r', this.CR)
        formData.append('file', file.rawFile)
        formData.append('prefix', this.userCustomPath)
        axios.post('/api/storage/uploadFile', formData)
          .then(data => {
            if (data.code === 200) {
              file.status = 'success'
              file.link = data.msg
              file.rawFile = null
            } else {
              file.status = 'fail'
              this.$message.error(file.name + '上传失败,' + data.msg)
              console.log('data.msg')
            }
          })
          .catch(e => {
            file.status = 'fail'
          })

      },
      startUpload() {
        if (!/\/$/.test(this.userCustomPath) && this.userCustomPath) {
          this.$message.error('路径需以/结尾，如 testpage1/')
          return
        }

        if (!/^[0-9a-zA-Z]+\/$/.test(this.userCustomPath) && this.userCustomPath) {
          this.$message.error('路径格式不正确')
          return
        }

        if (this.filelist.length < 1) {
          this.$message.error('待上传列表为空')
          return
        }

        this.filelist.forEach(file => {
          if (file.status === 'ready') {
            // if (window.confirm("请确认上传文件不带中文特殊字符，中文可能导致链接不可用")) {
            file.status = 'uploading'
            this.upload(file)
            // }

          }
        })
      },
      // 清空待上传列表
      reset() {
        this.filelist.splice(0, this.filelist.length)
      },
      // 刷新目录
      refreshDir() {
        if (!/\/$/.test(this.userCustomPath) && this.userCustomPath) {
          this.$message.error('路径需以/结尾，如 testpage1/')
          return
        }

        axios.post('/api/storage/listFiles', {
          prefix: this.userCustomPath,
        })
          .then(data => {
            if (data.code === 200) {
              const arr = data.msg || []
              const list = arr.sort((a, b) => {
                return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
              })
              this.remoteFileList.splice(0, this.remoteFileList.length)
              this.remoteFileList.push(...list)

              if (list.length < 1) {
                this.$message.error('该目录下文件为空')
              }
            } else {
              return Promise.reject(list)
            }
          })
          .catch(err => {
            console.log('list err' + err)
          })
      },
      copyLink(link) {
        copy(link, () => {
          this.$message.info('复制成功')
        })
      },
      //删除文件
      deleteFile(index) {
        if (window.confirm('删除会导致线上资源不可用，请确认资源已经不使用再删除')) {
          var file = this.remoteFileList[index]
          axios.post('/api/storage/deleteFile', {
            name: file.name,
          })
            .then(data => {
              if (data.code === 200) {
                this.remoteFileList.splice(index, 1)
              } else {
                return Promise.reject(data.msg)
              }
            })
            .catch(error => {
              console.log('delete file error:' + error)
            })
        }
      },
      handleFile(files) {
        var fileList = [].map.call(files, file => {
          return {
            name: file.name,
            rawFile: file,
            status: 'ready',
          }
        })
        this.filelist.push(...fileList)
      },
      onSelectFile(files) {
        if (!files) return
        this.handleFile(files)
      },
      handlechange(e) {
        var files = e.target.files
        if (!files) return
        this.handleFile(files)
      },
      handleUploadClick() {
        this.$refs.fileInput.click()
      },
    },
  }
</script>

<style scoped lang='less' scoped>
  div {
    text-align: center;
  }

  button {
    border: 1px solid #fff;
    padding: 10px 5px;
    cursor: pointer;
  }

  input {
    border: 1px solid #bbb;
    padding: 10px 5px;
  }

  .u-path-prefix {
    width: 500px;
  }

  .m-img {
    min-width: 50px;
    max-width: 100px;
    object-fit: cover;
    cursor: pointer;
  }

  .s-box-shadow {
    box-shadow: 0 14px 26px -12px rgba(114, 130, 148, 0.42),
    0 4px 23px 0 rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 122, 255, 0.2);
  }

  .m-list-cell {
    text-align: left;
    width: 80%;
    margin: 0 auto;
    box-sizing: content-box;
    padding: 10px 0;

    &.m-header {
      background-color: #aaa;
    }

    &.even {
      background-color: #eee;
    }

    [class^='m-span-'] {
      display: inline-block;
      box-sizing: border-box;
      word-break: break-all;
      margin: 0;
    }

    .m-span-7-10 {
      width: 40%;
    }

    .m-span-6-10 {
      width: 58%;
    }

    .m-span-2-10 {
      width: 20%;
    }

    .m-span-2-10 {
      width: 20%;
    }

    .m-span-1-10 {
      width: 10%;
    }

    .m-span-1-8 {
      width: 12.5%;
    }

    .m-span-1-20 {
      width: 5%;
    }

    a {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
