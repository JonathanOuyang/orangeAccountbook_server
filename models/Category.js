const mongoose = require("mongoose");
const mongodb = require("../utils/mongodb");
const Schema = mongodb.mongoose.Schema;

const categoryScheme = new Schema({
  name: {
    type: String
  },
  icon: {
    type: String
  },
  type: {
    type: Number
  },
  sort: {
    type: Number
  },
  status: {
    type: Number,
    default: 1
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  },
  // 预算
  budgetValue: {
    type: Number,
    default: 0
  }
});

categoryScheme.index({ userId: 1 });


module.exports = mongoose.model("category", categoryScheme);