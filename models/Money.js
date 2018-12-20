const mongoose = require("mongoose");
const mongodb = require("../utils/mongodb");
const Schema = mongodb.mongoose.Schema;

const moneySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
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
    // required: true
  },
  // 产生时间
  time: {
    type: Date,
    default: Date.now
  },
  // 备注
  note: {
    type: String
  }
});

moneySchema.index({ userId: 1 });

// 将数据模型暴露出去
module.exports = mongoose.model("money", moneySchema);
