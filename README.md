#### 一、项目启动步骤

1. 安装依赖

```bash
yarn
```

2. 启动本地服务

- 开发环境
```bash
yarn dev
```

- 开发模拟生产环境
```bash
yarn devp
```

- 其他环境
```bash
yarn devp:client && yarn server:uat
yarn devp:client && yarn server:fat
yarn devp:client && yarn server:lpt
yarn devp:client && yarn server:prod
```

#### 二、项目架构
- 产品功能
![产品功能](https://lego-activity.weilaijishi.cn/resource/lego/169e1940-522c-11ea-aef9-291e7445bc65.png)
- 系统架子
![系统架子](https://lego-activity.weilaijishi.cn/resource/lego/a89f6b00-522c-11ea-aef9-291e7445bc65.png)
- 系统架构
![系统架构](https://lego-activity.weilaijishi.cn/resource/lego/16a6f2e0-522c-11ea-aef9-291e7445bc65.jpg)

#### 三、系统说明
- 系统目录结构
--config       Node配置文件
--deployer     页面部署本地存放
--dist         代码打包目录
--docs         第三方说明文档存放
--logs         系统运行日志
--res          第三方JS
--server       服务器目录
--src          前端代码资源
- 页面构建流程
![页面构建流程](https://lego-activity.weilaijishi.cn/resource/lego/f47be3a0-522c-11ea-aef9-291e7445bc65.jpg)
```
\\lego\server\vueSSR\index.js
```
- 跨域处理
```
\\lego\server\cors.js
```
- jwt鉴权
```
\\lego\server\routers\checkToken.js
```
- API路由
```
\\lego\server\routers\index.js
```

#### 四、模块开发流程
- 模块代码存放路径
```
\\lego\src\modules
```
1、新建vue文件
2、新建props文件
- vue文件关键属性说明
```javascript
name: 'BottomNav', // 自动化处理模块路径名称、自更新标识
module: '底部导航', // 展示给用户看的名称
poster: 'https://lego-activity-dev.weilaijishi.com/resource/e2106050-1709-11ea-ae56-b5039842b49f.png', // 展示给用户看的封面
mixins: [recommend], // 处理API数据的Mixins
props: config // props
```
- props文件说明
1. 普通属性配置
```javascript
bgColor: {
    title: '会场背景色', // 属性名称，显示给用户看
    type: String, // 类型
    default: '#fff' // 默认值
},
```
2. 高级配置属性说明
一共两个方法
GenSuperText `\\lego\src\modules\super\Text.js`
GenSuperImage `\\lego\src\modules\super\Image.js`
使用方法类似，用来自动化处理高级参数
![高级配置板子](https://lego-activity.weilaijishi.cn/resource/lego/9f1d0b10-5230-11ea-aef9-291e7445bc65.jpg)
```javascript
styleOptions: GenSuperImage(
    '高级配置', // 和title一样
    { 
      paddingLeft: 10,
      paddingRight: 10,
      background: '#3a3a3a',
      moduleBackground: 'rgba(255, 255, 255, 0.2)',
      buttonBackground: '#ffc11c'
    },// css样式
    {
      onlySuper: true // 是否是单独的高级板子，详细看代码
    }
  )
```

3.选择性选择是否引用 `\lego\src\modules\super\Image.vue` 及 `\\lego\src\modules\super\Text.vue` 来处理高级属性
使用案例可见楼层模块 `\\lego\src\modules\FloorView.vue`
选择不引用时，可以选择 `\\lego\src\modules\super\util.js` 文件中的 `genStyle`方法处理高级属性
使用案例可见图片热区模块 `\\lego\src\modules\ImageView.vue`

#### 五、模块自动化说明
- 自动化`Modules`文件夹下新增模块，核心思路使用了requireContext
代码路径 `\\lego\src\modules\index.js`
- 当各个模块的props文件配置更新时，自动化更新已经存在的模块，无需删掉模块再添加处理，核心思路是遍历对应模块的`Key`标识，例如`ImageView.vue`文件的`Key`的值是`Image`，再读取对应模块的props文件在代码层完成增删属性
代码路径 `\\lego\src\store\mutations.js`

#### 运营相关
### 系统功能模块梳理
活动管理模块：
新建活动（活动ID、级别、名称、时间、创建人、最新编辑人）
活动列表
查询功能
注：一个活动对应多个页面

页面管理模块：
新建页面（页面ID、页面名称、页面路径、页面标题、页面描述、关键词、）
页面列表
页面管理
楼层管理（模块排序）
注：一个页面对应多个模块

会场模块
模块通用功能：
模块排序
模块素材管理
模块数据管理
模块样式管理
可视化模拟器

具体模块明细：
1、底部导航/悬浮导航模块
导航数量配置
导航素材配置
导航数据配置

2、店铺/品牌模块
模块数据配置（手填+T台数据）
模块素材配置

3、商品模块
普通商品（手填+T台数据）
秒杀商品（T台数据）
拼团商品（T台数据）
商品模块素材配置

4、卡券模块
卡券数据（手填+T台）
卡券模块素材配置
卡券展示逻辑配置

5、图片热区模块
区域划分功能
热区链接配置
素材配置
弹幕功能
气泡功能
热区图片上传功能

6、楼层模块
素材配置

7、直播模块
数据对接直播系统
素材管理

8、富文本模块
手填H5数据

9、分享模块
分享内容管理
分享数据配置

10、吸顶导航模块
手动关联楼层数据
素材配置

11、短视频模块
素材配置
样式选择

系统功能：
OSS文件管理
测试环境部署、线上环境部署
页面渲染驱动器
地址管理

### 运营操作手册
[运营操作手册](https://www.yuque.com/docs/share/53c3e29d-e5a9-492c-b778-0fd231c1cc95)