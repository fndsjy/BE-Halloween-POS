const {
  ApplicationController,
  ProductsController,
  CartController
} = require("./controllers");

function apply(app) {
  const applicationController = new ApplicationController();
  const productsController = new ProductsController();
  const cartController = new CartController();

  // Root route
  app.get("/", applicationController.handleGetRoot);

  app.get("/api/products", productsController.handleGetProducts);
  app.get("/api/product/:id", productsController.handleGetProductsById);

  app.get("/api/carts", cartController.handleGetCart);
  app.post("/api/cart", cartController.handleAddToCart);
  app.put("/api/cart", cartController.handleUpdateCartItemQuantity);
  app.delete("/api/cart/:productId", cartController.handleDeleteCartItem);
  app.post("/api/checkout", cartController.handleCheckout);

  // Error handling
  app.use(applicationController.handleNotFound);
  app.use(applicationController.handleError);

  return app;
}

module.exports = { apply }
