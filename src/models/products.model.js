const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

// Definimos el esquema
const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: [String]
    },
    code: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    }
});


productsSchema.plugin(mongoosePaginate);


const ProductsModel = mongoose.model("products", productsSchema);

module.exports = ProductsModel;
