const express = require("express");
const router = express.Router();
const User = require("../models/User");
const response = require("../utils/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", (req, res) => {
  // console.log(req.body);
  //查询数据库中是否拥有邮箱
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "邮箱已被占用" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      //密码加密  需npm install bcrypt
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
          //store hash in your password DB.
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.send(response("注册账号成功")))
            .catch(err => {
              res.send(response("注册账号失败", "register_error"));
              console.log(err);
            });
        });
      });
    }
  });
});

router.post("/login",async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  //查询数据库
  const user = await User.findOne({ email });
  if (!user) {
    return res.send(response("账号不存在", "account_dont_exist"));
  }
  //密码匹配  使用token
  bcrypt.compare(password, user.password).then(isMatch => {
    if (isMatch) {
      const token = jwt.sign(
        {
          id: user._id
        },
        "orange",
        { expiresIn: "2d" }
      );
      res.send(response("登录成功", 0, {}, { token: token}));
    } else {
      return res.send(response("密码错误", "password_wrong")); //return res.status(400).json({password:"密码错误!"});
    }
  });
});

module.exports = router;
