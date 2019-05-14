# a_simplefilmdb



1552729 李依璇



# 项目地址

http://39.108.116.254:8080 勿用IE打开



# 技术栈

vue 前端  {webpack模板项目 (element-ui)}

express 后端 (mongoose,body-parser,express)

mongodb 数据库 (studio 3T)

ubuntu 16.04 LTS 系统 {配置 node.js环境}



# 功能概述





## 分页概要

使用element-ui分页组件，使用vue的修饰符sync解决组件的current-page prop在点击事件外部修改，无法响应更新的问题。

使用element-ui的评分组件，使用自渲染评分，加上传给组件均评分的一半，来解决组件的max prop最大值无法超过5的问题。

<img src="E:/GitHub/WEB/a_simplefilm/imgs/img1.PNG">



## 电影名搜索

在当前选中类别下搜索电影名，包含别名。用户输入关键字，**按回车或者点击搜索按钮**，即可模糊查找，查询返回前搜索按钮禁用。分页组件根据返回结果数实时变化。若搜索输入为空，默认页面重置数据，显示“所有”第一页。

<img src="E:/GitHub/WEB/a_simplefilm/imgs/img2.png">



<img src="E:/GitHub/WEB/a_simplefilm/imgs/img3.png">

## 电影详情

点击imdb可跳转前往。点击浏览器的后退键，回到之前的浏览状态，也就是页面的数据状态不变。

<img src="E:/GitHub/WEB/a_simplefilm/imgs/img4.png">







## 电影类别

页面创建时，按照各类别逆序渲染生成标签页栏，切换后分页组件实时变化。

<img src="E:/GitHub/WEB/a_simplefilm/imgs/img5.PNG">







## 异步加载

添加两个拦截器，使用element-ui的loading组件。每次首页点击有loading交互，loading是单例的缘故，使用计数变量来控制单例loading服务在下次使用前先被关闭。

![](E:\GitHub\WEB\a_simplefilm_db\imgs\loading.png)





# Reference

https://blog.csdn.net/z_xuewen/article/details/85264653 回车搜索

https://www.jianshu.com/p/d1ccef6d8c58 返回保持页面状态

https://juejin.im/post/5c6eaa615188255cf64b26bb添加路由拦截，实现axios请求loading效果