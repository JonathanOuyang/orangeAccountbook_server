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
    type: Number,
  },
  status: {
    type: Number,
    default: 1,
  },
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
    default: 0,
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
  /**
   * 获取分类列表
   * @method updateAccountValue
   * @param {String} [userId] 用户id
   * @return {array} 分类列表
   */
  async getCategoryList(userId) {
    return await this.findById(userId).select('categorys')
  },

  /**
   * 获取指定的分类详情
   * @method updateAccountValue
   * @param {String} [userId] 用户id
   * @param {String} [id] 分类id
   * @return {object} 分类详情
   */
  async getCategoryById(userId, id) {
    const user = await this.findById(userId)
    return user.categorys.id(id)
  },
}

// 将数据模型暴露出去
module.exports = mongoose.model('user', userSchema)
