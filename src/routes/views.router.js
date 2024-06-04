const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller.js");
const messagesController = require("../controllers/messages.controller.js");

// Rutas para vistas de productos
router.get("/products", productController.getProductsView);
router.get("/realTimeProducts", productController.getRealTimeProductsView);

// Ruta para cargar la página de chat
router.get("/chat", messagesController.getChatView);

// Rutas para registro y login
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

module.exports = router;
