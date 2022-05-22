var MongoClient = require("mongodb").MongoClient;
var db_url = "arn:aws:ec2:us-east-1:117632986068:vpc-peering-connection/pcx-08c8ab367f1f1186b";

MongoClient.connect(db_url, function (err, db) {
  if (err) throw err;
  console.log("数据库已创建!");
  db.close();
});

async function getdata(uname) {
  var hasUser = null;
  MongoClient.connect(db_url).then((conn) => {
    var userdb = conn.db("main").collection("user_data");
    var whereStr = { username: uname }; // 查询条件

    userdb.find(whereStr).toArray(function (err, results) {
      if (err) throw err;
      if (results.length == 0) {
       
        console.log("沒有指定用戶");

        let newUser = {
          id: results.length,
          username: uname,
        };
        
        userdb.insertOne(newUser, function (err, res) {
          if (err) throw err;
        });
        console.log("文档插入成功");
        hasUser = false;
      
      }else{
        hasUser = true;
      }
    
    });
    
  });
  
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(hasUser), 1000)
  });

  let result = await promise;
  return result;
}

module.exports = { getdata };
