一、项目描述：
    该项目是一个云平台工单管理系统的仿写项目，包括使用者个人信息，施工人员，工程工单等主要模块，使用了Vue全家桶，webpack，ES，node，express，mongodb等技术，创建了这个前后台分离的项目。
    
二、项目功能：（部分功能可参照demoPic里的截图）
    1.首页使用V-chart插件展示工单数据
    2.个人重心主要包括头像、个人信息、密码的设置与修改
    3.施工人员主要包括创建、查看、编辑、删除等功能
    4.施工工单功能同上，工单的创建根据工种选择不同的施工人员，另外还有搜索查找的功能，每个账号可以根据任意项查找各自创建的工单，vip账户可以查找数据库任意工单
    
三、补充说明：
    1.该项目仿写自某通讯工程公司的工单管理系统，考虑到体量和展示方式，部分功能有所改动
    2.js部分，大部分写法会顾及到性能优化，css使用了stylus预编译，但没有使用插件直接生成样式
    3.后端项目使用mongodb数据库，并使用node+express对数据进行增删改查，前端api使用axios进行异步请求，并在组件中用vuex进行全局数据的管理
