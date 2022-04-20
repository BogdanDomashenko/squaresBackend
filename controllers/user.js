const User = require("../models/User");

class UserController {
  async data(req, res) {
    try {
      const user = await User.findOne({ email: res.locals.userEmail });

      return res.status(200).json({
        username: user.username,
        email: user.email,
        role: user.role,
      });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "User get data error" });
    }
  }
}

module.exports = new UserController();
