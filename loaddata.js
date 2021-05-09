const db = require('./DB/NeDB');
db.channel.insert({channelName:"Hội quẩy",username:"channel2",password:"channel2",image:"/imageAsset/default.png"},function (err, newDoc) {}
);
db.channel.insert({channelName:"Kênh HỌC TẬP",username:"channel3",password:"channel3",image:"/imageAsset/default.png"}
,function (err, newDoc) {});
