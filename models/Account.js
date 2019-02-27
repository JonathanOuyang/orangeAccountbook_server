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
  },
  color: {
    type: String,
  },
  value: {
    type: Number,
  },
  summary: {
    type: String,
  },
})

accountScheme.statics = {
  async changeAccountValue(userId, accountId, changeValue) {
    const query = {
      userId,
      _id: accountId,
    }
    return await this.findOneAndUpdate(query, { $inc: { value: changeValue } })
  },
}

// 将数据模型暴露出去
module.exports = mongoose.model('account', accountScheme)
