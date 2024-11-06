const ApplicationController = require('./ApplicationController');
const { menu } = require('../data/menu');

class ProductsController extends ApplicationController {
  constructor() {
    super();
    this.products = menu;
  }

  handleGetProducts = (req, res) => {
    res.status(200).json({
      status: 'Success getting all products.',
      data: this.products
    });
  }

  handleGetProductsById = (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = this.products.find((prod, index) => index === productId - 1);

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.'
      });
    }

    res.status(200).json({
      status: 'Success getting product by ID.',
      data: product
    });
  }
}

module.exports = ProductsController;
