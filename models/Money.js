const mongoose = require("mongoose");
const mongodb = require("../utils/mongodb");
const Schema = mongodb.mongoose.Schema;

const moneySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
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
  type: {
    type: Number,
    required: true
  },
  // 分类
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: "categorys",
    required: true
  },
  // 账户
  accountId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // 更新时间
  updateTime: {
    type: Date,
    default: Date.now
  },
  moneyTime: {
    type: Date
  },
  // 备注
  note: {
    type: String
  }
});

moneySchema.index({ userId: 1 });

// 将数据模型暴露出去
module.exports = mongoose.model("money", moneySchema);
