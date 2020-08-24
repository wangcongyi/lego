SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for lego_activity
-- ----------------------------
DROP TABLE IF EXISTS `lego_activity`;
CREATE TABLE `lego_activity` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id, 页面id',
  `activity_name` varchar(128) NOT NULL DEFAULT '' COMMENT '活动名称,用于活动区分',
  `activity_level` varchar(128) NOT NULL DEFAULT '' COMMENT '活动级别,用作区分活动级别',
  `pre_start_time` bigint(20) DEFAULT NULL COMMENT '活动预热开始时间',
  `pre_end_time` bigint(20) DEFAULT NULL COMMENT '活动预热结束时间',
  `formal_start_time` bigint(20) NOT NULL DEFAULT '0' COMMENT '活动正式开始时间',
  `formal_end_time` bigint(20) NOT NULL DEFAULT '0' COMMENT '活动正式结束时间',
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '逻辑删除字段',
  `creator` varchar(128) DEFAULT '' COMMENT '创建者',
  `editor` varchar(128) DEFAULT '' COMMENT '创建者',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=DYNAMIC COMMENT='乐高活动表';

-- ----------------------------
-- Table structure for lego_pages
-- ----------------------------
DROP TABLE IF EXISTS `lego_pages`;
CREATE TABLE `lego_pages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id, 页面id',
  `activity_id` int(11) NOT NULL DEFAULT '0' COMMENT '关联的活动ID',
  `name` varchar(200) NOT NULL DEFAULT '' COMMENT '页面名称,用于制作区分',
  `pid` int(11) NOT NULL DEFAULT '1' COMMENT '产品id',
  `t_name` varchar(128) DEFAULT NULL COMMENT '模板名',
  `t_model` mediumtext COMMENT '模板模型对象',
  `root_path` varchar(128) DEFAULT NULL COMMENT '部署根路径, 保留字段未使用',
  `sub_path` varchar(128) DEFAULT NULL COMMENT '部署子路径',
  `deployed_test` tinyint(1) DEFAULT '0' COMMENT '是否已部署至测试, 0-否, 1-是',
  `deployed_prod` tinyint(1) DEFAULT '0' COMMENT '是否已部署至线上, 0-否, 1-是',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除字段',
  `deploy_title` varchar(128) DEFAULT NULL COMMENT '页面title',
  `deploy_desc` varchar(256) DEFAULT NULL COMMENT '页面description',
  `deploy_keywords` varchar(128) DEFAULT NULL COMMENT '页面keywords',
  `created_at` timestamp NOT NULL DEFAULT '2018-07-09 00:00:00' COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `share_title` varchar(128) NOT NULL DEFAULT '' COMMENT '分享标题',
  `share_desc` varchar(256) NOT NULL DEFAULT '' COMMENT '分享描述',
  `share_img_url` varchar(128) NOT NULL DEFAULT '' COMMENT '微信分享头图链接',
  `share_link` varchar(256) NOT NULL DEFAULT '' COMMENT '微信分享链接',
  `creator` varchar(128) DEFAULT NULL COMMENT '创建者',
  `editor` varchar(128) DEFAULT NULL COMMENT '创建者',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_pid_name` (`pid`,`name`) USING BTREE,
  KEY `idx_activity_id` (`activity_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='乐高页面表';

-- ----------------------------
-- Table structure for lego_product
-- ----------------------------
DROP TABLE IF EXISTS `lego_product`;
CREATE TABLE `lego_product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id, 产品id',
  `name` varchar(200) NOT NULL COMMENT '产品名，例：云信',
  `name_en` varchar(200) NOT NULL COMMENT '产品英文名，用于nos存储前缀, 例：yunxin',
  `domain_test` varchar(200) NOT NULL COMMENT '产品域名，测试环境， 例： home.netease.im',
  `domain_online` varchar(200) NOT NULL COMMENT '产品域名，线上环境， 例： netease.im',
  `domain_online_new` varchar(200) DEFAULT NULL COMMENT '产品新域名，线上环境， 例： yunxin.163.com',
  `root_path` varchar(200) NOT NULL COMMENT '产品部署的根路径， 例：activity',
  `default_deploy_title` varchar(256) NOT NULL COMMENT '页面默认title',
  `default_deploy_keywords` varchar(256) NOT NULL COMMENT '页面默认keywords',
  `default_deploy_desc` varchar(1024) NOT NULL COMMENT '页面默认description',
  `created_at` timestamp NOT NULL DEFAULT '2018-07-09 00:00:00' COMMENT '创建时间',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='乐高产品表';

-- ----------------------------
-- Records of lego_product
-- ----------------------------
INSERT INTO `lego`.`lego_product` (`id`, `name`, `name_en`, `domain_test`, `domain_online`, `domain_online_new`, `root_path`, `default_deploy_title`, `default_deploy_keywords`, `default_deploy_desc`, `created_at`, `updated_at`) VALUES ('1', 'lego', 'lego', 'https://lego-activity-dev.weilaijishi.com', 'https://lego-activity.weilaijishi.cn', '', 'activity', '未来集市', '电商,购物', '你想要的我都有', '', '');

-- ----------------------------
-- Table structure for lego_user
-- ----------------------------
DROP TABLE IF EXISTS `lego_user`;
CREATE TABLE `lego_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(150) NOT NULL COMMENT '用户名称',
  `password` varchar(150) NOT NULL DEFAULT '' COMMENT '用户密码',
  `email` varchar(128) NOT NULL COMMENT '用户邮箱',
  `activity_ids` varchar(128) DEFAULT NULL COMMENT '用户活动ids',
  `page_ids` varchar(128) DEFAULT NULL COMMENT '用户页面ids',
  `is_deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除字段',
  `power_level` tinyint(1) DEFAULT '2' COMMENT '权限等级',
  `power` varchar(255) DEFAULT NULL COMMENT '权限集合',
  `backup` varchar(255) DEFAULT NULL COMMENT '备注',
  `department` varchar(255) DEFAULT NULL COMMENT '部门',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='乐高用户表';

-- ----------------------------
-- Records of lego_user
-- ----------------------------
INSERT INTO `lego`.`lego_user` (`id`, `username`, `password`, `email`, `activity_ids`, `page_ids`, `is_deleted`, `power_level`, `power`, `backup`, `department`) VALUES ('1', 'midi', '61bbf6ebc99a7183df6f0499d66a2e22', 'midi@weilaijishi.com', NULL, NULL, '0', '1', NULL, '', NULL);

INSERT INTO `lego`.`lego_user` (`id`, `username`, `password`, `email`, `activity_ids`, `page_ids`, `is_deleted`, `power_level`, `power`, `backup`, `department`) VALUES ('2', '迷笛', '61bbf6ebc99a7183df6f0499d66a2e22', 'lixingming@weilaijishi.com', '', '', '0', '1', '', '', '');
