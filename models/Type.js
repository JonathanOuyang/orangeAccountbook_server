var mongoose = require("mongoose");
var mongodb = require("./mongodb");
var Schema = mongodb.mongoose.Schema;

// 声明一个数据集 对象
var TypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  whereabouts: {
    type: String,
    required: true
  }
});

// 将数据模型暴露出去
module.exports = mongoose.model("students", studentSchema);
