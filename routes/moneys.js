const express = require("express");
const router = express.Router();
const Money = require("../models/Money");
const User = require("../models/User");
const response = require("../utils/response");

/* GET users listing. */
router.post("/createMoney", function(req, res, next) {
  const data = req.body;
  const money = new Money(data);
  // saved!
  money.save(function(err, docs) {
    console.log(docs);
    if (err) {
      res.send(response("添加账单失败", "create_money_error"));
      console.error(err);
      return;
    }
    // saved!
    res.send(response("添加账单成功"));
  });
});

router.post("/getDayMoneys", function(req, res, next) {
  const { userId, year, month, date } = req.body;
  const startDate = new Date(year, month - 1, date),
    endDate = new Date(year, month - 1, date + 1);
  const query = {
    time: { $gte: startDate.getTime(), $lt: endDate.getTime() },
    userId: userId
  };
  Money.find(query).exec(function(err, docs) {
    if (err) return res.send(response("查询账单失败", "query_money_error"));
    res.send(response("查询账单成功", docs));
  });
});

module.exports = router;
