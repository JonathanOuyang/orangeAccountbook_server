const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Account = require('../models/Account')
const { response } = require('../utils/utils')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// 获取用户默认数据
function getDefaultData() {
  const outcomeCategory = [
    { name: '餐饮', icon: 'canyin' },
    { name: '购物', icon: 'gouwu' },
    { name: '服饰', icon: 'fushi' },
    { name: '交通', icon: 'jiaotong' },
    { name: '娱乐', icon: 'yule' },
    { name: '社交', icon: 'shejiao' },
    { name: '居家', icon: 'jujia' },
    { name: '通讯', icon: 'tongxun' },
    { name: '零食', icon: 'lingshi' },
    { name: '美容', icon: 'meirong' },
    { name: '运动', icon: 'yundong' },
    { name: '旅行', icon: 'lvxing' },
    { name: '数码', icon: 'shuma' },
    { name: '学习', icon: 'xuexi' },
    { name: '医疗', icon: 'yiliao' },
    { name: '书籍', icon: 'shuji' },
    { name: '宠物', icon: 'chongwu' },
    { name: '彩票', icon: 'caipiao1' },
    { name: '汽车', icon: 'qiche' },
    { name: '办公', icon: 'bangong' },
    { name: '住房', icon: 'zhufang' },
    { name: '维修', icon: 'weixiu' },
    { name: '孩子', icon: 'haizi' },
    { name: '长辈', icon: 'changbei' },
    { name: '礼物', icon: 'liwu' },
    { name: '礼金', icon: 'lijin' },
    { name: '还款', icon: 'huankuan' },
    { name: '捐赠', icon: 'juanzeng' },
  ]

  const incomeCategory = [
    { name: '理财收益', icon: 'licaishouyi' },
    { name: '兼职', icon: 'jianzhi' },
    { name: '工资', icon: 'gongzi' },
    { name: '理财', icon: 'licai' },
  ]

  const outcomes = outcomeCategory.map((item, index) => ({
    ...item,
    type: 0,
    sort: index,
    status: 0,
  }))

  const incomes = incomeCategory.map((item, index) => ({
    ...item,
    type: 1,
    sort: index,
  }))

  const accounts = [
    {
      name: '支付宝',
      color: '#43a1ee',
      value: 0,
    },
    {
      name: '微信钱包',
      color: '#45bc00',
      value: 0,
    },
    {
      name: '现金',
      color: '#b90014',
      value: 0,
    },
  ]

  return {
    categorys: [...incomes, ...outcomes],
    accounts,
  }
}

// 注册用户
router.post('/register', (req, res) => {
  //查询数据库中是否拥有邮箱
  const defaultData = getDefaultData()
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.send(response('邮箱已被占用', 'register_email_exist'))
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        categorys: defaultData.categorys,
      })
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          if (err) {
            throw err
          }
          newUser.password = hash
          newUser
            .save()
            .then(user => {
              Account.create(
                defaultData.accounts.map(item => ({
                  ...item,
                  userId: user._id,
                })),
                function(err, docs) {
                  if (err) {
                    console.log(err)
                    return res.send(response('注册账号失败', 'register_error'))
                  }
                }
              )
              res.send(response('注册账号成功'))
            })
            .catch(err => {
              res.send(response('注册账号失败', 'register_error'))
              console.log(err)
            })
        })
      })
    }
  })
})

// 用户登录
router.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  //查询数据库
  const user = await User.findOne({ email })
  if (!user) {
    return res.send(response('账号不存在', 'account_dont_exist'))
  }
  //密码匹配  使用token
  bcrypt.compare(password, user.password).then(isMatch => {
    if (isMatch) {
      const token = jwt.sign(
        {
          id: user._id,
        },
        'orange',
        { expiresIn: '2d' }
      )
      res.send(response('登录成功', 0, {}, { token: token }))
    } else {
      return res.send(response('密码错误', 'password_wrong')) //return res.status(400).json({password:"密码错误!"});
    }
  })
})

router.post('/getCategorysAndAccounts', async (req, res) => {
  try {
    const query = {
      userId: req.userInfo.id,
    }
    const categoryList = await User.getCategoryList(query.userId)
    const accountList = await Account.find(query)

    res.send(response('查询账户成功', null, { categoryList, accountList }))
  } catch (error) {
    console.log(err)
    return res.send(response('查询账户失败', 'query_error'))
  }
})

module.exports = router
