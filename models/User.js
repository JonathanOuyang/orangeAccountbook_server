var mongoose = require("mongoose");
var mongodb = require("../controller/mongodb");
var Schema = mongodb.mongoose.Schema;

// 声明一个数据集 对象
var userSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// 将数据模型暴露出去
module.exports = mongoose.model('user', userSchema);