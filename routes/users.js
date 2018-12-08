const express = require("express");
const router = express.Router();
const User = require("../models/User");
const dataCtrl = require("../utils/dataCtrl");

const LOGIN_STATUS = new Map([
  [0, "查询失败"],
  [1, "登录成功"],
  [2, "密码错误"],
  [3, "用户不存在"]
]);

const getLoginStatu = code => ({
  code: code,
  desc: LOGIN_STATUS.get(code)
});

/* GET users listing. */
router.post("/createUser", function(req, res, next) {
  const data = req.body;
  dataCtrl.create(User, data, res);
});

router.post("/checkUserLogin", function(req, res, next) {
  const data = req.body;
  User.findOne({ email: data.email })
    .select("password")
    .exec(function(err, docs) {
      if (err) {
        res.send(getLoginStatu(0));
        console.error(err);
      } else if (docs) {
        if (docs.password) {
          res.send(getLoginStatu(data.password === docs.password ? 1 : 2));
        } else {
          res.send(getLoginStatu(3));
        }
      }
    });
});

module.exports = router;
