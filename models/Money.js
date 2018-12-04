var mongoose = require("mongoose");
var mongodb = require("./mongodb");
var Schema = mongodb.mongoose.Schema;

var UserSchema = new Schema({
  //金额
  value: {
    type: String,
    required: true
  },
  // 去向
  /* 
    0: 支出
    1: 收入
    2: 转账 
  */
  whereabouts: {
    type: Number,
    required: true
  },
  // 分类
  type: {
    type: Number,
    required: true
  },
  // 账户
  account: {
    type: Number,
    required: true
  },
  // 产生时间
  time: {
    type: Date,
    require: true
  },
  // 备注
  note: {
    type: String
  }
});

// 将数据模型暴露出去
module.exports = mongoose.model("students", studentSchema);
