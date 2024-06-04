import express from "express";
const router = express.Router();
const cartController = require("../controllers/cart.controller.js");

router.post("/", cartController.createCart);
router.get("/", cartController.getCarts);
router.get("/:id", cartController.getCartById);
router.put("/:id", cartController.updateCart);
router.delete("/:id", cartController.deleteCart);
router.get("/:id/products", cartController.getProductsFromCart);
router.post("/:id/products", cartController.addProductToCart);
router.delete("/:id/products/:productId", cartController.deleteProductById);
router.post("/:id/clear", cartController.clearCart);

module.exports = router;
