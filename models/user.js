"use strict";
var bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,50],
          msg: "Please enter a name"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: "Please enter a valid email address."
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [5, 100],
          msg: "Please use a password between 5 and 100 letters."
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.user.hasMany(models.place);
        models.user.hasMany(models.review);
      }
    },
    hooks: {
      beforeCreate: function (data, garbage, sendback) {
        var pwdToEncrypt = data.password;
        bcrypt.hash(pwdToEncrypt, 10, function (err, hash) {
          data.password = hash;
          sendback(null, data);
        })
      }
    }
  });

  return user;
};
