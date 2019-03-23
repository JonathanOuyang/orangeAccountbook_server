const express = require("express");
const router = express.Router();
const Money = require("../models/Money");
const Account = require("../models/Account");
const Category = require("../models/Category");
const { response, getQuery, docsToObject } = require("../utils/utils");

router.post("/getMoneySum", async (req, res, next) => {
  try {
    const userId = req.userInfo.id;
    const searchValue = req.body.searchValue || {};
    const groupType = req.body.groupType || {};
    const groupParams = { type: "$type" };
    const sort = req.body.sort || -1;
    const sortParams = { type: -1 };
    const projectParams = { type: "$type", value: "$value" };
    const data = {};

    /* 
      groupType
      0: accountId,
      1: categoryId,
      2: day,
      3: month
    */
    if (groupType === 0) {
      groupParams.accountId = "$accountId";
      projectParams.accountId = "$accountId";
      data.accounts = await docsToObject(Account.find({ userId }));
      sortParams.value = sort;
    }

    if (groupType === 1) {
      groupParams.categoryId = "$categoryId";
      projectParams.categoryId = "$categoryId";
      data.categorys = {};
      sortParams.value = sort;
    }

    if (groupType === 2) {
      groupParams.day = "$day";
      projectParams.day = {
        $dateToString: { format: "%Y-%m-%d", date: "$moneyTime" }
      };
      sortParams.day = sort;
    }

    if (groupType === 3) {
      groupParams.month = "$month";
      projectParams.month = {
        $dateToString: { format: "%Y-%m", date: "$moneyTime" },
      };
      sortParams.day = sort;
    }

    data.result = await Money.aggregate([
      {
        $lookup: {
          from: "categorys",
          localField: "categoryId",
          foreignField: "_id",
          as: "category"
        }
      },
      { $match: getQuery(searchValue, userId) },
      { $project: projectParams },
      {
        $group: {
          _id: groupParams,
          value: { $sum: "$value" },
          count: { $sum: 1 }
        }
      },
      { $sort: sortParams }
    ]);

    if (data.categorys) {
      for (let idx = 0; idx < data.result.length; idx++) {
        const item = data.result[idx];
        const categoryId = item._id.categoryId;
        const category = await Category.findById(categoryId);
        data.categorys[categoryId] = category;
      }
    }
    return res.send(response("查询成功", null, data));
  } catch (error) {
    console.log("error: ", error);
    return res.send(response("查询失败", "query_error"));
  }
});

module.exports = router;
