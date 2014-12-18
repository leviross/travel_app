"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("places", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      capital: {
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.INTEGER
      },
      lat: {
        type: DataTypes.INTEGER
      },
      lng: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("places").done(done);
  }
};