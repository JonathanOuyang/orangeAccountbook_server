const jwt = require("jsonwebtoken");
const {response} = require("./utils");
const unless = require("express-unless");

module.exports = function(options) {
  let decodeToken = function(req, res, next) {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
    if (token) {
      jwt.verify(token, "orange", function(err, decoded) {
        if (err) {
          return res.send(response("token信息错误", "token_wrong"));
        } else {
          req.userInfo = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send(response("未找到token", "token_not_found"));
    }
  };
  decodeToken.unless = unless;
  return decodeToken;
};
