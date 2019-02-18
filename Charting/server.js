var express = require('express');
var app = express();
var bodyParser=require('body-parser')
var cors=require('cors')
var server = app.listen(8000, function () {
    var host = server.address('http://127.0.0.1').address
    var port = server.address(8000).port
    
    console.log("Example app listening at http://127.0.0.1:8000", host, port)
 })
 app.use(bodyParser.urlencoded({ extended: false }));
 app.use(bodyParser.json())
 app.post('/',cors(),function(req,res,next){
     console.log("Request time frame from client: ",req.body)
     var begin=parseInt(req.body.b)
     var end=parseInt(req.body.e)
     exec()
     async function exec(){
        var btcprice= await rangequery('BTCchartMins','t',begin,end)
        var simPriceAct=await rangequery('BTCposition-1hr','t',begin,end)
        var myjson=await aggre(simPriceAct,btcprice)
        function aggre(simPriceAct,btcprice){
            return new Promise((res,rej)=>{
                var price=[]
                for(i=0;i<simPriceAct.length;i++){
                    if(simPriceAct[i].s==0){
                        simPriceAct[i].avgprice=0
                    }
                    simPriceAct[i].c=btcprice[i*12].c
                    price[i]=simPriceAct[i]
                }
                // console.log(price)
                res(price)
            })
        }
        console.log(myjson)
        res.send(myjson)
     }
    })
function rangequery (collectionname,index,begin,end){
    //collectionname, index=string
    //begin, end= unixtimestamp(number)s
    //if begin=100 end=110
    //we will get the data from 100 to 109
    //110 is not included.
    return new Promise((resolve,reject)=>{ 
      var MongoClient = require('mongodb').MongoClient;
      var url = "mongodb://18.221.10.144:27017/";
      var max={}
      var min={}
      max[index]=end+1  //to include the exact time, +1 is needed
      min[index]=begin  //By default, min has included the exact time, no +1 
      MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        dbo.collection(collectionname).find({}).max(max).min(min).toArray(function(err, res) {
          if (err) throw err;
          resolve(res) 
          console.log('done')
          db.close();
          });
      });
    })
  } 