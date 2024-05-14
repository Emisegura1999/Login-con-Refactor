const mongoose = require('mongoose');
const CartsModel = require("../models/cart.model.js");
const ProductsModel = require('../models/products.model.js');

class CartManager {
    async addCart() {
        try {
            const newCart = new CartsModel({ products: [] });
            await newCart.save();
            return { success: true, cart: newCart, message: `Se agregó el carrito correctamente` };
        } catch (error) {
            return { success: false, message: "Error al agregar el carrito: " + error.message };
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        console.log(`Adding product ${productId} to cart ${cartId} with quantity ${quantity}`);
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                console.error(`Cart with ID ${cartId} not found`);
                return { success: false, message: `Cart not found` };
            }
            const product = await ProductsModel.findById(productId);
            if (!product) {
                console.error(`Product with ID ${productId} not found`);
                return { success: false, message: `Product not found` };
            }

            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: product._id, quantity });
            }

            await cart.save();
            console.log("Cart saved successfully");
            return { success: true, cart: cart, message: 'Producto agregado correctamente' };
        } catch (error) {
            return { success: false, message: "Error al agregar el producto: " + error.message };
        }
    }

    async getCarts() {
        try {
            const carts = await CartsModel.find();
            return { success: true, carts: carts, message: 'Carritos' };
        } catch (error) {
            return { success: false, message: "Error al intentar mostrar carritos: " + error.message };
        }
    }

    async getCartById(cartId) {
        try {
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return null;
            }
            const cart = await CartsModel.findById(cartId).populate('products.product');
            if (!cart) {
                return { success: false, message: "No hay carritos con ese ID" };
            }
            return { success: true, cart: cart, message: 'Carritos' };
        } catch (error) {
            console.error("Error en getCartById:", error);
            return { success: false, message: "Error al intentar mostrar el carrito: " + error.message };
        }
    }

    async deleteProductCart(cartId, productId) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                return { success: false, message: "Cart not found" };
            }
            cart.products = cart.products.filter(item => item.product.toString() !== productId);
            await cart.save();
            return { success: true, cart: cart, message: 'Producto borrado del carrito' };
        } catch (error) {
            return { success: false, message: "Error al intentar borrar producto del carrito: " + error.message };
        }
    }

    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                return { success: false, message: "Cart not found" };
            }
            cart.products = updatedProducts;
            cart.markModified('products');
            await cart.save();
            return { success: true, cart: cart, message: 'Carrito actualizado' };
        } catch (error) {
            return { success: false, message: "Error al intentar actualizar el carrito: " + error.message };
        }
    }

    async updateProductsQuantityCart(cartId, productId, newQuantity) {
        try {
            const cart = await CartsModel.findById(cartId);
            if (!cart) {
                return { success: false, message: "Cart not found" };
            }
            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);
            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;
                cart.markModified('products');
                await cart.save();
                return { success: true, cart: cart, message: 'Cantidad actualizada' };
            } else {
                return { success: false, message: "Producto no encontrado en el carrito" };
            }
        } catch (error) {
            return { success: false, message: "Error al intentar actualizar la cantidad de productos del carrito: " + error.message };
        }
    }

    async emptyCart(cartId) {
        try {
            const cart = await CartsModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );
            if (!cart) {
                return { success: false, message: "Cart not found" };
            }
            return { success: true, cart: cart, message: 'Carrito Vacio' };
        } catch (error) {
            return { success: false, message: "Error al intentar vaciar el carrito: " + error.message };
        }
    }
}

module.exports = CartManager;
