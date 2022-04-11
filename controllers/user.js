class user {
  async data(req, res) {
    try {
      res.status(200).send("kedkdk");
    } catch (e) {
      console.log(e);
      return res.status(400).json({ message: "User get data error" });
    }
  }
}

module.exports = new user();
