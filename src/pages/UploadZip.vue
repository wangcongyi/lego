<template>
  <div class="m-upload">
    <h2>交互稿上传页</h2>
    <p>支持axrue，sketch导出html压缩成zip与pdf文件上传</p>
    <upload-dragger @click.native="handleUploadClick" @file="onSelectFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </upload-dragger>
    <input @change="handlechange" name="demofile" ref="fileInput" type="file" v-show="false" />
    <div class="m-list m-header">
      <span class="m-span-2-10">文件名</span>
      <span class="m-span-1-10">上传状态</span>
      <span class="m-span-6-10">文件链接</span>
      <span class="m-span-1-10">操作</span>
    </div>
    <div :class="{'even': i%2==1}" :key="i" class="m-list" v-for="(file, i) in filelist">
      <span class="m-span-2-10">{{file.name}}</span>
      <span class="m-span-1-10">{{file.status}}</span>
      <span class="m-span-6-10">
        <a :href="file.link" target="_blank">{{file.link}}</a>
      </span>
      <span @click="copyLink(file.link)" class="m-span-1-10" v-if="file.status === 'success'">
        <a>复制链接</a>
      </span>
    </div>
    <div style="margin: 20px 0;">
      <button @click="startUpload">开始上传</button>
      <button @click="reset">重置</button>
    </div>
  </div>
</template>

<script>
  import UploadDragger from '@/components/UploadDragger.vue'
  import axios from 'axios'
  import { copy } from '@/utils/'

  export default {
    components: {
      UploadDragger,
    },
    data() {
      return {
        DOMAIN_PREFIX: 'https://resource.homay.com/',
        userCustomPath: '',
        filelist: [], //待上传文件列表
        remoteFileList: [], //nos文件列表
      }
    },
    computed: {
      product() {
        return this.$store.state.editProduct
      },
    },
    methods: {
      upload(file) {
        var formData = new FormData()
        if (!file) {
          this.$message.error('File Empty')
          return
        }
        formData.append('file', file.rawFile)
        axios.post('/api/storage/uploadZip', formData)
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
        if (this.filelist.length !== 1) {
          this.$message.error('只支持单个zip/PDF上传')
          return
        }
        if (this.filelist[0].name.toLocaleLowerCase().indexOf('.zip') === -1 && this.filelist[0].name.toLocaleLowerCase().indexOf('.pdf') === -1) {
          this.$message.error('请上传zip格式压缩包或PDF文件')
          return
        }
        this.filelist.forEach(file => {
          if (file.status === 'ready') {
            if (window.confirm('请确认上传文件不带中文特殊字符，中文可能导致链接不可用')) {
              file.status = 'uploading'
              this.upload(file)
            }

          }
        })
      },
      // 清空待上传列表
      reset() {
        this.filelist.splice(0, this.filelist.length)
      },
      copyLink(link) {
        copy(location.protocol + '//' + location.host + '/' + link, () => {
          this.$message.info('复制成功')
        })
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

  .m-list {
    text-align: left;
    width: 80%;
    margin: 0 auto;
    box-sizing: content-box;

    &.m-header {
      background-color: #aaa;
    }

    &.even {
      background-color: #eee;
    }

    .m-span-7-10,
    .m-span-2-10,
    .m-span-1-10,
    .m-span-6-10 {
      display: inline-block;
      box-sizing: border-box;
      word-break: break-all;
      margin: 0;
    }

    .m-span-7-10 {
      width: 69%;
    }

    .m-span-6-10 {
      width: 58%;
    }

    .m-span-2-10 {
      width: 20%;
    }

    .m-span-1-10 {
      width: 10%;
    }

    a {
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
</style>
