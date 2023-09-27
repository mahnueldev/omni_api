'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    refreshToken: {
      type: DataTypes.TEXT, // Use TEXT type for storing JSON as a string
      allowNull: true,
      defaultValue: JSON.stringify([]), // Default value is an empty array as a string
      get() {
        // Parse the JSON data when retrieving from the database
        const rawData = this.getDataValue('refreshToken');
        return rawData ? JSON.parse(rawData) : [];
      },
      set(value) {
        // Serialize the array as JSON when saving to the database
        this.setDataValue('refreshToken', JSON.stringify(value));
      },
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};