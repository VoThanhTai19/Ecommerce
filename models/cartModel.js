const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        },
        color: { type: mongoose.Schema.Types.ObjectId, ref: 'Color' },
        quantity: Number,
        price: Number,
    },
    { timestamps: true },
);

//Export the model
module.exports = mongoose.model('Cart', cartSchema);
