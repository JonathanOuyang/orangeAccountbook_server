/**
 * 返回接口响应数据
 * @method response
 * @param {String} [summary] 响应说明
 * @param {String} [code] 响应码, 默认值: "success"
 * @param {String} [data] 响应的真正数据
 * @return {Object} 响应内容
 */
module.exports = (summary, code, data = {}, others={}) => ({
  code: code || "success",
  summary,
  data,
  ...others
});
