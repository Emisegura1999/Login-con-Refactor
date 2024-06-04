import CartModel from "../models/cart.model";

class CartRepository {
    async createCart(cartData) {
        const newCart = new CartModel(cartData);
        return await newCart.save();
    }

    async getCartById(cartId) {
        return await CartModel.findById(cartId).populate('products.product').lean();
    }

    async updateCart(cartId, cartData) {
        return await CartModel.findByIdAndUpdate(cartId, cartData, { new: true });
    }

    async deleteCart(cartId) {
        return await CartModel.findByIdAndDelete(cartId);
    }

    async getCarts() {
        return await CartModel.find();
    }

    async getProductsFromCart(cartId) {
        return await CartModel.findById(cartId).populate('products.product');
    }

    async addProductToCart(cartId, product, quantity) {
        const cart = await this.getCartById(cartId);
        const productId = product._id;
        const productIndex = cart.products.findIndex(p => p.product._id.toString() === productId);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        cart.markModified("products");
        return await cart.save();
    }

    async deleteProductById(cartId, productId) {
        const cart = await CartModel.findById(cartId);
        if (!cart) return null;
        const index = cart.products.findIndex(p => p.product.toString() === productId);
        if (index !== -1) {
            cart.products.splice(index, 1);
            await cart.save();
        }
        return cart;
    }

    async clearCart(cartId) {
        const products = [];
        return await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
    }
}

module.exports = new CartRepository();
