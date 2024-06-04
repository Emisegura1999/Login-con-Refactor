const cartService = require("../services/cart.service");

exports.createCart = async (req, res) => {
    try {
        const newCart = await cartService.createCart(req.body);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const cart = await cartService.getCartById(req.params.id);
        // console.log('Cart desde getCartById:', JSON.stringify(cart, null, 2)); //esta linea la usé para controlar que recibia de cart y que no me imprima [object object]
        res.render('carts', { cart });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const updatedCart = await cartService.updateCart(req.params.id, req.body);
        res.render(updatedCart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        await cartService.deleteCart(req.params.id);
        res.render({ message: "Carrito eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getCarts = async (req, res) => {
    try {
        const carts = await cartService.getCarts();
        res.render(carts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsFromCart = async (req, res) => {
    try {
        const cart = await cartService.getProductsFromCart(req.params.id);
        if (!cart) {
            res.status(404).json({ message: `Carrito no encontrado con ID ${req.params.id}` });
        } else {
            res.render('carts', { cart });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const cart = await cartService.addProductToCart(req.params.id, req.body.product, req.body.quantity);
        res.render('carts', { cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteProductById = async (req, res) => {
    try {
        const cart = await cartService.deleteProductById(req.params.id, req.params.productId);
        res.render('carts', { cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await cartService.clearCart(req.params.id);
        res.render('carts', { cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
