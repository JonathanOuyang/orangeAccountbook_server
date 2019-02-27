const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { response } = require('../utils/utils')

// 查询分类
router.post('/getCategoryList', (req, res) => {
  const query = {
    userId: req.userInfo.id,
  }
  User.findById(query.userId, function(err, doc) {
    if (err) {
      console.log(err)
      return res.send(response('查询分类失败', 'query_category_error'))
    }
    return res.send(response('查询分类成功', null, { list: doc.categorys }))
  }).select('categorys')
})

module.exports = router