const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Account = require('../models/Account')
const { response } = require('../utils/utils')

// 增加账户
router.post('/addAccount', (req, res) => {
  const data = {
    userId: req.userInfo.id,
    ...req.body,
  }
  const newAccount = new Account(data)

  newAccount.save(function(err, doc) {
    if (err) {
      res.send(response('添加账户失败', 'add_money_error'))
      console.error(err)
      return
    }
    res.send(response('添加账户成功'))
  })
})

// 编辑账户
router.post('/updateAccount', (req, res) => {
  const data = req.body
  Account.findOneAndUpdate(
    { _id: data.accountId, userId: req.userInfo.id },
    { ...data, updateTime: new Date() },
    function(err, docs) {
      console.log(docs)
      if (err) {
        res.send(response('编辑账户失败', 'update_account_error'))
        console.error(err)
        return
      } else if (!docs) {
        return res.send(response('找不到账户', 'account_not_found'))
      }
      // saved!
      return res.send(response('编辑账户成功'))
    }
  )
})

// 删除账户
router.post('/deleteAccount', (req, res) => {
  Account.findOneAndDelete({
    userId: req.userInfo.id,
    _id: req.body.accountId,
  }).exex(function(err, docs) {
    if (err) {
      res.send(response('删除账户失败', 'delete_account_error'))
      console.error(err)
      return
    }
  })
})

// 查询账户列表
router.post('/getAccountList', (req, res) => {
  const query = {
    userId: req.userInfo.id,
  }
  const accountId = req.body.accountId
  if (accountId) {
    query._id = accountId
    Account.findOne(query, function(err, docs) {
      if (err) {
        console.log(err)
        return res.send(response('查询账户失败', 'query_money_error'))
      }
      return res.send(response('查询账户成功', null, { detail: docs }))
    })
  } else {
    Account.find(query, function(err, docs) {
      if (err) {
        console.log(err)
        return res.send(response('查询账户失败', 'query_money_error'))
      }
      return res.send(response('查询账户成功', null, { list: docs }))
    })
  }
})

module.exports = router
