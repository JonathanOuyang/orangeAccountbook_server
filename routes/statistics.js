const express = require('express')
const router = express.Router()
const Money = require('../models/Money')
const Account = require('../models/Account')
const User = require('../models/User')
const { response, getQuery, docsToObject } = require('../utils/utils')

router.post('/getMoneySum', async (req, res, next) => {
  try {
    const userId = req.userInfo.id
    const searchValue = req.body.searchValue || {}
    const groupOptions = req.body.groupOptions || {}
    const groupParams = { type: '$type' }
    const sort = req.body.sort || -1
    const sortParams = {}
    const projectParams = { type: '$type', value: '$value' }
    const data = {}

    if (groupOptions.accountId == 1) {
      groupParams.accountId = '$accountId'
      projectParams.accountId = '$accountId'
      data.accounts = await docsToObject(Account.find({ userId }))
      sortParams.value = sort
    }

    if (groupOptions.categoryId == 1) {
      groupParams.categoryId = '$categoryId'
      projectParams.categoryId = '$categoryId'
      data.categorys = docsToObject([
        ...(await User.findById(userId).select('categorys')).categorys,
      ])
      sortParams.value = sort
    }

    if(groupOptions.day == 1) {
      groupParams.day = '$day'
      projectParams.day = { $dateToString: { format: "%Y-%m-%d", date: "$moneyTime" }}
      sortParams.day = sort;
    }

    data.result = await Money.aggregate([
      // {
      //   $lookup: {
      //     from: 'accounts',
      //     localField: 'accountId',
      //     foreignField: '_id',
      //     as: 'accounts'
      //   },
      // },
      { $match: getQuery(searchValue, userId) },
      { $project: projectParams },
      { $group: { _id: groupParams, value: { $sum: '$value' } } },
      { $sort: sortParams },
    ])
    return res.send(response('查询成功', null, data))
  } catch (error) {
    console.log('error: ', error)
    return res.send(response('查询失败', 'query_error'))
  }
})

module.exports = router
