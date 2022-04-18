const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

function hash(password) {
  return bcrypt.hashSync(password, 3);
}

const seedUsers = [
  {
    username: "admin",
    password: hash("abc1234;;"),
    email: "admin@gmail.com",
    role: "admin",
  },
  {
    username: "test",
    password: hash("abc1234;;"),
    email: "djewjedje@gmail.com",
    role: "user",
  },
  {
    username: "ivan",
    password: hash("abc1234;;"),
    email: "98w7dmqwdmm@gmail.com",
    role: "user",
  },
  {
    username: "bogdan",
    password: hash("pass17snwj,,"),
    email: "djewjedje@gmail.com",
    role: "user",
  },
];

try {
  mongoose.connect(process.env.MONGO_DB).then(async () => {
    await User.deleteMany({});
    await User.insertMany(seedUsers);
    mongoose.connection.close();
  });
  console.log("Seed success");
} catch (e) {
  console.log(e);
}
