const express = require("express");
const router = express.Router();
const User = require("../models/User");
const response = require("../utils/response");

/* GET users listing. */
router.post("/createUser", function(req, res, next) {
  const data = req.body;
  User.create(data, function(err, docs) {
    if (err) {
      res.send(response("注册账号失败", {}, "register_error"));
      console.error(err);
      return;
    }
    res.send(response("注册账号成功"));
  });
});

router.post("/checkUserLogin", function(req, res, next) {
  const data = req.body;
  User.findOne({ email: data.email })
    .select("password")
    .exec(function(err, docs) {
      if (err) {
        res.send(response("账号查询失败", {}, "query_user_error"));
        console.error(err);
      } else if (docs) {
        if (docs.password) {
          res.send(
            data.password === docs.password
              ? response("登录成功")
              : response("密码错误", {}, "password_wrong")
          );
        }
      } else {
        res.send(response("账号不存在", {}, "account_dont_exist"));
      }
    });
});

module.exports = router;
