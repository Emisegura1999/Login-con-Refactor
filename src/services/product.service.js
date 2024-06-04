import productRepository from "../repositories/products.repository.js";

class ProductService {
    async addProduct(productData) {
        const { title, description, price, thumbnails, code, stock, category } = productData;
        if (!title || !description || !price || !thumbnails || !code || !stock || !category) {
            throw new Error("El producto no puede tener campos vacíos");
        }

        const productExists = await productRepository.getProducts({ code });
        if (productExists.length > 0) {
            throw new Error("Ya existe un producto con ese código");
        }

        return await productRepository.addProduct(productData);
    }

    async getProducts(filter = {}, options = {}) {
        return await productRepository.getProducts(filter, options);
    }

    async getProductById(id) {
        const product = await productRepository.getProductById(id);
        if (!product) {
            throw new Error(`El producto con el ID ${id} no fue encontrado`);
        }
        return product;
    }

    async updateProduct(id, updatedProduct) {
        const product = await productRepository.updateProduct(id, updatedProduct);
        if (!product) {
            throw new Error(`El producto con el ID ${id} no existe`);
        }
        return product;
    }

    async deleteProduct(id) {
        const product = await productRepository.deleteProduct(id);
        if (!product) {
            throw new Error(`No hay productos con el ID ${id}`);
        }
        return product;
    }
}

module.exports = new ProductService();

