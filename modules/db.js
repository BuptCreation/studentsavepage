var mongdbclient=require("mongodb").MongoClient;
var url="mongodb://47.94.108.20:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false"
var dbname="littleterm"

// var url="mongodb://localhost:27017"
// var dbname="finally"


function connect(callback) {
    mongdbclient.connect(url, { useUnifiedTopology: true },function (err,client) {
        if(err){
            console.log("链接数据库失败！")
        }else{
            console.log("连接数据库成功")
            var db=client.db(dbname);
            callback&callback(db,client);
        }
    })
}


module.exports = {
    connect
}