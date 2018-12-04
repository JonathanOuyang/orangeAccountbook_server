const express = require("express");
const router = express.Router();
const User = require("../models/User");
const database = require("../controller/database");

/* GET users listing. */
router.post("/register", function(req, res, next) {
  const data = req.body;
  database.create(User, data, res);
});

router.post("/login", function(req, res, next) {
  const data = req.body;
  User.findOne({ email: data.email })
    .select("password")
    .exec(function(err, docs){
      if (err || !docs) {
        res.send({ code: 0 });
        console.error(err);
        return;
      } else if (docs) {
        if (data.password === docs.password) res.send({ code: 2 });
        else res.send({ code: 1 });
      }
    });
});

module.exports = router;
