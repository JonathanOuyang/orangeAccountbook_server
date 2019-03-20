const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { response } = require("../utils/utils");

// 查询分类
router.post("/getCategoryList", async (req, res) => {
  try {
    const query = {
      _id: req.userInfo.id
    };
    // const elemMatch = {};
    // if (req.body.status !== undefined) {
    //   query["categorys.status"] = req.body.status;
    // }
    // if (req.body.type !== undefined) {
    //   query["categorys.type"] = req.body.type;
    //   elemMatch["categorys.type"] = req.body.type;
    // }
    const categoryId = req.body.categoryId;
    const status = req.body.status;
    const type = req.body.type;
    if (categoryId) {
      const user = await User.findById(query._id);
      const category = user.categorys.id(categoryId);
      return res.send(response("查询分类成功", null, { detail: category }));
    } else {
      let categorys = (await User.findById(query._id).select("categorys"))
        .categorys;
      // for (let index = 0; index < categorys.length; index++) {
      //   const elem = categorys[index];

      // }
      categorys = categorys.filter(
        item => 
          (status !== undefined ? item.status === status : true) &&
          (type !== undefined ? item.type === type : true)
      );
      return res.send(response("查询分类成功", null, { list: categorys }));
    }
  } catch (err) {
    return res.send(response("查询分类失败", "query_category_error"));
  }
});

// 更新分类
router.post("/updateCategory", async (req, res) => {
  try {
    const query = {
      _id: req.userInfo.id,
      "categorys._id": req.body.categoryId
    };
    const set = {};
    if (req.body.name !== undefined) {
      set["categorys.$.name"] = req.body.name;
    }
    if (req.body.status !== undefined) {
      set["categorys.$.status"] = req.body.status;
    }
    const result = await User.update(query, {
      $set: set
    });

    return res.send(response("更新成功", null, result));
  } catch (error) {
    console.log(error);
    return res.send(response("更新失败", "query_error"));
  }
});

module.exports = router;
