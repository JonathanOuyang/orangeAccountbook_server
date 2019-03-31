const mongoose = require("mongoose");
const mongodb = require("../utils/mongodb");
const Schema = mongodb.mongoose.Schema;

const categoryScheme = new Schema({
  name: {
    type: String,
    required: true
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
  parentCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "category"
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true
  }
});

categoryScheme.index({ userId: 1 });


module.exports = mongoose.model("category", categoryScheme);