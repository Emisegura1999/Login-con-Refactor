const express = require("express");
const ProductManager = require("../controllers/product-manager.js");

const router = express.Router();
const productmanager = new ProductManager();

// RUTAS PARA PRODUCTOS

// MOSTRAR PRODUCTOS
router.get("/", async (req, res) => {
    try {
        const limit = req.query.limit;

        // Llamar al ProductManager para obtener productos
        const productList = await productmanager.getProducts();

        if (limit) {
            res.json(productList.slice(0, limit));
        } else {
            res.json(productList);
        }
    } catch (error) {
        console.error("Error al obtener productos:", error);
        return res.status(500).json({
            status: false,
            msg: "Error interno del servidor",
        });
    }
});

// MOSTRAR PRODUCTO POR ID
router.get("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid; 

        // Obtener producto por ID usando el ProductManager
        const product = await productmanager.getProductById(productId);

        if (product.status) { 
            return res.status(200).json({ 
                status: true, 
                product: product.product, 
                msg: "Producto encontrado exitosamente" 
            });
        } else {
            return res.status(404).json({ 
                status: false, 
                msg: "Producto no encontrado" 
            });
        }
    } catch (error) {
        console.error("Error al obtener el producto:", error.message); 
        return res.status(500).json({ 
            status: false, 
            msg: "Error interno del servidor" 
        });
    }
});

// AGREGAR PRODUCTO
router.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;

        const respuesta = await productmanager.addProduct({
            title, description, price, thumbnail, code, stock, status, category
        });

        if (respuesta.status) {
            return res.status(200).json(respuesta); 
        } else {
            return res.status(400).json(respuesta); 
        }
    } catch (error) {
        console.error("Error al agregar el producto:", error.message);
        return res.status(500).json({ status: false, msg: "Error interno del servidor" });
    }
});

// ACTUALIZAR PRODUCTO
router.put("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid; 
        const productData = req.body; 

        const respuesta = await productmanager.updateProduct(productId, productData);

        if (respuesta.status) {
            return res.status(200).json(respuesta); 
        } else {
            return res.status(400).json(respuesta);
        }
    } catch (error) {
        console.error("Error al actualizar el producto:", error.message);
        return res.status(500).json({ status: false, msg: "Error interno del servidor" });
    }
});

// BORRAR PRODUCTO
router.delete("/:pid", async (req, res) => {
    try {
        const productId = req.params.pid; 
        const respuesta = await productmanager.deleteProduct(productId);

        if (respuesta.status) {
            return res.status(200).json(respuesta); 
        } else {
            return res.status(404).json({
                status: false,
                msg: `Producto con ID ${productId} no encontrado.`
            }); 
        }
    } catch (error) {
        console.error("Error al borrar el producto:", error.message);
        return res.status(500).json({
            status: false,
            msg: "Error interno del servidor: " + error.message
        });
    }
});

module.exports = router;
