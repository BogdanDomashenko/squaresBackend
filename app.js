const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const cors = require("cors");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const tokenRouter = require("./routes/token");
const userRouter = require("./routes/user");

const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();

app.use(
  cors({
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Access"],
    exposedHeaders: ["Authorization", "Access"],
    origin: ["http://localhost:3000"],
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { path: "/", secure: false, httpOnly: true, maxAge: 30000 },
  })
);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/token", tokenRouter);
app.use("/user", userRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

const start = async () => {
  const seedUsers = [
    {
      username: "admin",
      password: "abc1234;;",
      email: "admin@gmail.com",
      role: "admin",
    },
    {
      username: "test",
      password: "abc1234;;",
      email: "djewjedje@gmail.com",
      role: "user",
    },
    {
      username: "ivan",
      password: "abc1234;;",
      email: "98w7dmqwdmm@gmail.com",
      role: "user",
    },
    {
      username: "bogdan",
      password: "pass17snwj,,",
      email: "djewjedje@gmail.com",
      role: "user",
    },
  ];

  try {
    await mongoose.connect(process.env.MONGO_DB);
    await User.deleteMany({});
    await User.insertMany(seedUsers);
  } catch (e) {
    console.log(e);
  }
};

start();

module.exports = app;
