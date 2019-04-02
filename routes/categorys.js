const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { response } = require("../utils/utils");

// 查询分类
router.post("/getCategoryList", async (req, res) => {
  try {
    const query = {
      userId: req.userInfo.id,
      parentCategoryId: {$exists: false}
    };
    const categoryId = req.body.categoryId !== undefined && req.body.categoryId;
    req.body.status !== undefined && (query.status = req.body.status);
    req.body.type !== undefined && (query.type = req.body.type);
    if (categoryId) {
      const category = await Category.findById(categoryId);
      return res.send(response("查询分类成功", null, { detail: category }));
    } else {
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

    await Category.findByIdAndUpdate(query.categoryId, update);
    return res.send(response("更新成功"));
  } catch (error) {
    console.log(error);
    return res.send(response("更新失败", "query_error"));
  }
});

module.exports = router;
