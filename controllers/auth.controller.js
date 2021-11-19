const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const sendEmail=require('../utils/nodemailer')

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
      });
    });
};
exports.forgotPassword = (req, res) => {
  User.findOne({ email: req.body.email }).exec((err, user) => {
    // if user email does not exists
    if (!user) {
      return res.status(400).send({
        message: "Email does not exists.",
      });
    }
    // if user email exists in the database
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: "15m", // 15 minutes
    });
    const link=`http://localhost:3001/resetpassword/${token}`;
    sendEmail(req.body.email, "Password reset", link);
    return res.status(200).send({
      message: "Password reset link has been sent to your email.",
    });
  });
};
exports.resetPassword=(req,res)=>{
  const Id=req.userId
  User.findOne({ _id:Id}).exec((err, user) => {
    let hash = bcrypt.hashSync(req.body.password, 8);
    user.password = hash;
    user.save();
    return res.status(200).send({
      message: "Password change succesfully ",
    });
  });
}