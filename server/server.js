
let ws=require("nodejs-websocket")
var model =require('../modules/db')
// Create initial document then fire callback



    // Create a web server to serve files and listen to WebSocket connections
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
                    db.collection("article").updateOne({textno:data.title},{$set:{textno:data.title,            //更新article中的文章
                            content:data.contents}},function (err,ret) {
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

                    data.datas.ops.map(function (item,index) {                          //把所有的数据和对应的作者id全部push到nums和authors数组之中
                        if(item.insert[0]!=="\n"){
                            nums.push(item.insert.length)
                            console.log(item.insert.length)
                            authors.push(item.attributes.author)
                            console.log(item.attributes.author)
                        }
                    })
                    console.log(authors)
                    console.log(nums)
                    // console.log(data.title)
                    var finalauthors=[]   //原本作者的排列顺序
                    var finalnums=[]      //最终的数量
                    db.collection("dataarrays").find({textno:data.title}).toArray(function (err,ret) {
                        if(err){
                            console.log("查找出错了")
                        }else{
                            finalauthors=ret[0].authors
                            for(var i=0;i<ret[0].authors.length;i++){
                                finalnums.push(0)
                            }
                            for(var i =0;i<authors.length;i++){                                                      //把所有的数据全部按照固定的顺序理出来
                                for(var j=0;j<finalauthors.length;j++){
                                    if(authors[i]==finalauthors[j]){
                                        finalnums[j]=finalnums[j]+nums[i];
                                        flags=1;
                                    }
                                }
                            }

                            db.collection("dataarrays").updateOne({textno:data.title},{$set:{contributions:finalnums}},function (err,ret) {
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
                    })
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

