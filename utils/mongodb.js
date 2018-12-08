const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/pomegranate");
const db = mongoose.connection;

// 连接成功
db.on("open", function() {
  console.log("MongoDB 连接成功");
});
// 连接失败
db.on("error", function() {
  console.log("MongoDB 连接失败");
});

exports.mongoose = mongoose;
