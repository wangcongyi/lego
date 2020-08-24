<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <Navbar />
    <Sidebar class="sidebar-container" />
    <div class="main-container">
      <AppMain />
    </div>
  </div>
</template>

<script>
  import { Navbar, Sidebar, AppMain } from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      },
    },
  }
</script>