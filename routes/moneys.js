const express = require("express");
const router = express.Router();
const Money = require("../models/Money");
const User = require("../models/User");
const response = require("../utils/response");

/* GET users listing. */
router.post("/addMoney", function(req, res, next) {
  const data = req.body;
  const money = new Money(data);
  // saved!
  money.save(function(err, docs) {
    console.log(docs);
    if (err) {
      res.send(response("添加账单失败", "add_money_error"));
      console.error(err);
      return;
    }
    // saved!
    res.send(response("添加账单成功"));
  });
});

router.post("/updateMoney", function(req, res, next) {
  const data = req.body;
  // saved!
  Money.findByIdAndUpdate(data.moneyId, {...data, updateTime: new Date()}, function(err, docs) {
    console.log(docs);
    if (err) {
      res.send(response("编辑账单失败", "add_money_error"));
      console.error(err);
      return;
    }
    // saved!
    res.send(response("编辑账单成功"));
  });
});

router.post("/deleteMoney", function(req, res, next) {
  const moneyId = req.body.moneyId;
  // saved!
  Money.deleteMany({_id: {$in: moneyId.split(",")}}, function(err, docs) {
    console.log(docs);
    if (err) {
      res.send(response("删除账单失败", "add_money_error"));
      console.error(err);
      return;
    }
    // saved!
    res.send(response("删除账单成功"));
  });
});

router.post("/searchMoneyList", function(req, res, next) {
  const searchValue = req.data.searchValue;
  const query = {
    moneyTime: { $gte: startDate.getTime(), $lt: endDate.getTime() },
    userId: userId
  };
  Money.find(query).exec(function(err, docs) {
    if (err) return res.send(response("查询账单失败", {}, "query_money_error"));
    res.send(response("查询账单成功", docs));
  });
});

module.exports = router;
