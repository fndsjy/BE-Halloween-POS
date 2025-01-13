const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const {
  ApplicationController,
  AuthenticationController,
  ProductsController,
  CartController
} = require("./controllers");

const { 
  users,
  products,
  cartItems
} = require("./models");

function apply(app) {
  const userModel = users;
  const productModel = products;
  const cartItemModel = cartItems;

  const applicationController = new ApplicationController();
  const authenticationController = new AuthenticationController({ bcrypt, jwt, userModel });
  const productsController = new ProductsController(productModel);
  const cartController = new CartController(cartItemModel, productModel);

  // Root route
  app.get("/", applicationController.handleGetRoot);

  // Auth routes
  app.post("/auth/register", authenticationController.handleRegister);
  app.post("/auth/login", authenticationController.handleLogin);
  app.get("/auth/users", authenticationController.handleGetAllUsers);
  app.get("/auth/whoami", authenticationController.authorize(), authenticationController.handleGetUser);

  app.get("/api/products", productsController.handleGetProducts);
  app.get("/api/product/:id", productsController.handleGetProductsById);

  // Cart routes (protected by authentication)
  app.get("/api/carts", authenticationController.authorize(), cartController.handleGetCart);
  app.post("/api/cart", authenticationController.authorize(), cartController.handleAddToCart);
  app.put("/api/cart", authenticationController.authorize(), cartController.handleUpdateCartItemQuantity);
  app.delete("/api/cart/:productId", authenticationController.authorize(), cartController.handleDeleteCartItem);
  app.post("/api/checkout", authenticationController.authorize(), cartController.handleCheckout);

  // Error handling
  app.use(applicationController.handleNotFound);
  app.use(applicationController.handleError);

  return app;
}

module.exports = { apply }
