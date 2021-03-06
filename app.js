var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var lessMiddleware = require("less-middleware");
var cors = require("cors");

const decodeToken = require("./utils/decodeToken");

var index = require("./routes/index");
var users = require("./routes/users");
var moneys = require("./routes/moneys");
var accounts = require("./routes/accounts");
var categorys = require("./routes/categorys");
var statistics = require("./routes/statistics");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public")));

//设置跨域访问
app.use(cors());

app.use(
  decodeToken().unless({
    path: [
      { url: "/users/login", methods: ["POST"] },
      { url: "/users/register", methods: ["POST"] }
    ]
  })
);

app.use("/users", users);
app.use("/moneys", moneys);
app.use("/accounts", accounts);
app.use("/categorys", categorys);
app.use("/statistics", statistics);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
