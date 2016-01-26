# koa-ueditor
基于koajs的ueditor

支持 图片 和 文件的上传

#### 安装
`npm install koa-ueditor --save`

#### 使用


 ueditor的web端配置请参考[官网](http://ueditor.baidu.com/website/)

 将`example/public`下的ueditor文件夹整个拷贝到项目的静态资源文件夹根目录下如`静态资源文件夹/ueditor`

 使用样例饿
 ```
 var route = require('koa-router')();
 var views = require('co-views');
 var serve = require('koa-static');


 //模板。静态资源
 var render = views('views', {
     map: { html: 'ejs' }
 });

 var staticsPath = 'public';//静态资源路径
 app.use(serve(staticsPath));//设置静态资源路径
 var ueditor = require('koa-ueditor')(staticsPath);//配置ueditor
 route.all('/ueditor/ue', ueditor);



 route.get('/', function *(){
     this.body = yield render("ueditor");
 });
 ```




#### 邮箱


 550281353@qq.com