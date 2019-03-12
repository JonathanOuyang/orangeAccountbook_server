const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

/**
 * 返回接口响应数据
 * @method response
 * @param {String} [summary] 响应说明
 * @param {String} [code] 响应码, 默认值: "success"
 * @param {String} [data] 响应的真正数据
 * @param {String} [others] 其他数据
 * @return {Object} 响应内容
 */
const response = (summary, code, data = {}, others = {}) => ({
  code: code || 'success',
  summary,
  data,
  ...others,
})

/**
 * 返回接口响应数据
 * @method docsToObject
 * @param {Array} [docs] 查询回调的文档
 * @return {Object} 以document的_id作为key值的Object
 */
const docsToObject = docs => {
  const obj = {}
  docs.map(item => {
    obj[item._id] = item
  })
  return obj
}

const getQuery = (searchValue, userId) => {
  const query = { userId: ObjectId(userId) }
  if (
    searchValue.moneyTimeStart !== undefined &&
    searchValue.moneyTimeStart !== undefined
  ) {
    query.moneyTime = {
      $gte: new Date(searchValue.moneyTimeStart),
      $lt: new Date(searchValue.moneyTimeEnd),
    }
  } else if (searchValue.moneyTimeStart !== undefined) {
    query.moneyTime = {
      $gte: new Date(searchValue.moneyTimeStart),
    }
  } else if (searchValue.moneyTimeEnd !== undefined) {
    query.moneyTime = {
      $lt: new Date(searchValue.moneyTimeEnd),
    }
  }

  if (
    searchValue.minValue !== undefined &&
    searchValue.maxValue !== undefined
  ) {
    query.value = {
      $gte: searchValue.minValue,
      $lte: searchValue.maxValue,
    }
  } else if (searchValue.minValue !== undefined) {
    query.value = {
      $gte: searchValue.minValue,
    }
  } else if (searchValue.maxValue !== undefined) {
    query.value = {
      $lte: searchValue.maxValue,
    }
  }

  searchValue.type !== undefined && (query.type = searchValue.type)

  searchValue.categoryId !== undefined &&
    (query.categoryId = ObjectId(searchValue.categoryId))

  searchValue.accountId !== undefined &&
    (query.accountId = ObjectId(searchValue.accountId))

  searchValue.note !== undefined &&
    (query.note = new RegExp(`.*${searchValue.note}.*`, 'im'))
  return query
}

module.exports = { response, docsToObject, getQuery }
