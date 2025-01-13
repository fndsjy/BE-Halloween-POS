'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cartItems extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // models/cartItems.js
    static associate(models) {
      // CartItem belongs to Product
      this.belongsTo(models.products, {
        foreignKey: 'productId'
      });
    }
  }
  cartItems.init({
    cartId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cartItems',
  });
  return cartItems;
};