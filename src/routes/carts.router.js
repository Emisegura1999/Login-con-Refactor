const express = require("express");
const CartManager = require("../controllers/cart-manager.js");
const cartmanager = new CartManager();
const mongoose = require('mongoose');

const router = express.Router();

// Comenzar carrito nuevo 
router.post("/", async (req, res) => {
    try {
        const respuesta = await cartmanager.addCart(req.body);
        if (respuesta.status) {
            res.status(200).send(respuesta);
        } else {
            res.status(400).send(respuesta);
        }
    } catch (error) {
        res.status(500).send("Error interno del servidor: " + error.message);
    }
});

// Agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;
    try {
        const respuesta = await cartmanager.addProductToCart(cartId, productId, quantity);
        console.log("Response from addProductToCart:", respuesta);
        if (respuesta.status) {
            console.log("Returning success response");
            res.status(200).json(respuesta.cart);
        } else {
            console.log("Returning failure response");
            res.status(400).json({ error: respuesta.msg }); // Maneja errores
        }
    } catch (error) {
        console.error("Error in POST /:cid/product/:pid:", error.message);
        res.status(500).json({ error: "Internal Server Error" }); // Asegura que una respuesta se envíe
    }
});

// Ver carritos
router.get("/", async (req, res) => {
    try {
        const listaCarritos = await cartmanager.getCarts();
        res.status(200).send(listaCarritos);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});

// Buscar mi carrito
router.get("/:cid", async (req, res) => {
    try {
        const carritoId = req.params.cid;
        console.log(req.params.cid);
        const traerCarrito = await cartmanager.getCartById(carritoId);
        if (traerCarrito) {
            res.json({ status: true, traerCarrito });
        } else {
            res.status(404).json({ status: false, msg: "Carrito no encontrado" });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ status: false, msg: "Error al obtener carrito" });
    }
});

// Eliminamos un producto especifico del carrito
router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        // Validar los IDs
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            console.error(`cartId no válido: ${cartId}`);
            return res.status(400).json({ error: "cartId inválido" });
        }

        if (!mongoose.Types.ObjectId.isValid(productId)) {
            console.error(`productId no válido: ${productId}`);
            return res.status(400).json({ error: "productId inválido" });
        }

        console.log(`Deleting product ${productId} from cart ${cartId}`);
        const updatedCart = await cartmanager.deleteProductCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado del carrito correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar el producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

// Actualizamos productos del carrito
router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body.products;

    if (!updatedProducts || !Array.isArray(updatedProducts)) {
        return res.status(400).json({ error: "El cuerpo de la solicitud debe contener un array de productos" });
    }

    try {
        const updatedCart = await cartmanager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

// Actualizamos las cantidades de productos
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartmanager.updateProductsQuantityCart(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad del producto actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

// Vaciamos el carrito
router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;

        const updatedCart = await cartmanager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'Todos los productos del carrito fueron eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

module.exports = router;
