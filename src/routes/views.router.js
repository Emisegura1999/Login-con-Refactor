const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/product-manager.js");
const CartManager = require("../controllers/cart-manager.js");
const productmanager = new ProductManager();
const cartmanager = new CartManager();
const ProductsModel = require("../models/products.model.js");

// RUTAS DE VISTAS

// Página de productos
router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2, sort, query } = req.query;
    const productList = await productmanager.getProducts({ page: parseInt(page), limit: parseInt(limit), sort, query });

    if (!productList || !productList.docs || !Array.isArray(productList.docs)) {
      throw new Error("Lista de productos no válida");
    }

    res.render("home", {
      products: productList.docs,
      hasPrevPage: productList.hasPrevPage,
      hasNextPage: productList.hasNextPage,
      prevPage: productList.prevPage,
      nextPage: productList.nextPage,
      currentPage: productList.page,
      totalPages: productList.totalPages,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error.message);
    res.status(500).json({
      status: "error",
      error: "Error interno del servidor",
    });
  }
});

// Página de carritos
router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const carrito = await cartmanager.getCartById(cartId);

    if (!carrito) {
      console.log("No existe ese carrito con el id");
      return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const productosEnCarrito = carrito.products.map(item => ({
      product: item.product.toObject(),
      quantity: item.quantity
    }));


    res.render("carts", { productos: productosEnCarrito });
  } catch (error) {
    console.error("Error al obtener el carrito", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Página para sockets
router.get("/socket", async (req, res) => {
  try {
    res.render("socket");
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Página para productos en tiempo real
router.get("/realTimeProducts", async (req, res) => {
  try {
    const products = await productmanager.getProducts();
    res.render("realTimeProducts", { products: products });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// Página de chat
router.get("/chat", async (req, res) => {
  res.render("chat");
});

//Login

router.get("/login", (req, res) => {

  if (req.session.login) {
    return res.redirect("/login");
  }

  res.render("login");
});

// Ruta para el formulario de registro
router.get("/register", (req, res) => {

  if (req.session.login) {
    return res.redirect("/profile");
  }
  res.render("register");
});

// Ruta para la vista de perfil
router.get("/profile", (req, res) => {

  if (!req.session.login) {
    return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user });
});

module.exports = router;
