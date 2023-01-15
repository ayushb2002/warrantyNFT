const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const product = new Schema({
    itemId: {type: Number, unique: true, required: true, dropDups: true},
    name: {type: String},
    manufacturer: [{type: Schema.Types.ObjectId, ref: 'Company'}],
    model: {type: String},
    expiry: {type: Number},
    imgUrl: {type: String}
});

module.exports = mongoose.model('Product', product);