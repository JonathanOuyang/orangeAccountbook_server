const mongoose = require("mongoose");
const mongodb = require("../utils/mongodb");
const Schema = mongodb.mongoose.Schema;

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
  
  categorys: {
    name: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },

  accounts: {
    name: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    }
  }
});

// 将数据模型暴露出去
module.exports = mongoose.model("user", userSchema);
