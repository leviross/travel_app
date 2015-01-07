"use strict";

module.exports = function(sequelize, DataTypes) {
  var place = sequelize.define("place", {
    name: DataTypes.STRING,
    capital: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    lat: DataTypes.INTEGER,
    lng: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.place.hasMany(models.review, {onDelete: 'CASCASE', hooks: true});
        models.place.belongsTo(models.user);
      }
    }
  });

  return place;
};
