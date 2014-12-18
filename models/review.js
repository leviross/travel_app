"use strict";

module.exports = function(sequelize, DataTypes) {
  var review = sequelize.define("review", {
    userId: DataTypes.INTEGER,
    placeId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.review.belongsTo(models.user);
        models.review.belongsTo(models.place);
      }
    }
  });

  return review;
};
