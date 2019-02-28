const mongoose = require('mongoose')
const mongodb = require('../utils/mongodb')
const Schema = mongodb.mongoose.Schema

const accountScheme = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
  },
  value: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
  },
  // 更新时间
  updateTime: {
    type: Date,
    default: Date.now,
  },
})

accountScheme.statics = {
  /**
   * 更新账户余额
   * @method updateAccountValue
   * @param {String} [userId] 用户id
   * @param {String} [accountId] 账户id
   * @param {String} [updateValue] 改变的值，增加传正数，减少传负数
   * @return {Object} 更新前的文档
   */
  async updateAccountValue(userId, accountId, updateValue) {
    const query = {
      userId,
      _id: accountId,
    }
    return await this.findOneAndUpdate(query, { $inc: { value: updateValue } })
  },
}

// 将数据模型暴露出去
module.exports = mongoose.model('account', accountScheme)
