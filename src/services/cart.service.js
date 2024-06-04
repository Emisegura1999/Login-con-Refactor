import cartRepository from "../repositories/cart.repository.js";

class CartService {
    async createCart(cartData) {
        return await cartRepository.createCart(cartData);
    }

    async getCartById(cartId) {
        return await cartRepository.getCartById(cartId);
    }

    async updateCart(cartId, cartData) {
        return await cartRepository.updateCart(cartId, cartData);
    }

    async deleteCart(cartId) {
        return await cartRepository.deleteCart(cartId);
    }

    async getCarts() {
        return await cartRepository.getCarts();
    }

    async getProductsFromCart(cartId) {
        return await cartRepository.getProductsFromCart(cartId);
    }

    async addProductToCart(cartId, product, quantity = 1) {
        return await cartRepository.addProductToCart(cartId, product, quantity);
    }

    async deleteProductById(cartId, productId) {
        return await cartRepository.deleteProductById(cartId, productId);
    }

    async clearCart(cartId) {
        return await cartRepository.clearCart(cartId);
    }
}

module.exports = new CartService();
