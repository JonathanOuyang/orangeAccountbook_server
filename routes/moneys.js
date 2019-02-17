const express = require("express");
const router = express.Router();
const Money = require("../models/Money");
const User = require("../models/User");
const response = require("../utils/response");

/* GET users listing. */
router.post("/addMoney", function(req, res, next) {
  const data = req.body;
  data.userId = req.userInfo.id;

  const money = new Money(data);
  // saved!
  money.save(function(err, docs) {
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
  Money.findOneAndUpdate(
    { _id: data.moneyId, userId: req.userInfo.id },
    { ...data, updateTime: new Date() },
    function(err, docs) {
      console.log(docs);
      if (err) {
        res.send(response("编辑账单失败", "update_money_error"));
        console.error(err);
        return;
      } else if (docs) {
        return res.send(response("找不到账单", "money_not_found"));
      }
      // saved!
      return res.send(response("编辑账单成功"));
    }
  );
});

router.post("/deleteMoney", function(req, res, next) {
  const moneyId = req.body.moneyId;
  // saved!
  Money.deleteMany(
    { _id: { $in: moneyId.split(",") }, userId: req.userInfo.id },
    function(err, docs) {
      console.log(docs);
      if (err) {
        res.send(response("删除账单失败", "delete_money_error"));
        console.error(err);
        return;
      }
      // saved!
      res.send(response("删除账单成功"));
    }
  );
});

router.post("/searchMoneyList", function(req, res, next) {
  const searchValue = req.body.searchValue || {};

  const pageSize = Number(req.body.pageSize);
  const page = Number(req.body.page);
  const query = {
    userId: req.userInfo.id
  };
  const options = { skip: (page-1) * pageSize, limit: pageSize };

  if (
    searchValue.moneyTimeStart !== undefined &&
    searchValue.moneyTimeStart !== undefined
  ) {
    query.moneyTime = {
      $gte: new Date(searchValue.moneyTimeStart).getTime(),
      $lt: new Date(searchValue.moneyTimeEnd).getTime()
    };
  } else if (searchValue.moneyTimeStart !== undefined) {
    query.moneyTime = {
      $gte: new Date(searchValue.moneyTimeStart).getTime()
    };
  } else if (searchValue.moneyTimeEnd !== undefined) {
    query.moneyTime = {
      $lt: new Date(searchValue.moneyTimeEnd).getTime()
    };
  }

  if (
    searchValue.minValue !== undefined &&
    searchValue.maxValue !== undefined
  ) {
    query.value = {
      $gte: searchValue.minValue,
      $lte: searchValue.maxValue
    };
  } else if (searchValue.minValue !== undefined) {
    query.value = {
      $gte: searchValue.minValue
    };
  } else if (searchValue.maxValue !== undefined) {
    query.value = {
      $lte: searchValue.maxValue
    };
  }

  searchValue.type !== undefined && (query.type = searchValue.type);

  searchValue.categoryId !== undefined && (query.categoryId = searchValue.categoryId);

  searchValue.accountId !== undefined && (query.accountId = searchValue.accountId);
  Money.find(query)
    .setOptions(options)
    .exec(function(err, docs) {
      if (err)
        return res.send(response("查询账单失败", "query_money_error"));
      res.send(response("查询账单成功", null, docs));
    });  
});

module.exports = router;
