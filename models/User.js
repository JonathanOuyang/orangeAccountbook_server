const mongoose = require("mongoose");
const mongodb = require("../utils/mongodb");
const Schema = mongodb.mongoose.Schema;
const moneySchema = require("../models/Money");
const Type = require("../models/Type");

// 声明一个数据集 对象
const userSchema = new Schema({
  name: {
    type: String
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  moneys: [moneySchema],
  types: {
      type: String
  }
});

// 将数据模型暴露出去
module.exports = mongoose.model('user', userSchema);