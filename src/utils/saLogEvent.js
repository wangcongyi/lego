import sensors from 'sa-sdk-javascript'
import { SA_SERVER_URL } from '../config'

const sa_sdk = sensors
sa_sdk.init({
  server_url: SA_SERVER_URL,
  //web_url 神策分析中点击分析及触达分析功能会用到此地址，代码生成工具会自动生成。如果神策后台版本及 `sensorsdata.min.js` 均是 1.10 及以上版本，这个参数不需要配置。
  // web_url:"https://analysis.weilaijishi.cn",
  heatmap: {
    //是否开启点击图，默认 default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭
    //需要 JSSDK 版本号大于 1.7
    clickmap: 'not_collect',
    //是否开启触达注意力图，默认 default 表示开启，自动采集 $WebStay 事件，可以设置 'not_collect' 表示关闭
    //需要 JSSDK 版本号大于 1.9.1
    scroll_notice_map: 'not_collect'
  },
  show_log: false
  // is_track_single_page: true,    //屏蔽在路由切换时发起埋点，这个会导致页面title还没切换时就已埋点，使用 sensors.quick('autoTrackSinglePage') 手动埋点
})
// sensors.login(user_id);
// sa_sdk.quick('autoTrack')

export default sa_sdk
