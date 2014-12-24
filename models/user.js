"use strict";
var bcrypt = require("bcrypt");

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1,15],
          msg: "Please enter a name"
        },
        isUnique: function (name, done) {
          user.find({where: {name: name}})
          .done(function (err, user) {
            if(err) {
              done(err);
            }
            if(user) {
              done(new Error("Username is already taken, pick another name."));
            }
            done();
          });
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
          args: [5, 12],
          msg: "Please use a password between 5 and 12 characters."
        }
      }
    },
    confirmed: {
      type: DataTypes.STRING,
      validate: {
        passwordEquality: function() {
          if(this.password !== this.confirmed) {
            throw new Error("Passwords aren't equal, try again.");
          }
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