export const PLATFORM = 4
export const VERSION = '1.5.0'
export const BUILD_ARGVS = process.env.BUILD_ARGVS || 'dev'
export const NODE_ENV = process.env.NODE_ENV || 'development'
const IS_PROD = BUILD_ARGVS === 'prod'
const DOMAIN_PREFIX_ENV = IS_PROD ? '' : `-${BUILD_ARGVS}`
const DOMAIN_SUFFIX = IS_PROD ? '.cn' : `.com`
const PROTOCOL = IS_PROD ? `https` : `http`


// export const H5_MAIN_URL = IS_PROD ? 'https://m.dydf.cn' : `https://nm-${BUILD_ARGVS}.weilaijishi.com`
export const H5_MAIN_URL = IS_PROD ? 'https://m.lifeyouyu.com' : `https://sm-${BUILD_ARGVS}.weilaijishi.com`
export const LIVE_MAIN_URL = `${PROTOCOL}://lives.m${DOMAIN_PREFIX_ENV}.weilaijishi${DOMAIN_SUFFIX}`
export const FIND_MAIN_URL = `${PROTOCOL}://find.m${DOMAIN_PREFIX_ENV}.weilaijishi${DOMAIN_SUFFIX}`
export const GEN_H5_MAIN_URL = (P = DOMAIN_PREFIX_ENV, s = DOMAIN_SUFFIX) => `https://m${P}.weilaijishi${s}`
export const BASE_URL = `https://lego${DOMAIN_PREFIX_ENV}.weilaijishi${DOMAIN_SUFFIX}`
export const LEGO_ACTIVITY_URL = `http://lego-activity${DOMAIN_PREFIX_ENV}.weilaijishi${DOMAIN_SUFFIX}`
const SA_PRO_SERVER_URL = 'https://data-import.lifeyouyu.com/sa?project=production'
const SA_TEST_SERVER_URL = 'https://data-import.lifeyouyu.com/sa?project=default'
export const SA_SERVER_URL = IS_PROD ? SA_PRO_SERVER_URL : SA_TEST_SERVER_URL
export const LINK_CONFIG = [
  {
    id: 'video',
    label: '视频',
    wxLink: '/pages/videos',
    appLink: '/wljs/play_list',
    h5Link: '/#/videos',
    appScheme: '',
    params: [
      { label: '视频ID', h5Prop: 'videoId', required: true },
      { label: '作者/主播用户ID', h5Prop: 'authorId', required: true },
      {
        label: '查看模式',
        h5Prop: 'viewMode',
        default: 1,
        list: [
          { text: '推荐视频', value: '1' },
          { text: '主播视频', value: '2' },
          { text: '商品视频', value: '3' },
          { text: '关注视频', value: '4' },
        ],
        required: true,
      },
    ],
  },
  {
    id: 'product',
    label: '商品详情页',
    h5Link: '/product/detail',
    appLink: '/good/product_detail',
    wxLink: '/pages/goods/src/detail/index',
    appScheme: 'lifeyouyu://main/product/detail',
    params: [
      { label: '商品id', h5Prop: 'id', appProp: 'productId', required: true },
      { label: '规格id', h5Prop: 'productGoodsId', appProp: 'productGoodsId' },
      { label: '活动id', h5Prop: 'actId', appProp: 'activityId' },
      { label: '活动类型', h5Prop: 'actType', appProp: 'activityType' },
    ],
  },
  {
    id: 'category',
    label: '全部分类',
    h5Link: '/#/productCategory',
    appLink: '/category/product_category',
    appScheme: 'lifeyouyu://main/productCategory',
    params: [
      { label: '索引', h5Prop: 'index', appProp: '' },
    ],
  },
  {
    id: 'categoryPage',
    label: '特定分类页',
    h5Link: '/#/categoryPage',
    appLink: '/category/specific_product_category',
    appScheme: 'lifeyouyu://main/categoryPage',
    params: [
      { label: '标题名称', h5Prop: 'title', appProp: 'categoryTitle' },
      { label: '分类id', h5Prop: 'id', appProp: 'productCateId', required: true },
    ],
  },
  {
    id: 'categoryDetail',
    label: '分类商品页',
    h5Link: '/#/categoryDetail',
    appLink: '',
    appScheme: 'lifeyouyu://main/categoryDetail',
    params: [
      { label: '标题名称', h5Prop: 'title', appProp: 'categoryTitle' },
      { label: '分类id', h5Prop: 'id', appProp: 'productCateId', required: true },
      { label: '来源', h5Prop: 'fromType', appProp: 'fromType', initialValue: 'home', hidden: true },
    ],
  },
  {
    id: 'rechargeCenter',
    label: '话费充值页',
    h5Link: '/#/rechargeCenter',
    appLink: '/recharge/phone_recharge_center',
    appScheme: 'lifeyouyu://main/rechargeCenter',
    params: [],
  },
  {
    id: 'live',
    label: '直播间页',
    h5Link: '/live',
    appLink: '/live/live_room',
    appScheme: 'lifeyouyu://main/live',
    params: [
      { label: '直播id', h5Prop: 'liveId', appProp: 'liveId', required: true },
    ],
  },
  {
    id: 'memberCenter',
    label: '掌柜中心',
    h5Link: '/#/root/memberCenter',
    appLink: '/vip/member_center',
    appScheme: 'lifeyouyu://main//root/memberCenter',
    params: [],
  },
  {
    id: 'articleDetail',
    label: '文章详情页（发现页）',
    h5Link: '/articleDetail',
    appLink: '/articleDetail',
    appScheme: 'lifeyouyu://main/articleDetail',
    params: [
      { label: '文章id', h5Prop: 'articleId', appProp: 'articleId', required: true },
      { label: '标签名称', h5Prop: 'tabName', appProp: 'tabName' },
      { label: '埋点id', h5Prop: '', appProp: 'contentClassID' },
      { label: '埋点信息', h5Prop: '', appProp: 'contentClassDesc' },
    ],
  },
  {
    id: 'articleList',
    label: '商品文章列表（发现页）',
    h5Link: '/articleList',
    appLink: '/articleList',
    appScheme: 'lifeyouyu://main/articleList',
    params: [
      { label: '商品编号', h5Prop: 'productNo', appProp: 'productNo', required: true },
      { label: '标签名称', h5Prop: 'tabName', appProp: 'tabName' },
    ],
  },
  {
    id: 'topic',
    label: '话题详情页（发现页）',
    h5Link: '/topic',
    appLink: '/topic',
    appScheme: 'lifeyouyu://main/topic',
    params: [
      { label: '话题id', h5Prop: 'subjectId', appProp: 'subjectId', required: true },
      { label: '标签名称', h5Prop: 'tabName', appProp: 'tabName' },
    ],
  },
  {
    id: 'supplierShop',
    label: '店铺页',
    h5Link: '/#/supplierShop',
    appLink: '/goods/seller',
    appScheme: 'lifeyouyu://main/supplierShop',
    params: [
      { label: '店铺id', h5Prop: 'id', appProp: 'sellerId', required: true },
    ],
  },
  {
    id: 'home',
    label: '首页',
    h5Link: '',
    appLink: '/main/mainActivity',
    appScheme: 'lifeyouyu://main/root/home',
    params: [
      { label: '分类id', h5Prop: '', appProp: 'pid', required: true },
    ],
  },
  {
    id: 'lessonDetail',
    label: '课程内容',
    protocol: 'https',
    h5Link: '/native/lessonDetail',
    appLink: '',
    appScheme: '',
    params: [
      { label: '课程id', h5Prop: 'id', appProp: '', required: true },
    ],
  },
  {
    id: 'lessonList',
    label: '课程类目',
    protocol: 'https',
    h5Link: '/native/lessonList',
    appLink: '',
    appScheme: '',
    params: [
      { label: '类目id', h5Prop: 'id', appProp: '', required: true },
    ],
  },
]
const MEMBER_LEVEL_GOLD = '0d5cb30c5fd749b19c619e670482e301'
const MEMBER_LEVEL_PLATINUM = 'b0ec3ca8bd7a4ac9a20d57651587dbdc'
const MEMBER_LEVEL_DIAMOND = '8571e6ce98e34e02a8418bdfde1523c6'
//掌柜等级
export const MEMBER_LEVEL_OBJ = {
  [MEMBER_LEVEL_GOLD]: 0,         //黄金
  [MEMBER_LEVEL_PLATINUM]: 1,     //铂金
  [MEMBER_LEVEL_DIAMOND]: 2,      //钻石
}
const PRIZE_LEVEL_1 = '新星'
const PRIZE_LEVEL_2 = '人气'
const PRIZE_LEVEL_3 = '精尖'
const PRIZE_LEVEL_4 = '超凡'
const PRIZE_LEVEL_5 = '至尊'
//团队等级
export const PRIZE_LEVEL = {
  [PRIZE_LEVEL_1]: 1,
  [PRIZE_LEVEL_2]: 2,
  [PRIZE_LEVEL_3]: 3,
  [PRIZE_LEVEL_4]: 4,
  [PRIZE_LEVEL_5]: 5,
}