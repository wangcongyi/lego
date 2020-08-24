import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/pages/Login'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/pages/404'),
    hidden: true
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "Layout" */ '@/layout/Layout'),
    redirect: '/activity',
    children: [
      {
        path: '/activity',
        component: () =>
          import(/* webpackChunkName: "ActivityPage" */ '@/pages/ActivityPage'),
        meta: { title: '活动管理', icon: 'table' }
      },
      {
        path: '/page',
        component: () =>
          import(/* webpackChunkName: "HomePage" */ '@/pages/HomePage'),

        hidden: true
      }
    ]
  },
  {
    path: '/upload',
    component: () =>
      import(/* webpackChunkName: "UploadPage" */ '@/pages/UploadPage'),
    meta: { title: '云盘', icon: 'cloud' }
  },
  {
    path: '/byYourSelf',
    component: () =>
      import(/* webpackChunkName: "ByYourSelf" */ '@/pages/ByYourSelf'),
    hidden: true
  }
]
export default new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})
export const asyncRouterMap = [{ path: '*', redirect: '/404', hidden: true }]
