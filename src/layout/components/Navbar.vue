<template>
  <el-menu class="navbar" mode="horizontal">
    <Hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened" />
    <div class="right-menu"></div>
    <span class="username">{{ userInfo.username }}</span>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar | thumbnail(40)" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>首页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="show = true">修改</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <ChangePwd v-if="show" @close="show = false" @submit="submitChange" />
  </el-menu>
</template>

<script>
  import { mapGetters } from 'vuex'
  import Hamburger from '@/components/Hamburger'
  import ChangePwd from '@/components/ChangePwd'

  export default {
    components: {
      Hamburger,
      ChangePwd,
    },
    computed: {
      ...mapGetters([
        'sidebar',
        'userInfo',
      ]),
      avatar() {
        return this.userInfo.avatar || 'https://new-app-dev.oss-cn-shenzhen.aliyuncs.com/dev/plantform/logo2.png'
      },
    },
    data() {
      return {
        show: false,
      }
    },
    methods: {
      toggleSideBar() {
        this.$store.dispatch('ToggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      },
      submitChange(form) {
        const loading = this.$loading()
        this.$store.dispatch('ChangeInfo', {
          username: this.userInfo.username,
          oldpass: form.oldPass,
          newpass: form.pass,
        }).then(res => {
          this.$message.success('修改成功')
          this.show = false
        }).catch(msg => {
          this.$message.error(`修改失败${msg ? `，${msg}` : ''}`)
          // this.$message.error(msg || '修改失败')
          console.log(msg)
        }).then(_ => {
          loading.close()
        })
      },
    },
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;

    .right-menu {
      float: right;
      height: 100%;

      .nx-help {
        display: inline-block;
        vertical-align: top;
      }
    }

    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 22px;
    }

    .screenfull {
      position: absolute;
      right: 90px;
      top: 16px;
      color: red;
    }

    .username {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 100px;
      outline: none;
    }

    .avatar-container {
      height: 50px;
      display: inline-block;
      position: absolute;
      right: 35px;

      .avatar-wrapper {
        cursor: pointer;
        margin-top: 5px;
        position: relative;

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
</style>