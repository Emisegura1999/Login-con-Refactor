const ProductsModel = require("../models/products.model.js");

class ProductManager {
    async addProduct({ title, description, price, thumbnail = [], code, stock, status, category }) {
        try {
            if (!title || !description || !price || !code || !stock || !status || !category) {
                return { success: false, message: "Error al agregar el producto, por favor completar los campos faltantes " };
            }
            const existeProducto = await ProductsModel.findOne({ code: code });
            if (existeProducto) {
                return { success: false, message: `Error al agregar el producto, ${code} repetido: ` };
            };

            const nuevoProducto = new ProductsModel({
                title,
                description,
                price,
                code,
                stock,
                category,
                status: true,
                thumbnail: thumbnail || []
            });

            await nuevoProducto.save();
            return { success: true, product: nuevoProducto, message: "Producto agregado exitosamente" };
        } catch (error) {
            return { success: false, message: "Error al agregar el producto: " + error.message };
        }
    }

    async getProducts({ limit = 10, page = 1, sort, query } = {}) {
        try {
            const options = {
                page,
                limit,
                lean: true,
            };

            if (sort) {
                options.sort = { price: sort === 'asc' ? 1 : -1 };
            }

            if (query) {
                options.query = { category: query };
            }

            const productList = await ProductsModel.paginate({}, options);

            return productList;
        } catch (error) {
            console.error("Error al obtener productos:", error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const producto = await ProductsModel.findById(id);
            if (!producto) {
                return { success: false, message: `Producto con ID ${id} no encontrado` };
            } else {
                return { success: true, product: producto, message: `Producto ID: ${id} encontrado exitosamente` };
            }
        } catch (error) {
            return { success: false, message: `Producto con ID ${id} no encontrado` + error.message };
        }
    };

    async deleteProduct(id) {
        try {
            const deleteProduct = await ProductsModel.findByIdAndDelete(id);
            if (!deleteProduct) {
                return { success: false, message: `Producto con ID  ${id} no encontrado` };
            }
            return { success: true, delete: deleteProduct, message: `Producto con ID ${id} eliminado correctamente` };
        } catch (error) {
            return { success: false, message: "Error al intentar borrar el producto: " + error.message };
        }
    }
    async updateProduct(id, productoActualizado) {
        try {
            const updateProduct = await ProductsModel.findByIdAndUpdate(id, productoActualizado, { new: true });
            if (!updateProduct) {
                return { success: false, message: `Producto con ID ${id} no encontrado` };
            }

            return { success: true, product: updateProduct, message: `Producto con ID ${id} actualizado correctamente` };
        } catch (error) {
            return { success: false, message: "Error al intentar modificar el producto: " + error.message };
        }
    }
};

module.exports = ProductManager;
