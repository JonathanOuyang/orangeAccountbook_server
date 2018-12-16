const express = require("express");
const router = express.Router();
const Money = require("../models/Money");
const User = require("../models/User");
const dataCtrl = require("../utils/dataCtrl");

/* GET users listing. */
router.post("/createMoney", function(req, res, next) {
  const data = req.body;
  const money = new Money(data);
  // saved!
  money.save(function(err, docs) {
    console.log(docs);

    // User.findByIdAndUpdate(data._user, {
    //   function(userErr, userDocs) {
    //     if (userErr) {
    //       console.error(userErr);
    //     }
    //     return;
    //   }
    // });
    if (err) {
      res.send({ code: 0 });
      console.error(err);
      return;
    }
    // saved!
    res.send({ code: 1 });
  });
});

router.post("/getDayMoneys", function(req, res, next) {
  const { userId, year, month, date } = req.body;
  const startDate = new Date(year, month - 1, date),
    endDate = new Date(year, month - 1, date + 1);
  const query = {
    time: { $gte: startDate.getTime(), $lt: endDate.getTime() },
    userId: userId
  };
  Money.find(query).exec(function(err, docs) {
    if (err) res.send({ code: 0, desc: err });
    res.send(docs);
  });
});

module.exports = router;
