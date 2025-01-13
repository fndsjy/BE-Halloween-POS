const ApplicationController = require('./ApplicationController');

class CartController extends ApplicationController {
  constructor(cartItemModel, productModel) {
    super();
    this.cartItemModel = cartItemModel;
    this.productModel = productModel;
  }

  // Mendapatkan seluruh item di keranjang
  handleGetCart = async (req, res) => {
    try {
      const cart = await this.cartItemModel.findAll({ include: this.productModel });
      res.status(200).json({
        status: 'Success',
        cart
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  // Menambahkan produk ke keranjang
  handleAddToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID or quantity.'
      });
    }

    try {
      const product = await this.productModel.findByPk(productId);
      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found.'
        });
      }

      if (quantity > product.maxStockCanBeMade) {
        return res.status(400).json({
          status: 'error',
          message: `Only ${product.maxStockCanBeMade} units available for this product.`
        });
      }

      const [cartItem, created] = await this.cartItemModel.findOrCreate({
        where: { productId },
        defaults: { quantity }
      });

      if (!created) {
        cartItem.quantity += quantity;
        await cartItem.save();
      }

      product.maxStockCanBeMade -= quantity;
      await product.save();

      res.status(200).json({
        status: 'Success adding product to cart.',
        cartItem
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  handleUpdateCartItemQuantity = async (req, res) => {
    const { productId, action } = req.body;

    if (!productId || !action) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID or action.'
      });
    }

    try {
      const cartItem = await this.cartItemModel.findOne({ where: { productId } });
      const product = await this.productModel.findByPk(productId);

      if (!cartItem || !product) {
        return res.status(404).json({
          status: 'error',
          message: 'Item not found in cart or product not available.'
        });
      }

      if (action === 'add') {
        if (product.maxStockCanBeMade > 0) {
          cartItem.quantity += 1;
          product.maxStockCanBeMade -= 1;
        } else {
          return res.status(400).json({
            status: 'error',
            message: 'No stock available.'
          });
        }
      } else if (action === 'subtract') {
        if (cartItem.quantity > 1) {
          cartItem.quantity -= 1;
          product.maxStockCanBeMade += 1;
        } else {
          return res.status(400).json({
            status: 'error',
            message: 'Cannot reduce quantity below 1.'
          });
        }
      }

      await cartItem.save();
      await product.save();

      res.status(200).json({
        status: 'Success updating cart item quantity.',
        cartItem
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  handleDeleteCartItem = async (req, res) => {
    const { productId } = req.params;

    try {
      const cartItem = await this.cartItemModel.findOne({ where: { productId } });
      const product = await this.productModel.findByPk(productId);

      if (!cartItem || !product) {
        return res.status(404).json({
          status: 'error',
          message: 'Item not found in cart or product not available.'
        });
      }

      product.maxStockCanBeMade += cartItem.quantity;
      await product.save();

      await cartItem.destroy();

      res.status(200).json({
        status: 'Success deleting item from cart.'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };

  handleCheckout = async (req, res) => {
    try {
      const cartItems = await this.cartItemModel.findAll();

      for (const cartItem of cartItems) {
        const product = await this.productModel.findByPk(cartItem.productId);
        if (!product) {
          return res.status(404).json({
            status: 'error',
            message: `Product with ID ${cartItem.productId} not found in menu.`
          });
        }
      }

      await this.cartItemModel.destroy({ where: {} });

      res.status(200).json({
        status: 'Success',
        message: 'Checkout successful. Cart has been cleared.'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  };
}

module.exports = CartController;