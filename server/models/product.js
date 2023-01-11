const mongoose = require('mongoose')
var Schema = mongoose.Schema;

const product = new Schema({
    name: String,
    manufacturer: [{type: Schema.Types.ObjectId, ref: 'Company'}],
    model: String,
    details: String
});

module.exports = mongoose.model('Product', product);