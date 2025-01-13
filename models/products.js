'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // models/products.js
    static associate(models) {
      // Product has many CartItems
      this.hasMany(models.cartItems, {
        foreignKey: 'productId'
      });
    }
  }
  products.init({
    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    price: DataTypes.INTEGER,
    desc: DataTypes.STRING,
    maxStockCanBeMade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'products',
  });
  return products;
};