const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Category = require("../models/Category");
const { response } = require("../utils/utils");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// 查询分类
router.post("/getCategoryList", async (req, res) => {
  try {
    const query = {
      userId: req.userInfo.id,
      parentCategoryId: { $exists: false }
    };
    const categoryId = req.body.categoryId !== undefined && req.body.categoryId;
    req.body.status !== undefined && (query.status = req.body.status);
    req.body.type !== undefined && (query.type = req.body.type);
    req.body.showBudget !== undefined &&
      req.body.showBudget === true &&
      (query.budgetValue = { $gt: 0 });
    if (categoryId) {
      const category = await Category.findById(categoryId);
      return res.send(response("查询分类成功", null, { detail: category }));
    } else {
      console.log(query);
      let categorys = await Category.find(query).sort({ sort: 1 });
      return res.send(response("查询分类成功", null, { list: categorys }));
    }
  } catch (err) {
    console.log(err);
    return res.send(response("查询分类失败", "query_category_error"));
  }
});

// 更新分类
router.post("/updateCategory", async (req, res) => {
  try {
    const query = {
      _id: req.userInfo.id,
      categoryId: req.body.categoryId
    };
    const update = {};
    if (req.body.name !== undefined) {
      update.name = req.body.name;
    }
    if (req.body.status !== undefined) {
      update.status = req.body.status;
    }
    if (req.body.budgetValue !== undefined) {
      update.budgetValue = req.body.budgetValue;
    }

    await Category.findByIdAndUpdate(query.categoryId, update);
    if (req.body.budgetValue !== undefined) {
      const sum = await Category.aggregate([
        { $match: {userId: ObjectId(query._id)} },
        {
          $group: {
            _id: query,
            budgetValue: { $sum: "$budgetValue" },
            count: { $sum: 1 }
          }
        }
      ]);
      const userInfo = await User.findById(query._id);
      if (sum[0].budgetValue > userInfo.budgetValue) {
        await User.findByIdAndUpdate(query._id, {
          budgetValue: sum[0].budgetValue
        });
      }
    }
    return res.send(response("更新成功"));
  } catch (error) {
    console.log(error);
    return res.send(response("更新失败", "query_error"));
  }
});

module.exports = router;
