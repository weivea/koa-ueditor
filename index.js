/**
 * Created by weijianli on 16/1/26.
 */
"use strict";
var path = require("path");
var fs = require('fs');
var thunkify = require('thunkify');
var parse = require('co-busboy');
var static_path = path.join(process.cwd(),'public');
var img_type = '.jpg .png .gif .ico .bmp .jpeg';
var img_path = '/ueditor/upload/img';
var files_path = '/ueditor/upload/file';

function *ueditor(next){

    if (this.query.action === 'config') {
        this.set("Content-Type","json");
        this.redirect("/ueditor/nodejs/config.json");
    }else if(this.query.action === 'listimage'){
        this.body = yield ue_pic_list(img_path, this.query.start, this.query.size);
    }else if(this.query.action === 'listfile'){
        this.body = yield ue_pic_list(files_path, this.query.start, this.query.size);
    }else if(this.query.action === 'uploadimage' || this.query.action === 'uploadfile'){
        var parts = parse(this);
        var part;
        var stream;
        var tmp_name;
        var file_path;
        var filename;
        while (part = yield parts) {
            if (part.length) {
                // fields are returned as arrays
                var key = part[0];
                var value = part[1];
                // check the CSRF token
                //if (key === '_csrf') this.assertCSRF(value);
            } else {
                // files are returned as readable streams
                // let's just save them to disk

                if(this.query.action === 'uploadimage' && img_type.indexOf(path.extname(part.filename)) >= 0 ){
                    filename = 'pic_'+(new Date()).getTime()+'_'+part.filename;
                    file_path = path.join(img_path, filename);
                }else if (this.query.action === 'uploadfile'){
                    filename = 'file_'+(new Date()).getTime()+'_'+part.filename;
                    file_path = path.join(files_path, filename);
                }

                stream = fs.createWriteStream(path.join(static_path,file_path));
                part.pipe(stream);
                console.log('uploading %s -> %s', part.filename, stream.path);
                tmp_name = part.filename;
            }
        }
        this.body = {
            'url': file_path,
            'title': filename,
            'original': tmp_name,
            'state': 'SUCCESS'
        }
    }else{
        this.body = {
            'state': 'FAIL'
        };
    }


}


function *ue_pic_list(list_dir,start,size){
    var list = [];
    var files = yield thunkify(fs.readdir)(path.join(static_path,list_dir));
    for(var i in files ){
        if(i >= start && i < (parseInt(start)+parseInt(size))){
            var file = files[i];
            //if(file_type.indexOf(path.extname(file)) >= 0 ){
            list.push({url:path.join('/',list_dir,file)});
            //}
        }
    }
    return {
        "state": "SUCCESS",
        "list": list,
        "start": start,
        "total": files.length
    }
}

module.exports = function(staticPath){
    if(staticPath){
        static_path = path.join(process.cwd(),staticPath);
    }
    return ueditor;
};