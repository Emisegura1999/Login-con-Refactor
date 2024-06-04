import ProductModel from "../models/products.model.js";

class ProductRepository {
    async addProduct(productData) {
        const newProduct = new ProductModel(productData);
        return await newProduct.save();
    }

    async getProducts(filter = {}, options = {}) {
        return await ProductModel.paginate(filter, options);
    }

    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async updateProduct(id, updatedProduct) {
        return await ProductModel.findByIdAndUpdate(id, updatedProduct, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}

module.exports = new ProductRepository();
