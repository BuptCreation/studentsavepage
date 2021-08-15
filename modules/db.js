var mongdbclient=require("mongodb").MongoClient;
var url="mongodb://localhost:27017"
var dbname="finally"

function connect(callback) {
    mongdbclient.connect(url, { useUnifiedTopology: true },function (err,client) {
        if(err){
            console.log("链接数据库失败！")
        }else{
            var db=client.db(dbname);
            callback&callback(db,client);
        }
    })
}


module.exports = {
    connect
}