/**
 * Created by weijianli on 15/12/11.
 */


var serve = require('koa-static');
var koa = require('koa');
var app = koa();
var route = require('koa-router')();
var parse = require('co-body');
var views = require('co-views');
var co = require("co");

var thunkify = require('thunkify');

//模板。静态资源
var render = views('views', {
    map: { html: 'ejs' }
});

app.use(serve('public'));

var ueditor = require('../index.js')("public");
route.all('/ueditor/ue', ueditor);



route.get('/', function *(){
    this.body = yield render("ueditor");
});
app.use(route.routes())
    .use(route.allowedMethods());
app.listen('4000');

console.log('listening on port :4000');

