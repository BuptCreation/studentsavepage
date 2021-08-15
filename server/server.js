
let ws=require("nodejs-websocket")
var model =require('../modules/db')
// Create initial document then fire callback



    // Create a web server to serve files and listen to WebSocket connections
    let app = express();
    app.use(express.static('static'));

    var server=ws.createServer(
        function (conn) {
            conn.on('close',function () {

            })
            conn.on('text',function (str) {
                var data=JSON.parse(str)
                console.log(data)
                var dataarrays=[]
                model.connect(function (db,client) {
                    let flags1=0;
                    let flags2=0;
                    db.collection("article").updateOne({textno:data.title},{$set:{textno:data.title,content:data.contents}},function (err,ret) {
                        if(err){
                            console.log("更新出错！",err)
                            flags1=1;
                        }else{
                            conn.sendText("更新成功！");
                            flags1=1;
                        }
                    })

                    var nums=[]             //用来记录指标
                    var authors=[]          //用来记录作者

                    data.datas.ops.map(function (item,index) {
                        if(item.insert[0]!=="\n"){
                            nums.push(item.insert.length)
                            console.log(item.insert.length)
                            authors.push(item.attributes.author)
                            console.log(item.attributes.author)
                        }
                    })
                    console.log(authors)
                    console.log(nums)
                    console.log(data.title)
                    for (var i=0;i<authors.length;i++){
                        db.collection("dataarrays").updateOne({textno:data.title},{$set:{authors:authors,contributions:nums}},function (err,ret) {
                        if(err){
                            console.log("更新失败！",err)
                        }else{
                            console.log("dataarrays更新成功！")
                            if(i===authors.length-1){
                                flags2=1;
                            }
                        }
                        })
                    }
                    if(flags1&flags2==1){
                        client.close()
                    }
                })
            })
            conn.on('err',function (err,reason) {
                console.log(err)
            })
            conn.on('close',function (err,reason) {
                console.log("链接已经断开！",err,reason)
            })
        }
    ).listen(3334)

    console.log('Listening on http://localhost:3334');

