const UserModel = require("../models/User");

class Users {
  async getListByIds(req, res) {
    try {
      const ids = req.body;

      if (!ids)
        return res
          .status(400)
          .json({ message: "'ids' parameter must be passed" });

      if (!ids.length)
        return res.status(400).json({ message: "'ids' must have a length" });

      const users = (await UserModel.find({ _id: { $in: ids } })).map(
        ({ _id: id, email, username, role }) => {
          return { id, email, username, role };
        }
      );

      res.status(200).json(users);
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "Get users error" });
    }
  }
}

module.exports = new Users();
