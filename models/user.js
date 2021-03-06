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
        models.user.hasMany(models.place, {onDelete: 'CASCADE', hooks: true});
        models.user.hasMany(models.review, {through: models.place});
      }
    },
    hooks: {
      beforeCreate: function (data, garbage, sendback) {
        var pwdToEncrypt = data.password;
        bcrypt.hash(pwdToEncrypt, 10, function (err, hash) {
          data.password = hash;
          sendback(null, data);
        })
      },
      //ADDED THIS, NO CLUE WHY THIS WONT HASH THE 2ND CONFIRM PASSWORD ON SIGNUP!!!! 
      beforeCreate2: function (data2, garbage, sendback) {
        var pwdToEncrypt2 = data2.confirmed;
        bcrypt.hash(pwdToEncrypt2, 10, function (err, hash) {
          data2.confirmed = hash;
          sendback(null, data2);
        })
      } 
    }
  });

return user;
};