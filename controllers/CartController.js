const ApplicationController = require('./ApplicationController');
const { menu } = require('../data/menu'); // Produk yang tersedia

class CartController extends ApplicationController {
  constructor() {
    super();
    this.cart = [];
  }

  // Mendapatkan seluruh item di keranjang
  handleGetCart = (req, res) => {
    res.status(200).json({
      status: 'Success',
      cart: this.cart
    });
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

    const product = menu.find(item => item.productId === productId);

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

    // Tambah atau update item di keranjang
    const cartItem = this.cart.find(item => item.productId === productId);
    if (cartItem) {
      cartItem.quantity += quantity; // Update jumlah
      product.maxStockCanBeMade -= quantity; // Update stok maksimum produk di menu
      cartItem.maxStockCanBeMade = product.maxStockCanBeMade; // Update stok maksimum di cart
    } else {
      // Update stok maksimum produk di menu dan tambahkan ke keranjang
      product.maxStockCanBeMade -= quantity;
      this.cart.push({ ...product, quantity, maxStockCanBeMade: product.maxStockCanBeMade });
    }

    res.status(200).json({
      status: 'Success adding product to cart.',
      cart: this.cart
    });
  };

  handleUpdateCartItemQuantity = async (req, res) => {
    const { productId, action } = req.body;
  
    if (!productId || !action) {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid product ID or action.'
      });
    }
  
    const cartItem = this.cart.find(item => item.productId === productId);
    const product = menu.find(item => item.productId === productId);
  
    if (!cartItem || !product) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart or product not available.'
      });
    }
  
    let newQuantity = cartItem.quantity;
    const maxStockAvailable = product.maxStockCanBeMade;
  
    if (action === "add") {
      if (maxStockAvailable > 0) {
        newQuantity += 1;  // Menambah satu unit
        product.maxStockCanBeMade -= 1; // Kurangi stok produk
      } else {
        return res.status(400).json({
          status: 'error',
          message: `Only ${maxStockAvailable} units available for this product.`
        });
      }
    } else if (action === "subtract") {
      if (newQuantity > 1) {
        newQuantity -= 1;  // Mengurangi satu unit
        product.maxStockCanBeMade += 1; // Kembalikan stok produk
      } else {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot reduce quantity below 1.'
        });
      }
    }
  
    // Update kuantitas produk di keranjang dan stok produk
    cartItem.quantity = newQuantity;
    cartItem.maxStockCanBeMade = product.maxStockCanBeMade;
  
    res.status(200).json({
      status: 'Success updating cart item quantity.',
      cart: this.cart
    });
  };  

  // Menghapus item dari keranjang
  handleDeleteCartItem = (req, res) => {
    const { productId } = req.params;
    const product = menu.find(item => item.productId === parseInt(productId, 10));

    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'Product not found.'
      });
    }

    const itemIndex = this.cart.findIndex(item => item.productId === parseInt(productId, 10));

    if (itemIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Item not found in cart.'
      });
    }

    // Kembalikan stok maksimum saat menghapus dari keranjang
    const cartItem = this.cart[itemIndex];
    product.maxStockCanBeMade += cartItem.quantity;

    // Hapus item dari keranjang
    this.cart.splice(itemIndex, 1);

    res.status(200).json({
      status: 'Success deleting item from cart.',
      cart: this.cart
    });
  };

  handleCheckout = async (req, res) => {
    try {
      // Proses setiap item dalam keranjang
      this.cart.forEach(cartItem => {
        const product = menu.find(item => item.productId === cartItem.productId);
  
        if (!product) {
          return res.status(404).json({
            status: 'error',
            message: `Product with ID ${cartItem.productId} not found in menu.`
          });
        }
      });
  
      // Clear cart setelah checkout berhasil
      this.cart = [];
  
      res.status(200).json({
        status: 'Success',
        message: 'Checkout successful. Cart has been cleared.',
        cart: this.cart
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'An unexpected error occurred during checkout.'
      });
    }
  };  
}

module.exports = CartController;
