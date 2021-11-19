const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};
exports.changePassword = (req, res) => {
  User.findOne({ _id: req.userId }).exec((err, user) => {
    var passwordIsValid = bcrypt.compareSync(
      req.body.oldpassword,
      user.password
    );
    if (passwordIsValid) {
      let hash = bcrypt.hashSync(req.body.newpassword, 8);
      user.password = hash;
      user.save();
      return res.status(200).send({
        message: "Password change succesfully ",
      });
    } else {
      return res.status(401).send({
        message: "Invalid Password!",
      });
    }
  });
};
