const express = require('express')
const router = express.Router()
const Money = require('../models/Money')
const User = require('../models/User')
const Account = require('../models/Account')
const { response } = require('../utils/utils')
const Mock = require('mockjs')
const Moment = require('moment')

router.post('/addMoney', async function(req, res, next) {
  try {
    const data = req.body
    data.userId = req.userInfo.id

    const money = new Money(data)
    let mockDataTime = {}
    mockDataTime[
      'moneyTime|' +
        (new Date().getTime() - 2592000000) +
        '-' +
        new Date().getTime()
    ] = new Date().getTime()
    const mockData = Mock.mock({
      'array|100': [
        {
          'value|1-100': 240,
          userId: data.userId,
          'type|0-1': 1,
          'categoryId|1': [
            '5c7028d51298202b1c4a3712',
            '5c7028d51298202b1c4a3711',
            '5c7028d51298202b1c4a370f',
            '5c7028d51298202b1c4a370e',
            '5c7028d51298202b1c4a370c',
          ],
          'accountId|1': [
            '5c7028d61298202b1c4a3717',
            '5c7028d61298202b1c4a3718',
            '5c7028d61298202b1c4a3719',
          ],
          ...mockDataTime,
        },
      ],
    })
    if (data.test) {
      mockData.array.forEach(item => {
        let mockMoney = new Money(item)
        mockMoney.save(function(err, docs) {
          if (err) {
            console.error(err)
            return res.send(response('mock账单数据失败', 'add_money_error'))
          }
        })
      })
      return res.send(response('mock账单数据成功'))
    }

    const newMoney = await money.save()
    await Account.updateAccountValue(
      data.userId,
      data.accountId,
      data.type ? data.value : -data.value
    )
    return res.send(response('添加账单成功'))
  } catch (error) {
    console.error(error)
    return res.send(response('添加账单失败', 'add_money_error'))
  }
})

// 更新账单
router.post('/updateMoney', async function(req, res, next) {
  try {
    const newMoney = req.body
    const oldMoney = await Money.findOneAndUpdate(
      { _id: newMoney.moneyId, userId: req.userInfo.id },
      { ...newMoney, updateTime: new Date() }
    )
    if (!oldMoney) {
      return res.send(response('找不到账单', 'money_not_found'))
    }
    await Account.updateAccountValue(
      req.userInfo.id,
      oldMoney.accountId,
      oldMoney.type ? -oldMoney.value : oldMoney.value
    )
    await Account.updateAccountValue(
      req.userInfo.id,
      newMoney.accountId,
      newMoney.type ? newMoney.value : -newMoney.value
    )
    return res.send(response('编辑账单成功'))
  } catch (error) {
    res.send(response('编辑账单失败', 'update_money_error'))
    console.error(error)
    return
  }
})

// 删除账单
router.post('/deleteMoney', async function(req, res, next) {
  try {
        const moneyId = req.body.moneyId;
        // saved!
        // await Money.deleteMany({
        //   _id: { $in: moneyId.split(',') },
        //   userId: req.userInfo.id,
        // })
        const data = await Money.findOneAndRemove({
          _id: { $in: moneyId.split(',') },
          userId: req.userInfo.id,
        })
        await Account.updateAccountValue(
          req.userInfo.id,
          data.accountId,
          data.type ? -data.value : data.value
        );
        res.send(response("删除账单成功"));
      } catch (error) {
    res.send(response('删除账单失败', 'delete_money_error'))
    console.error(error)
    return
  }
})

