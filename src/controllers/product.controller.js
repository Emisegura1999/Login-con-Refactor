const productService = require("../services/product.service");

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await productService.addProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.json(product);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsView = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort, category, available } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
        };
        const filter = {};
        if (category) filter.category = category;
        if (available !== undefined) filter.status = available;
        
        const products = await productService.getProducts(filter, options);
        const productsData = products.docs.map(doc => doc.toObject());

        const startPage = Math.max(1, products.prevPage);
        const endPage = Math.min(products.totalPages, products.nextPage);
        const pagesInRange = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);

        res.render("home", { products: { ...products, docs: productsData, pagesInRange } });
    } catch (error) {
        console.log("No se pudieron obtener los productos");
        res.status(500).json({ error: "Error interno del servidor" });
    }
};

exports.getRealTimeProductsView = async (req, res) => {
    try {
        const products = await productService.getProducts();
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).send("Error interno del servidor");
    }
};
