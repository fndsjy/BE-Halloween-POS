const ApplicationController = require('./ApplicationController');

class ProductsController extends ApplicationController {
  constructor(productModel) {
    super();
    this.productModel = productModel;
  }

  // Mendapatkan semua produk dari database
  handleGetProducts = async (req, res) => {
    try {
      const allProducts = await this.productModel.findAll();
      res.status(200).json({
        status: 'Success getting all products.',
        data: allProducts,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch products.',
        error: error.message,
      });
    }
  };

  // Mendapatkan produk berdasarkan ID dari database
  handleGetProductsById = async (req, res) => {
    const productId = parseInt(req.params.id, 10);

    try {
      const product = await this.productModel.findByPk(productId);

      if (!product) {
        return res.status(404).json({
          status: 'error',
          message: 'Product not found.',
        });
      }

      res.status(200).json({
        status: 'Success getting product by ID.',
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Failed to fetch product.',
        error: error.message,
      });
    }
  };
}

module.exports = ProductsController;