// 查询账单列表
router.post('/searchMoneyList', async function(req, res, next) {
  try {
    const searchValue = req.body.searchValue || {}
    const sortOption = req.body.sortOption || {}
    const pageSize = Number(req.body.pageSize)
    const page = Number(req.body.page)
    const query = {
      userId: req.userInfo.id,
    }

    if (
      searchValue.moneyTimeStart !== undefined &&
      searchValue.moneyTimeStart !== undefined
    ) {
      query.moneyTime = {
        $gte: new Date(searchValue.moneyTimeStart).getTime(),
        $lt: new Date(searchValue.moneyTimeEnd).getTime(),
      }
    } else if (searchValue.moneyTimeStart !== undefined) {
      query.moneyTime = {
        $gte: new Date(searchValue.moneyTimeStart).getTime(),
      }
    } else if (searchValue.moneyTimeEnd !== undefined) {
      query.moneyTime = {
        $lt: new Date(searchValue.moneyTimeEnd).getTime(),
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
      (query.categoryId = searchValue.categoryId)

    searchValue.accountId !== undefined &&
      (query.accountId = searchValue.accountId)

    searchValue.note !== undefined &&
      (query.note = new RegExp(`.*${searchValue.note}.*`, 'im'))

    const count = await Money.countDocuments(query)
    const maxPage = Math.floor(count / pageSize) + 1
    const currPage = maxPage < page ? maxPage : page

    const moneys = await Money.find(query)
      .sort(sortOption)
      .skip((currPage - 1) * pageSize)
      .limit(pageSize)

    const list = []
    let incomeSum = 0,
      outcomeSum = 0
    for (const item of moneys) {
      const category = await User.getCategoryById(item.userId, item.categoryId)
      const account = await Account.findOne({
        userId: query.userId,
        _id: item.accountId,
      })
      const money = {
        _id: item._id,
        value: item.value,
        userId: item.userId,
        type: item.type,
        category: {
          _id: category._id,
          name: category.name,
          icon: category.icon,
        },
        account: account
          ? {
              _id: account._id,
              name: account.name,
            }
          : {
              name: '[已删除账户]',
            },
        moneyTime: item.moneyTime,
        note: item.note,
        updateTime: item.updateTime,
      }
      if (item.type == 0) {
        outcomeSum += item.value
      } else if (item.type == 1) {
        incomeSum += item.value
      }
      list.push(money)
    }

    return res.send(
      response('查询账单成功', null, {
        list,
        incomeSum,
        outcomeSum,
        currPage,
        maxPage,
        pageSize,
      })
    )
  } catch (err) {
    console.error(err)
    return res.send(response('查询账单失败', 'query_money_error'))
  }
})

router.post('/getMoneyDetail', async function(req, res, next) {
  try {
    const query = {
      userId: req.userInfo.id,
      _id: req.body.moneyId,
    }
    const doc = await Money.findOne(query)
    const category = await User.getCategoryById(doc.userId, doc.categoryId)
    const account = await Account.findOne({
      userId: query.userId,
      _id: doc.accountId,
    })
    return res.send(
      response('查询账单成功', null, {
        detail: doc,
        category: {
          _id: category._id,
          name: category.name,
          icon: category.icon,
        },
        account: {
          _id: account._id,
          name: account.name,
        },
      })
    )
  } catch (err) {
    console.error(err)
    return res.send(response('查询账单失败', 'query_money_error'))
  }
})

router.post('/getMoneySum', function(req, res, next) {
  const searchValue = req.body.searchValue || {}
  const query = {
    userId: req.userInfo.id,
  }

  if (
    searchValue.moneyTimeStart !== undefined &&
    searchValue.moneyTimeStart !== undefined
  ) {
    query.moneyTime = {
      $gte: new Date(searchValue.moneyTimeStart).getTime(),
      $lt: new Date(searchValue.moneyTimeEnd).getTime(),
    }
  } else if (searchValue.moneyTimeStart !== undefined) {
    query.moneyTime = {
      $gte: new Date(searchValue.moneyTimeStart).getTime(),
    }
  } else if (searchValue.moneyTimeEnd !== undefined) {
    query.moneyTime = {
      $lt: new Date(searchValue.moneyTimeEnd).getTime(),
    }
  }

  searchValue.categoryId !== undefined &&
    (query.categoryId = searchValue.categoryId)

  searchValue.accountId !== undefined &&
    (query.accountId = searchValue.accountId)

  Money.find(query).exec((err, docs) => {
    let income = 0,
      outcome = 0
    if (err) {
      console.error(err)
      return res.send(response('查询账单失败', 'query_error'))
    }
    docs.forEach(item => {
      if (item.type == 0) {
        outcome += Number(item.value)
      } else if (item.type == 1) {
        income += Number(item.value)
      }
    })
    return res.send(
      response('查询账单成功', null, {
        outcomeSum: outcome,
        incomeSum: income,
      })
    )
  })
})

router.post('/getCalendarInfo', function(req, res, next) {
  const daysHasMoney = []
  const { year, month } = req.body
  const date = Moment(new Date(`${year}-${month}-1`))
  const query = {
    userId: req.userInfo.id,
  }
  Money.find({
    ...query,
    moneyTime: {
      $gte: date.valueOf(),
      $lt: date.endOf('month').valueOf(),
    },
  })
    .sort({ moneyTime: 1 })
    .exec(function(err, docs) {
      if (err) {
        console.error(err)
        return res.send(response('查询账单失败', 'query_money_error'))
      }
      docs.forEach(item => {
        const dateStr = Moment(item.moneyTime).format('YYYY-MM-DD')
        if (
          daysHasMoney[daysHasMoney.length - 1] != dateStr ||
          daysHasMoney.length == 0
        ) {
          daysHasMoney.push(dateStr)
        }
      })
      return res.send(
        response('查询账单成功', null, {
          calendarInfo: daysHasMoney,
        })
      )
    })
})

module.exports = router
