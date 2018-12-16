let dataCtrl = {
  create: (model, data, res) => {
    model.create(data, function(err, docs) {
      if (err) {
        res.send({ code: 0 });
        console.error(err);
        return;
      }
      // saved!
      res.send({ code: 1 });
    });
  }
};

module.exports = dataCtrl;
