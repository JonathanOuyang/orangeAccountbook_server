const express = require("express");
const router = express.Router();
const User = require("../models/User");
const dataCtrl = require("../utils/dataCtrl");

/* GET users listing. */
router.post("/createMoney", function(req, res, next) {
  const data = req.body;
  User.findByIdAndUpdate(data.userId, {$push: {moneys:data}} ,function(err, result) {
    if (err) {
        res.send({code: 0, desc: err})
    }
    res.send({code: 1})
  })
});

router.post("/getDayMoneys", function(req, res, next) {
  const startDate = new Date(year, month, day),
        endDate = new Date(year, month, day+1);
  User.where("date").gte(startDate).lt(endDate).exec(function (err, docs) {
      if(err) res.send({code: 0, desc: err})
      res.send(docs)
  });
});

module.exports = router;
