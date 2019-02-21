const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const Schema = mongodb.mongoose.Schema

const categoryScheme = new Schema({
  name: {
    type: String,
  },
  icon: {
    type: String,
  },
  type: {
    type: String,
  },
  sort: {
    type: Number
  },
  status: {
    type: Number,
    default: 1
  }
})

const userSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  categorys: [categoryScheme],

  // 预算
  budgetValue: {
    type: Number,
    default: 0
  },

  // 预算周期
  /* 
    0: 周
    1: 月
    2: 年
  */
  // budgetPeriod: {
  //   type: Number
  // },
})

userSchema.statics = {
  async getMoneyInfoByUser(userId) {
    console.log(await this.findById(userId).select('categorys accounts'));
    
    return await this.findById(userId).select('categorys accounts')
  }
}

// 将数据模型暴露出去
module.exports = mongoose.model('user', userSchema)
