/**
 * 返回接口响应数据
 * @method response
 * @param {String} [summary] 响应说明
 * @param {String} [code] 响应码, 默认值: "success"
 * @param {String} [data] 响应的真正数据
 * @param {String} [others] 其他数据
 * @return {Object} 响应内容
 */
const response = (summary, code, data = {}, others={}) => ({
  code: code || "success",
  summary,
  data,
  ...others
});


/**
 * 返回接口响应数据
 * @method docsToObject
 * @param {Array} [docs] 查询回调的文档
 * @return {Object} 以document的_id作为key值的Object
 */
const docsToObject = (docs) => {
  const obj = {};
  docs.map(item => {
    obj[item._id] = item
  })
  return obj
}

module.exports = {response, docsToObject}