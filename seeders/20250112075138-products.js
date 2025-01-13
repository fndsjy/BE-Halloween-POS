'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('products', [
      { productId: 1, image: "images/Burger.jpeg", name: "Zombie Burger", price: 20000, desc: "A terrifying burger with green buns and a juicy beef patty that’ll bring you back to life!", maxStockCanBeMade: 10, createdAt: new Date(), updatedAt: new Date() },
      { productId: 2, image: "images/Sashimi.jpeg", name: "Ghostly Sashimi", price: 45000, desc: "Chillingly fresh slices of sashimi, to be caught under a full moon’s eerie glow.", maxStockCanBeMade: 15, createdAt: new Date(), updatedAt: new Date() },
      { productId: 3, image: "images/Doughnut.jpeg", name: "Vampire Doughnut", price: 22000, desc: "Sink your fangs into this red velvet doughnut oozing with dark berry filling.", maxStockCanBeMade: 20, createdAt: new Date(), updatedAt: new Date() },
      { productId: 4, image: "images/Pizza.jpeg", name: "Mummy Pizza", price: 28000, desc: "Wrapped in mozzarella ‘bandages’ and spiced with a dash of garlic.", maxStockCanBeMade: 12, createdAt: new Date(), updatedAt: new Date() },
      { productId: 5, image: "images/Chocolate.jpeg", name: "Witch’s Chocolate", price: 10000, desc: "A dark, enchanting chocolate treat with a sprinkle of mysterious magic.", maxStockCanBeMade: 18, createdAt: new Date(), updatedAt: new Date() },
      { productId: 6, image: "images/Candy.jpeg", name: "Ghoulish Candy", price: 3000, desc: "Sweet, sour, and a little sinister, these candies are a haunted delight!", maxStockCanBeMade: 25, createdAt: new Date(), updatedAt: new Date() },
      { productId: 7, image: "images/Cookies.jpeg", name: "Monster Cookies", price: 2000, desc: "Crunchy cookies with spooky eyes and a bite that'll keep you coming back.", maxStockCanBeMade: 30, createdAt: new Date(), updatedAt: new Date() },
      { productId: 8, image: "images/Lolipop.jpeg", name: "Skeleton Lollipop", price: 1500, desc: "Bone-shaped lollipops, perfect for trick-or-treaters with a sweet tooth.", maxStockCanBeMade: 22, createdAt: new Date(), updatedAt: new Date() },
      { productId: 9, image: "images/Cake.jpeg", name: "Haunted Cake", price: 75000, desc: "Layers of midnight-dark cake that hide ghostly secrets within each bite.", maxStockCanBeMade: 5, createdAt: new Date(), updatedAt: new Date() },
      { productId: 10, image: "images/Gimbap.jpeg", name: "Creepy Gimbap", price: 15000, desc: "Mysterious gimbap rolls with flavors that surprise and thrill with each bite.", maxStockCanBeMade: 8, createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('products', null, {});
  },
};
